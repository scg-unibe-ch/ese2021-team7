export class User {

  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public street: string,
    public houseNumber: string,
    public zipCode: string,
    public city: string,
    public birthday: string, // form ddmmyyyy -> maybe change to number -> not yet clear, which data type will fit best
    public phoneNumber: string
  ) {}
}
