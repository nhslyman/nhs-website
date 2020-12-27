import { Time, PlainDate } from "@/models";
import { Type } from "class-transformer";

class ShiftTime {
  @Type(() => PlainDate) public day: PlainDate;
  @Type(() => Time) public startTime: Time;
  @Type(() => Time) public endTime: Time;

  constructor(day: PlainDate, startTime: Time, endTime: Time) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  get humanReadableTimeRange() {
    return this.startTime.humanReadable + " to " + this.endTime.humanReadable;
  }

  get humanReadable() {
    return this.day.humanReadable + " " + this.humanReadableTimeRange;
  }

  get comparable() {
    return (this.day.comparable * 10000) + this.startTime.minutesIntoDay // 1140 minutes in day
  }
}

export { ShiftTime };
