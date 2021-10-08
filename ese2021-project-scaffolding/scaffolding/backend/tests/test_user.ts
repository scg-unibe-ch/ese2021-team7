import { describe } from 'mocha';
import * as sinon from 'sinon';
import bcrypt from 'bcrypt';
import * as chai from 'chai';

import { UserService } from '../src/services/user.service';
import {User} from '../src/models/user.model';
import {LoginResponse} from '../src/models/login.model';

chai.use(require('chai-as-promised'));
const assert = chai.assert;

describe('Test User.register', () => {
    describe('Test whether registering with an existing user name is rejected', () => {
        it('Should reject promise if the user name is already existing', function() {
            const user = {
                userId: 1,
                userName: 'lion50',
                password: 'asdf',
                admin: false,
                firstName: 'Hans-Peter',
                lastName: 'Kurth',
                email: 'lion@safari.com',
                street: '2nd street',
                houseNumber: '2',
                zipCode: '1234',
                city: 'London',
                birthday: new Date(1995, 12, 3),
                phoneNumber: '123456'
            };
            sinon.stub(UserService, 'findUserByNameOrMail').resolves(user);
            const userService = new UserService();
            return assert.isRejected(userService.register(user));
        });
    });
});

const dependencyModule = require('bcrypt');

// TODO: Fix this idiotic test who's not working because bcrypt can't be stubed properly
describe('Test user login with existing user', () => {
    describe('Test whether a wrong password returns a reject', () => {
        it('Should return 20 when the password is wrong', () => {
            const loginRequest = {
                userName: 'lion50',
                password: 'asdf',
                email: 'lion@safari.com'
            };
            const user = {
                userId: 1,
                userName: 'lion50',
                password: 'asdf',
                admin: false,
                firstName: 'Hans-Peter',
                lastName: 'Kurth',
                email: 'lion@safari.com',
                street: '2nd street',
                houseNumber: '2',
                zipCode: '1234',
                city: 'London',
                birthday: new Date(1995, 12, 3),
                phoneNumber: '123456'
            };

            const stubFindUsername = sinon.stub(UserService, 'findUserByNameOrMail').resolves(user);
            const stubCheckPassword = sinon.createStubInstance(bcrypt);
            stubCheckPassword.compareSync.returnsThis(false);

            const userService = new UserService();
        });
    });
});

describe('Test login with not existing user', () => {
    describe('Unsuccessful login attempt due to user not existing in database', () => {
        describe('Test whether a wrong user name or mail returns a reject', () => {
            it('Should return 21 when the user name is not found', () => {
                const loginRequest = {
                    userName: 'lion50',
                    password: 'asdf',
                    email: 'lion@safari.com'
                };
                const stubFindUsername = sinon.stub(UserService, 'findUserByNameOrMail').rejects(null);
                const userService: UserService = new UserService();
                const loginPromise: Promise<LoginResponse | User> = userService.login(loginRequest);

                return assert.isRejected(loginPromise, 21);
            });
        });
    });
});

// TODO: Fix this idiotic test who's not working because bcrypt can't be stubed properly
describe('Successful login', () => {
    describe('Successful login', () => {
        it('Should return a fulfilled promise', () => {
            const loginRequest = {
                userName: 'lion50',
                password: 'asdf',
                email: 'lion@safari.com'
            };
            const user = {
                userId: 1,
                userName: 'lion50',
                password: 'asdf',
                admin: false,
                firstName: 'Hans-Peter',
                lastName: 'Kurth',
                email: 'lion@safari.com',
                street: '2nd street',
                houseNumber: '2',
                zipCode: '1234',
                city: 'London',
                birthday: new Date(1995, 12, 3),
                phoneNumber: '123456'
            };

            const stubFindUsername = sinon.stub(UserService, 'findUserByNameOrMail').resolves(user);
            const stubCheckPassword = sinon.stub(bcrypt, 'compareSync').returns(true);

            const userService = new UserService();
            const loginPromise = userService.login(loginRequest);
            return assert.isFulfilled(loginPromise);
        });
    });
});
