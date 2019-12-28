class UserAttributes {
  constructor(
    public firstName: String,
    public lastName: String,
    public admin: Boolean
  ) {}

  get fullName() {
    return this.firstName + " " + this.lastName;
  }
}

export { UserAttributes };
