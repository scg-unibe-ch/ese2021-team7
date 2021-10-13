import { UserAttributes, User } from '../models/user.model';
import { LoginResponse, LoginRequest } from '../models/login.model';
import { ErrorCodes } from '../errorCodes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {

    public static findUserByNameOrMail(credentialsRequestee: LoginRequest): Promise<User> {
        const where = {};
        if (credentialsRequestee.email) {
            // @ts-ignore
            where.email = credentialsRequestee.email;
        } else if (credentialsRequestee.userName) {
            // @ts-ignore
            where.userName = credentialsRequestee.userName;
        }

        return User.findOne({where});
    }

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        const credentials: LoginRequest = {userName: user.userName, email: user.email, password: user.password};
        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext

        return UserService.findUserByNameOrMail(credentials)
            .then(existingUser => {
                    if (existingUser) {
                        return Promise.reject({message: ErrorCodes.getUserNameOrMailAlreadyInUse()});
                    } else {
                        return User.create(user).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
                    }
                }
            );
    }

    public login(loginRequestee: LoginRequest): Promise<User | LoginResponse> {
        const secret = process.env.JWT_SECRET;
        const requestee = UserService.findUserByNameOrMail(loginRequestee);

        if (!loginRequestee.email && !loginRequestee.userName) {
            return Promise.reject({message: ErrorCodes.getNoUserNameOrMailProvided()});
        } else if (loginRequestee.email && loginRequestee.userName) {
            return Promise.reject({message: ErrorCodes.getIllegalRequestFormat()});
        }

        return requestee
            .then(user => {
                    if (user) {
                        // compares the hash with the password from the login request
                        if (bcrypt.compareSync(loginRequestee.password, user.password)) {
                            const token: string = jwt.sign({
                                userName: user.userName,
                                userId: user.userId,
                                admin: user.admin
                            }, secret, {expiresIn: '2h'});
                            return Promise.resolve({user, token});
                        } else {
                            // user found in DB, but wrong password
                            return Promise.reject({message: ErrorCodes.getWrongPassword()});
                        }
                    } else {
                        // user not found in DB
                        return Promise.reject({message: ErrorCodes.getUserNotFound()});
                    }
                }
            );
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }
}
