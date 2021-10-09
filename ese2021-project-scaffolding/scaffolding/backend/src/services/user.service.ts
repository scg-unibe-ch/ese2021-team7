import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import { ErrorCodes } from '../errorCodes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {

    public static findUserByNameOrMail(credentialsRequestee: LoginRequest): Promise<User> {
        const where = {};
        if (credentialsRequestee.userName) {
            // @ts-ignore
            where.userName = credentialsRequestee.userName;
        }
        if (credentialsRequestee.email) {
            // @ts-ignore
            where.email = credentialsRequestee.email;
        }

        return User.findOne({where});
    }

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        const credentials: LoginRequest = {userName: user.userName, email: user.email, password: user.password};
        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext

        if (UserService.findUserByNameOrMail(credentials)) {
            return Promise.reject({message: ErrorCodes.getUserNameOrMailAlreadyInUse()});
        }
        return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        const requestee = UserService.findUserByNameOrMail(loginRequestee);
        if (!requestee) {
            return Promise.reject({message: ErrorCodes.getNoUserNameOrMailProvided()});
        }

        return requestee
        .then(user => {
            if (bcrypt.compareSync(loginRequestee.password, user.password)) {// compares the hash with the password from the login request
                const token: string = jwt.sign({ userName: user.userName, userId: user.userId, admin: user.admin }, secret, { expiresIn: '2h' });
                return Promise.resolve({ user, token });
            } else {
                return Promise.reject({ message: ErrorCodes.getWrongUserNameOrMailOrPassword() });
            }
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }
}
