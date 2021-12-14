import { AccessPermission } from "./access-permission";
import { FeaturePermission } from "./feature-permission";
import { House } from "./house";

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
    public houseChosen: boolean,
    public house?: House, // house for different UI layout
    public accessPermissions?: AccessPermission, // access permissions of user
    public featuresPermissions?: FeaturePermission, // (static/independent) permissions for certain features
  ) {}

  setAccessPermissions(accessPermission: AccessPermission): void {
    this.accessPermissions = accessPermission;
  }

  setFeaturesPermissions(featuresPermissions: FeaturePermission): void {
    this.featuresPermissions = featuresPermissions;
  }

  setHouse(house: House): void {
    this.house = house;
  }

  setHouseChosen(chosenHouse: boolean): void {
    this.houseChosen = chosenHouse;
  }

}
