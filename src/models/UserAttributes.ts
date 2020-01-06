interface RSVP {
  eventID: string;
  shiftIDs: string[];
}

class UserAttributes {
  constructor(
    public firstName: string,
    public lastName: string,
    public admin: boolean = false,
    public events: RSVP[] = []
  ) {}

  get fullName() {
    return this.firstName + " " + this.lastName;
  }
}

export { UserAttributes, RSVP };
