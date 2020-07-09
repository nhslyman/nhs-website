import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { plainToClass, classToPlain } from "class-transformer";
import { EventInfo, RSVP, PlainDate } from "@/models";
import { db } from "@/main";

interface EventDict {
  [key: string]: EventInfo;
}

interface ActionDict {
  [key: string]: () => void;
}

@Module({ namespaced: true })
export default class Events extends VuexModule {
  // properties
  private events: EventDict = {};
  private unsubscribes: ActionDict = {};

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

  // basic setters
  @Mutation
  private _setEvents(events: EventDict) {
    this.events = events;
  }

  @Mutation
  private _setEvent(payload: { eventID: string; event: EventInfo }) {
    this.events[payload.eventID] = payload.event;
  }

  // events
  @Action
  async setEvent(payload: { eventID: string; event: EventInfo }) {
    this.context.commit("_setEvent", payload);
    await this.context.dispatch("pushEvent", payload.eventID);
  }

  // attendance
  @Mutation
  addAttendance(payload: {
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
  removeAttendance(payload: {
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

  // firestore coordination
  @Mutation
  setUnsubscribes(actions: ActionDict) {
    this.unsubscribes = actions;
  }

  @Mutation
  addUnsubscribe(payload: { eventID: string; action: () => void }) {
    this.unsubscribes[payload.eventID] = payload.action;
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
    const collection = await db.collection("events").get();
    let unsubs: ActionDict = {};
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
  }
}
