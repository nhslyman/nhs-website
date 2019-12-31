import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { plainToClass, classToPlain } from "class-transformer";
import { EventInfo, RSVP } from "@/models";
import { db } from "@/main";

@Module({ namespaced: true })
export default class Events extends VuexModule {
  events: EventInfo[] = [];

  @Mutation
  setEvents(events: EventInfo[]) {
    this.events = events;
  }

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

  @Action
  async signUpForEvent(payload: RSVP) {
    const index = this.events.findIndex(event => event.id == payload.eventID);
    const userID = this.context.rootState.user.user.uid;
    this.context.commit("addAttendance", {
      index: index,
      shiftIDs: payload.shiftIDs,
      userID: userID
    });

    const eventRef = db.collection("events").doc(payload.eventID);
    const shifts = classToPlain(this.events[index].shifts);
    await eventRef.update({
      shifts: shifts
    });
  }

  @Action
  setEventListener() {
    const collection = db.collection("events");
    collection.onSnapshot(
      snap => {
        let events: EventInfo[] = snap.docs.map(doc => {
          let event = doc.data() || {};
          return plainToClass(EventInfo, event);
        });
        this.context.commit("setEvents", events);
      },
      err => {
        // TODO: server log
      }
    );
  }
}
