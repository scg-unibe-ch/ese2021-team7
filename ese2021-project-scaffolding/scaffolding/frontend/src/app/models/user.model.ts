import { AccessPermission } from "./access-permission";
import { FeaturePermission } from "./feature-permission";

export class User {

  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public isAdmin: boolean,
    public firstName: string,
    public lastName: string,
    public email: string,
    public street: string,
    public houseNumber: string,
    public zipCode: string,
    public city: string,
    public birthday: string, // form yyyy-mm-dd
    public phoneNumber: string,
    public accessPermissions: AccessPermission, // access permissions of user
    public featuresPermissions: FeaturePermission // (static/independent) permissions for certain features
  ) {}
}
