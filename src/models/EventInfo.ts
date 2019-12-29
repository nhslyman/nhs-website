import { Shift } from "@/models";
import UID from "@/util/UID";

class EventInfo {
  constructor(
    public name: string,
    public blurb: string,
    public details: string,
    public shifts: Shift[],
    public wholeShift: boolean,
    private _id: string = UID()
  ) {}

  get id() {
    return this._id;
  }
}

export { EventInfo };
