export class ErrorCodes {
    static userNameOrMailAlreadyInUse = 10;
    static illegalPassword = 11;
    static noUserNameOrMailProvided = 21;
    static userNotFound = 22;
    static wrongPassword = 23;
    static illegalRequestFormat = 24;

    public static getUserNameOrMailAlreadyInUse() {
        return ErrorCodes.userNameOrMailAlreadyInUse;
    }

    public static getUserNotFound() {
        return ErrorCodes.userNotFound;
    }

    public static getNoUserNameOrMailProvided() {
        return ErrorCodes.noUserNameOrMailProvided;
    }

    public static getWrongPassword() {
        return ErrorCodes.wrongPassword;
    }

    /**
     * is returned when a login request is made where both an email and a userName are in the request.
     */
    public static getIllegalRequestFormat() {
        return ErrorCodes.illegalRequestFormat;
    }

    public static getIllegalPassword() {
        return ErrorCodes.illegalPassword;
    }
}
