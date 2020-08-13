import { UID } from "@/util";
import { Type } from "class-transformer";
import { ShiftTime, PlainDate } from "@/models";

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

  get state(): ShiftState {
    const currentDate = PlainDate.now();
    const diff = PlainDate.diff(this.time.day, currentDate);
    if (diff > 1) {
      // last shift is more than one whole day away
      if (this.max != 0 && (this.signedUp.length >= this.max)) {
        return ShiftState.Full;
      }
      return ShiftState.Open;
    } if (diff < 0) {
      // last shift is in the past
      return ShiftState.Past;
    } else {
      // last shift is less than a day away
      return ShiftState.Locked;
    }
  }
}

enum ShiftState {
  Open,
  Locked,
  Past,
  Full
}

interface ShiftSignUp {
  eventID: string;
  shiftID: string;
}

export { Shift, ShiftState, ShiftSignUp };
