import { Shift } from "@/models";
import UID from "@/util/UID";
import { Type } from "class-transformer";

class EventInfo {
  @Type(() => Shift)
  public shifts: Shift[];

  constructor(
    public name: string,
    public blurb: string,
    public details: string,
    shifts: Shift[],
    public wholeShift: boolean,
    private _id: string = UID()
  ) {
    this.shifts = shifts;
  }

  get id() {
    return this._id;
  }
}

export { EventInfo };
