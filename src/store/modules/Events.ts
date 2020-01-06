import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { plainToClass, classToPlain } from "class-transformer";
import { EventInfo, RSVP } from "@/models";
import { db } from "@/main";

@Module({ namespaced: true })
export default class Events extends VuexModule {
  // properties
  events: EventInfo[] = [];

  // basic setters
  @Mutation
  private _setEvents(events: EventInfo[]) {
    this.events = events;
  }

  @Mutation
  private _setEvent(payload: { index: number; event: EventInfo }) {
    this.events[payload.index] = payload.event;
  }

  // events
  @Action
  async setEvent(payload: { index: number; event: EventInfo }) {
    this.context.commit("_setEvent", payload);
    await this.context.dispatch("pushEvent", payload.index);
  }

  // attendance
  @Mutation
  addAttendance(payload: {
    index: number;
    shiftIDs: string[];
    userID: string;
  }) {
    if (payload.index == -1) {
      return;
    }
    this.events[payload.index].shifts.map(shift => {
      if (payload.shiftIDs.includes(shift.id)) {
        shift.signedUp.push(payload.userID);
      }
      return shift;
    });
  }

  @Mutation
  removeAttendance(payload: {
    index: number;
    shiftIDs: string[];
    userID: string;
  }) {
    this.events[payload.index].shifts = this.events[payload.index].shifts.map(
      shift => {
        const modified = payload.shiftIDs.some(
          selectedShiftID => selectedShiftID == shift.id
        );
        if (modified) {
          const newPeople = shift.signedUp.filter(
            userID => userID != payload.userID
          );
          shift.signedUp = newPeople;
          return shift;
        } else {
          return shift;
        }
      }
    );
  }

  @Action
  async signUpForEvent(payload: RSVP) {
    const index = this.events.findIndex(event => event.id == payload.eventID);
    const userID = this.context.rootState.user.user.uid;
    this.context.commit("addAttendance", {
      index: index,
      shiftIDs: payload.shiftIDs,
      userID: userID
    });

    await this.context.dispatch("pushShifts", {
      eventID: payload.eventID,
      index: index
    });
  }

  @Action
  async unregisterForEvent(payload: RSVP) {
    const index = this.events.findIndex(event => event.id == payload.eventID);
    const userID = this.context.rootState.user.user.uid;
    this.context.commit("removeAttendance", {
      index: index,
      shiftIDs: payload.shiftIDs,
      userID: userID
    });

    await this.context.dispatch("pushShifts", {
      eventID: payload.eventID,
      index: index
    });
  }

  // firestore coordination
  @Action
  async pushShifts(payload: { eventID: string; index: number }) {
    const eventRef = db.collection("events").doc(payload.eventID);
    const shifts = classToPlain(this.events[payload.index].shifts);
    try {
      await eventRef.update({
        shifts: shifts
      });
    } catch (err) {
      // TODO: server log
    }
  }

  @Action
  async pushEvent(index: number) {
    const newEvent: any = classToPlain(this.events[index]);
    const eventRef = db.collection("events").doc(newEvent._id);
    try {
      await eventRef.set(newEvent);
    } catch (err) {
      // TODO: server log
    }
  }

  @Action
  setListener() {
    const collection = db.collection("events");
    collection.onSnapshot(
      snap => {
        let events: EventInfo[] = snap.docs.map(doc => {
          let event = doc.data() || {};
          return plainToClass(EventInfo, event);
        });
        this.context.commit("_setEvents", events);
      },
      err => {
        // TODO: server log
      }
    );
  }
}
