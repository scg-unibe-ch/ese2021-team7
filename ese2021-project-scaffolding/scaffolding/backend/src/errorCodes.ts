export class ErrorCodes {
    static userNameOrMailAlreadyInUse = 10;
    static wrongUserNameOrMailOrPassword = 20;
    static noUserNameOrMailProvided = 21;

    public static getUserNameOrMailAlreadyInUse() {
        return ErrorCodes.userNameOrMailAlreadyInUse;
    }

    public static getWrongUserNameOrMailOrPassword() {
        return ErrorCodes.wrongUserNameOrMailOrPassword;
    }

    public static getNoUserNameOrMailProvided() {
        return ErrorCodes.noUserNameOrMailProvided;
    }
}
