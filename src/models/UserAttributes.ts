class UserAttributes {
  constructor(
    public firstName: string,
    public lastName: string,
    public admin: boolean
  ) {}

  get fullName() {
    return this.firstName + " " + this.lastName;
  }
}

export { UserAttributes };
