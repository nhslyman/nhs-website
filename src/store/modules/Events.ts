import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import Vue from "vue";
import { plainToClass, classToPlain } from "class-transformer";
import { EventInfo, RSVP, PlainDate, UserAttributes } from "@/models";
import { db } from "@/main";
import { deepCopy, Dict, VoidAction } from '@/util';

@Module({ namespaced: true })
export default class Events extends VuexModule {
  // properties
  private events: Dict<EventInfo> = {};
  private unsubscribes: Dict<VoidAction> = {};
  private initialSetUpOccurred = false;

  get eventsDict() {
    return this.events;
  }

  // TODO: move to query to reduce database reads
  get futureEvents(): EventInfo[] {
    let array = Object.values(this.events);
    // shifts are assumed to be in order
    array = array.filter(
      (event) =>
        event instanceof EventInfo && // check that nothing strange slipped in
        event.shifts[event.shifts.length - 1].time.day.comparable > // check that the last shift is in a past day
        PlainDate.yesterday().comparable
    );
    return array;
  }

  // TODO: move to query to reduce database reads
  get pastEvents(): EventInfo[] {
    let array = Object.values(this.events);
    // shifts are assumed to be in order
    array = array.filter(
      (event) =>
        event instanceof EventInfo && // check that nothing strange slipped in
        event.shifts[event.shifts.length - 1].time.day.comparable <=
        PlainDate.yesterday().comparable // check that the last shift is in a past day
    );
    return array;
  }

  get sortedFutureEvents(): EventInfo[] {
    let array = this.futureEvents;
    array = array.sort(
      (a, b) => a.shifts[0].time.comparable - b.shifts[0].time.comparable
    );
    return array;
  }

  get sortedPastEvents(): EventInfo[] {
    let array = this.pastEvents;
    array = array.sort(
      (a, b) => b.shifts[0].time.comparable - a.shifts[0].time.comparable
    );
    return array;
  }

  get sortedEvents(): EventInfo[] {
    let array = Object.values(this.events);
    array = array.filter(
      // check that nothing strange slipped in
      (event) => event instanceof EventInfo
    );
    array = array.sort(
      (a, b) => a.shifts[0].time.comparable - b.shifts[0].time.comparable
    );
    return array;
  }

  // set event(s)
  @Mutation
  private _setEvents(events: Dict<EventInfo>) {
    this.events = events;
  }

  @Mutation
  private _setEvent(payload: { eventID: string; event: EventInfo }) {
    Vue.set(this.events, payload.eventID, payload.event) // needs to use this for getters to update
  }

  @Action
  async setEvent(payload: { eventID: string; event: EventInfo }) {
    let isNew = this.events[payload.eventID] == null;
    this.context.commit("_setEvent", payload);
    await this.context.dispatch("pushEvent", payload.eventID);
    if (isNew) {
      this.context.dispatch("newListener", payload.eventID);
    }
  }

  // delete event
  @Action
  async deleteEvent(id: string) {
    const eventToDelete = deepCopy((this.context.getters["eventsDict"] as Dict<EventInfo>)[id]);

    // delete event itself
    try {
      await db.collection("events").doc(id).delete();
    } catch {
      throw "Unable to delete"
    }
    this.context.commit("_deleteEvent", id);

    // remove event from each user that has signed up
    eventToDelete.shifts.forEach(shift => {
      shift.signedUp.forEach(async userID => {
        const ref = db.collection("users").doc(userID);
        const data = (await ref.get()).data() as UserAttributes;
        if (data == undefined) { return }
        data.events = data.events.filter((event: RSVP) => {
          event.eventID != id
        })
        ref.set(data);
      })
    })
  }

  @Mutation
  private _deleteEvent(id: string) {
    this.unsubscribes[id]();
    Vue.delete(this.events, id);
    Vue.delete(this.unsubscribes, id);
  }

  // attendance
  @Action
  removeAllAttendanceForUser(payload: {
    deleteId: string,
    attributes: UserAttributes
  }) {
    this.context.commit("_removeAllAttendanceForUser", payload);
    payload.attributes.events.forEach(rsvp =>
      this.context.dispatch("pushShifts", rsvp.eventID)
    )
  }

  @Mutation
  private _removeAllAttendanceForUser(payload: {
    deleteId: string,
    attributes: UserAttributes
  }) {
    payload.attributes.events.forEach(rsvp =>
      this.events[rsvp.eventID].shifts.forEach(shift =>
        shift.signedUp = shift.signedUp.filter(userID =>
          userID != payload.deleteId
        )
      )
    )
  }

  @Action
  async signUpForEvent(payload: RSVP) {
    const userID: string = this.context.rootState.user.user.uid;
    this.context.commit("addAttendance", {
      eventID: payload.eventID,
      shiftIDs: payload.shiftIDs,
      userID: userID,
    });

    await this.context.dispatch("pushShifts", payload.eventID);
  }

  @Action
  async unregisterForEvent(payload: RSVP) {
    const userID = this.context.rootState.user.user.uid;
    this.context.commit("removeAttendance", {
      eventID: payload.eventID,
      shiftIDs: payload.shiftIDs,
      userID: userID,
    });

    await this.context.dispatch("pushShifts", payload.eventID);
  }

  @Mutation
  private addAttendance(payload: {
    eventID: string;
    shiftIDs: string[];
    userID: string;
  }) {
    this.events[payload.eventID].shifts = this.events[
      payload.eventID
    ].shifts.map((shift) => {
      if (payload.shiftIDs.includes(shift.id)) {
        shift.signedUp.push(payload.userID);
      }
      return shift;
    });
  }

  @Mutation
  private removeAttendance(payload: {
    eventID: string;
    shiftIDs: string[];
    userID: string;
  }) {
    this.events[payload.eventID].shifts = this.events[
      payload.eventID
    ].shifts.map((shift) => {
      const modified = payload.shiftIDs.some(
        (selectedShiftID) => selectedShiftID == shift.id
      );
      if (modified) {
        const newPeople = shift.signedUp.filter(
          (userID) => userID != payload.userID
        );
        shift.signedUp = newPeople;
        return shift;
      } else {
        return shift;
      }
    });
  }

  // firestore coordination
  @Mutation
  setUnsubscribes(actions: Dict<VoidAction>) {
    this.unsubscribes = actions;
  }

  @Mutation
  addUnsubscribe(payload: { eventID: string; unsub: VoidAction }) {
    Vue.set(this.unsubscribes, payload.eventID, payload.unsub);
  }

  @Mutation
  didSetUp() {
    this.initialSetUpOccurred = true;
  }

  @Action
  async pushShifts(eventID: string) {
    const eventRef = db.collection("events").doc(eventID);
    const shifts = classToPlain(this.events[eventID].shifts);
    try {
      await eventRef.update({
        shifts: shifts,
      });
    } catch (err) {
      // TODO: server log
    }
  }

  @Action
  async pushEvent(eventID: string) {
    const newEvent: any = classToPlain(this.events[eventID]);
    const eventRef = db.collection("events").doc(eventID);
    try {
      await eventRef.set(newEvent);
    } catch (err) {
      // TODO: server log
    }
  }

  @Action
  async setListeners() {
    if (this.initialSetUpOccurred) {
      return
    }
    const collection = await db.collection("events").get();
    let unsubs: Dict<VoidAction> = {};
    collection.docs.forEach((doc) => {
      const id = doc.id;
      unsubs[id] = doc.ref.onSnapshot(
        (snap) => {
          const event = snap.data() || {};
          const obj = plainToClass(EventInfo, event);
          this.context.commit("_setEvent", {
            eventID: id,
            event: obj,
          });
        },
        (err) => {
          // TODO: server log
        }
      );
    });
    this.context.commit("setUnsubscribes", unsubs);
    this.context.commit("didSetUp");
  }

  @Action
  newListener(eventID: string) {
    const unsub = db.collection("events").doc(eventID).onSnapshot(
      (snap) => {
        const event = snap.data() || {};
        const obj = plainToClass(EventInfo, event);
        this.context.commit("_setEvent", {
          eventID: eventID,
          event: obj,
        });
      },
      (err) => {
        // TODO: server log
      }
    )
    this.context.commit("addUnsubscribe", {
      eventID: eventID,
      unsub: unsub
    })
  }
}
