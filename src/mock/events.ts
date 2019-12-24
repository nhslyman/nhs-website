import faker from "faker";
import EventInfo from "@/models/EventInfo";
import { Shift, ShiftTime } from "@/models/Shift";

function randomEvent(): EventInfo {
  let shifts: Shift[] = [];
  let firstDate = faker.date.future();
  let finalDate = new Date(firstDate.getTime() + 1000000);
  shifts.push(
    new Shift(
      new ShiftTime(firstDate, firstDate, finalDate),
      [],
      faker.random.number(),
      faker.random.number()
    )
  );

  firstDate = faker.date.future();
  finalDate = new Date(firstDate.getTime() + 10000000);
  shifts.push(
    new Shift(
      new ShiftTime(firstDate, firstDate, finalDate),
      [],
      faker.random.number(),
      faker.random.number()
    )
  );

  let event = new EventInfo(
    faker.random.words(),
    faker.lorem.sentences(),
    faker.lorem.paragraph(),
    shifts,
    faker.random.boolean()
  );
  return event;
}

class EventStore {
  static events: EventInfo[];

  static fillRandom() {
    EventStore.events = [
      randomEvent(),
      randomEvent(),
      randomEvent(),
      randomEvent(),
      randomEvent()
    ];
  }

  static export() {
    let json = JSON.stringify(EventStore.events);
    console.log(json);
  }

  static import() {
    EventStore.events = [];
    const obj: EventInfo[] = require("@/mock/events.json");
    obj.forEach(proto => {
      let event = Object.assign(randomEvent(), proto);
      proto.shifts.forEach((shiftProto, index) => {
        let shiftTime = new ShiftTime(
          new Date(shiftProto.time.day),
          new Date(shiftProto.time.startTime),
          new Date(shiftProto.time.endTime)
        );
        let shift = new Shift(
          shiftTime,
          shiftProto.signedUp,
          shiftProto.target,
          shiftProto.max,
          shiftProto.id
        );
        event.shifts[index] = shift;
      });
      EventStore.events.push(event);
    });
  }
}

export default EventStore;
