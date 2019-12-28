import { Shift } from "@/models";
import UID from "@/util/UID";

class EventInfo {
  constructor(
    public name: String,
    public blurb: String,
    public details: String,
    public shifts: Shift[],
    public wholeShift: Boolean,
    private _id: String = UID()
  ) {}

  get id() {
    return this._id;
  }
}

export { EventInfo };
