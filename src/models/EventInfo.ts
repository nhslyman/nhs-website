import { Shift } from "@/models";
import { UID } from "@/util";
import { Type } from "class-transformer";

class EventInfo {
  @Type(() => Shift) public shifts: Shift[];
  private _id: string;

  constructor(
    public name: string,
    public blurb: string,
    public details: string,
    shifts: Shift[],
    public wholeShift: boolean,
    id: string = UID()
  ) {
    this.shifts = shifts;
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

export { EventInfo };
