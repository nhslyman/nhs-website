import faker from "faker";
import EventInfo from "@/models/EventInfo";
import DateTimeRange from "@/models/DateTimeRange";

function randomEvent(): EventInfo {
  let dateTimeRanges: DateTimeRange[] = [];
  let firstDate = faker.date.future();
  let finalDate = new Date(firstDate.getTime() + 1000000);
  dateTimeRanges.push(new DateTimeRange(firstDate, firstDate, finalDate));
  firstDate = faker.date.future();
  finalDate = new Date(firstDate.getTime() + 10000000);
  dateTimeRanges.push(new DateTimeRange(firstDate, firstDate, finalDate));

  let event = new EventInfo(
    faker.random.words(),
    faker.lorem.sentences(),
    faker.lorem.paragraph(),
    [],
    faker.random.number(),
    faker.random.number(),
    dateTimeRanges,
    faker.random.boolean(),
    faker.internet.email()
  );
  return event;
}

export default randomEvent;
