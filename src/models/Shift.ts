import { UID } from "@/util";
import { Type } from "class-transformer";
import { ShiftTime } from "@/models";

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

export { Shift };
