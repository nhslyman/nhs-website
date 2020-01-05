import { UID } from "@/util";
import { Type, Transform } from "class-transformer";

class Shift {
  @Type(() => ShiftTime) public time: ShiftTime;
  private _id: string;

  constructor(
    time: ShiftTime,
    public signedUp: string[],
    public target: number,
    public max: number,
    id: string = UID()
  ) {
    this.time = time;
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

class Time {
  // we're all in the same timezone so we don't need any of the Date overhead
  constructor(public hour: number, public minute: number, public am: boolean) {}

  get mm() {
    return this.pad(this.minute);
  }

  pad(num: number): string {
    if (num == 0) {
      return "00";
    }

    return (num < 10 ? "0" + num : num).toString();
  }

  get humanReadable() {
    const period = this.am ? "AM" : "PM";
    return this.hour + ":" + this.mm + " " + period;
  }

  static parse(time: string): Time {
    let timeArray = time.split(" ");
    const period = timeArray[1];
    timeArray = timeArray[0].split(":");
    const hour = parseInt(timeArray[0]);
    const minute = parseInt(timeArray[1]);
    const am = period == "AM" || period == "am";
    return new Time(hour, minute, am);
  }
}

class ShiftTime {
  @ConvertibleDate public day: Date;
  @ConvertibleTime public startTime: Time;
  @ConvertibleTime public endTime: Time;

  constructor(day: Date, startTime: Time, endTime: Time) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  get humanReadableTimeRange() {
    return this.startTime.humanReadable + " to " + this.endTime.humanReadable;
  }

  get humanReadableDate() {
    let day = this.day.getDate();
    let mon = this.day.getMonth() + 1;
    let year = this.day.getFullYear();

    let dd = (day < 10 ? "0" + day : day).toString();
    let mm = (mon < 10 ? "0" + mon : mon).toString();
    let yy = year.toString().substring(2, 4);

    return mm + "-" + dd + "-" + yy;
  }

  get humanReadable() {
    return this.humanReadableDate + " " + this.humanReadableTimeRange;
  }
}

// conversion decorators
function ConvertibleDate(target: Object, key: string) {
  const toPlain = Transform(
    (value: number) => {
      const date = new Date(value);
      return date.toISOString();
    },
    { toPlainOnly: true }
  );

  const toClass = Transform(
    (value: string) => {
      const num = Date.parse(value);
      return new Date(num);
    },
    {
      toClassOnly: true
    }
  );

  toPlain(target, key);
  toClass(target, key);
}

function ConvertibleTime(target: Object, key: string) {
  const toPlain = Transform(
    (value: Time) => {
      return value.humanReadable;
    },
    { toPlainOnly: true }
  );

  const toClass = Transform(
    (value: string) => {
      return Time.parse(value);
    },
    {
      toClassOnly: true
    }
  );

  toPlain(target, key);
  toClass(target, key);
}

export { Shift, ShiftTime, Time };
