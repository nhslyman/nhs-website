// works with firestore better than Date
// we're all in the same timezone so it's fine

class Time {
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

  get minutesIntoDay(): number {
    let sum = 0;
    sum += this.am ? 0 : 12 * 60;
    sum += this.hour * 60;
    sum += this.minute;
    return sum;
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

export { Time };
