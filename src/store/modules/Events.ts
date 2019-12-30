import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { plainToClass } from "class-transformer";
import { EventInfo } from "@/models";
import { db } from "@/main";

@Module
export default class Events extends VuexModule {
  events: EventInfo[] = [];

  @Mutation
  setEvents(events: EventInfo[]) {
    this.events = events;
  }

  @Action
  setEventListener() {
    const collection = db.collection("events");
    collection.onSnapshot(
      snap => {
        let events: EventInfo[] = snap.docs.map(doc => {
          let event = doc.data() || {};
          Object.assign(event, { _id: doc.id });
          return plainToClass(EventInfo, event);
        });
        this.context.commit("setEvents", events);
      },
      err => {
        // server log
      }
    );
  }
}
