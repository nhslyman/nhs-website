import DateTimeRange from "@/models/DateTimeRange";
import UID from "@/util/UID";

class EventInfo {
  constructor(
    public name: String,
    public blurb: String,
    public details: String,
    public signedUp: User[],
    public target: number,
    public max: number,
    public times: DateTimeRange[],
    public wholeShift: Boolean,
    public contact: String,
    private _id: String = UID()
  ) {}

  get id() {
    return this._id;
  }
}

class User {}

export default EventInfo;
