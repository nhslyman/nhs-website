import UID from "@/util/UID";
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

class ShiftTime {
  @ConvertibleDate public day: Date;
  @ConvertibleDate public startTime: Date;
  @ConvertibleDate public endTime: Date;

  constructor(day: Date, startTime: Date, endTime: Date) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  private humanReadableTime(time: Date) {
    let options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };
    return time.toLocaleString("en-US", options);
  }

  private get humanReadableDay() {
    let day = this.day.getDate();
    let mon = this.day.getMonth() + 1;
    let year = this.day.getFullYear();

    let dd = (day < 10 ? "0" + day : day).toString();
    let mm = (mon < 10 ? "0" + mon : mon).toString();
    let yy = year.toString().substring(2, 4);

    return mm + "-" + dd + "-" + yy;
  }

  get humanReadable() {
    return (
      this.humanReadableDay +
      " " +
      this.humanReadableTime(this.startTime) +
      " to " +
      this.humanReadableTime(this.endTime)
    );
  }
}

export { Shift, ShiftTime };
