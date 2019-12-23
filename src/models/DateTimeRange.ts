import UID from "@/util/UID";

class DateTimeRange {
  constructor(
    private day: Date,
    private startTime: Date,
    private endTime: Date,
    private _id: String = UID()
  ) {}

  humanReadableTime(time: Date) {
    let options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };
    return time.toLocaleString("en-US", options);
  }

  get humanReadableDay() {
    let day = this.day.getDay();
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

  get id() {
    return this._id;
  }
}

export default DateTimeRange;
