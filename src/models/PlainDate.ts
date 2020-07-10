// works with firestore better than Date
// we're all in the same timezone so it's fine

class PlainDate {
  constructor(public day: number, public month: number, public year: number) {}

  get humanReadable() {
    return this.mm + "-" + this.dd + "-" + this.yy;
  }

  get dd() {
    return this.pad(this.day);
  }

  get mm() {
    return this.pad(this.month);
  }

  get yy() {
    return this.year.toString().substring(2, 4);
  }

  get comparable() {
    return parseInt(this.yy + this.mm + this.dd);
  }

  get stdDate() {
    return new Date(this.year, this.month - 1, this.day)
  }

  private pad(num: number): string {
    if (num == 0) {
      return "00";
    }

    return (num < 10 ? "0" + num : num).toString();
  }

  static now(): PlainDate {
    const now = new Date();
    return new PlainDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
  }

  static yesterday(): PlainDate {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new PlainDate(
      yesterday.getDate(),
      yesterday.getMonth() + 1,
      yesterday.getFullYear()
    );
  }

  static diff(first: PlainDate, second: PlainDate): Number {
    var diff =  Math.floor(( first.stdDate.valueOf() - second.stdDate.valueOf() ) / 86400000);
    return diff
  }
}

export { PlainDate };
