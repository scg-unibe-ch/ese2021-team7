export class User {

  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public street: string,
    public houseNr: number,
    public zipCode: number,
    public birthday: number,
    // form ddmmyyyy -> maybe change to string -> not yet clear, which data type will fit best
    public phoneNumber: number
  ) {}
}
