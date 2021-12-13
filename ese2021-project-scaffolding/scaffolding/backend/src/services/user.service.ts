import {User, UserAttributes} from '../models/user.model';
import {LoginRequest, LoginResponse} from '../models/login.model';
import {ErrorCodes} from '../errorCodes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import {randomInt} from 'crypto';

export class UserService {

    public static findUserByNameOrMail(credentialsRequestee: LoginRequest): Promise<User> {
        const where = {};
        if (credentialsRequestee.userName && credentialsRequestee.email) {
            return User.findOne({
                where: {
                    [Op.or]: [
                        {userName: credentialsRequestee.userName},
                        {email: credentialsRequestee.email}
                    ]
                }
            });
        } else if (credentialsRequestee.email) {
            // @ts-ignore
            where.email = credentialsRequestee.email;
        } else if (credentialsRequestee.userName) {
            // @ts-ignore
            where.userName = credentialsRequestee.userName;
        }

        return User.findOne({where});
    }

    public checkUserNameOrEmailInUse(loginRequestee: LoginRequest): Promise<any> {
        return UserService.findUserByNameOrMail(loginRequestee)
            .then(existingUser => {
                if (existingUser) {
                    return Promise.resolve({inUse: true});
                } else {
                    return Promise.resolve({inUse: false});
                }
            });
    }

    public getById(userId: string): Promise<any> {
        return User.findByPk(userId)
            .then(existingUser => {
                if (existingUser) {
                    existingUser.password = null;
                    return Promise.resolve(existingUser);
                } else {
                    return Promise.reject();
                }
            });
    }

    public register(user: UserAttributes): Promise<UserAttributes> {
        const saltRounds = 12;
        const credentials: LoginRequest = {userName: user.userName, email: user.email, password: user.password};

        if (!this.checkPassword(user.password)) {
            return Promise.reject({message: ErrorCodes.getIllegalPassword()});
        }

        user.password = bcrypt.hashSync(user.password, saltRounds); // hashes the password, never store passwords as plaintext

        if (!credentials.email && !credentials.userName) {
            return Promise.reject({message: ErrorCodes.getNoUserNameOrMailProvided()});
        }

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

        if (!loginRequestee.email && !loginRequestee.userName) {
            return Promise.reject({message: ErrorCodes.getNoUserNameOrMailProvided()});
        } else if (loginRequestee.email && loginRequestee.userName) {
            return Promise.reject({message: ErrorCodes.getIllegalRequestFormat()});
        }

        const requestee = UserService.findUserByNameOrMail(loginRequestee);

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
                            user.password = null;
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

    public discoverHouse(user: UserAttributes): Promise<any> {
        return User.findByPk(user.userId)
            .then(existingUser => {
                if (existingUser) {
                    if (existingUser.house) {
                        return Promise.reject({message: 'house was already set for user'});
                    }
                    existingUser.house = randomInt(1, 10);
                    existingUser.save();
                    return Promise.resolve({house: existingUser.house});
                } else {
                    return Promise.reject({message: 'no user found with id ' + user.userId});
                }
            });
    }

    public getAll(): Promise<User[]> {
        return User.findAll();
    }

    private checkPassword(password: string): boolean {
        const contLowercase = new RegExp(/.*[a-z]+.*/).test(password);
        const contCapital = new RegExp(/.*[A-Z]+.*/).test(password);
        const contNumber = new RegExp(/.*[0-9]+.*/).test(password);
        const contSpecChar = new RegExp(/.*[@#$%^&-+=()\\]+.*/).test(password);
        const longerThanEight = password.length >= 8;

        const matches = contLowercase && contCapital && contNumber && contSpecChar && longerThanEight;
        return matches;
    }
}
