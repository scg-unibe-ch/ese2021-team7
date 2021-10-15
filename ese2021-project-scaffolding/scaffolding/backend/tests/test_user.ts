import { describe } from 'mocha';
import * as sinon from 'sinon';
// @ts-ignore
import bcrypt from 'bcrypt';
import * as chai from 'chai';

import { UserService } from '../src/services/user.service';
import {LoginResponse} from '../src/models/login.model';
import {ErrorCodes} from '../src/errorCodes';

chai.use(require('chai-as-promised'));
const assert = chai.assert;
const sandbox = require('sinon').createSandbox();

before(() => {
    process.env.JWT_SECRET = 'not_secure';
});

afterEach(function () {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
});

describe('Test User.register', () => {
    describe('Test whether registering with an existing user name is rejected', () => {
        it('Should reject promise if the user name is already existing', function() {
            const user = {
                userId: 1,
                userName: 'lion50',
                password: 'as12DaF*(',
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
            const userPromise = new Promise((resolve, reject) => {
                resolve(user);
            });

            sandbox.stub(UserService, 'findUserByNameOrMail').resolves(userPromise);
            const userService = new UserService();
            return userService.register(user)
                .then(() => {
                        assert.fail('expected failure');
                    },
                    rejection => {
                        assert.equal(rejection.message, ErrorCodes.getUserNameOrMailAlreadyInUse());
                    }
                ).catch((error) => {
                    assert.fail('did not expect exception' + error);
                });
        });
    });
});

describe('Test user login with existing user', () => {
    describe('Test whether a wrong password returns a reject', () => {
        it('Should return 20 when the password is wrong', () => {
            const loginRequest = {
                userName: 'lion50',
                password: 'asdf',
                email: null
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
            const userPromise = new Promise((resolve, reject) => {
                resolve(user);
            });

            sandbox.stub(UserService, 'findUserByNameOrMail').resolves(userPromise);
            sandbox.stub(bcrypt, 'compareSync').returns(false);
            const userService = new UserService();
            return userService.login(loginRequest)
                .then(() => {
                        assert.fail('expected failure');
                    },
                    rejection => {
                        assert.equal(rejection.message, ErrorCodes.getWrongPassword());
                    }
                ).catch((error) => {
                    assert.fail('did not expect exception' + error);
                });
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
                    email: null
                };
                const userPromise = new Promise((resolve, reject) => {
                    resolve(null);
                });
                // findUserByNameOrMail resolves null if no user is found
                sandbox.stub(UserService, 'findUserByNameOrMail').resolves(userPromise);
                const userService: UserService = new UserService();
                return userService.login(loginRequest)
                    .then(() => {
                            assert.fail('expected failure');
                        },
                        rejection => {
                            assert.equal(rejection.message, ErrorCodes.getUserNotFound());
                        }
                    ).catch((error) => {
                        assert.fail('did not expect exception' + error);
                    });
            });
        });
    });
});

describe('Successful login', () => {
    describe('Successful login', () => {
        it('Should return a fulfilled promise', () => {
            const loginRequest = {
                userName: null,
                password: 'asdf',
                email: 'abc@def.com'
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
            const userPromise = new Promise((resolve, reject) => {
                resolve(user);
            });

            sandbox.stub(UserService, 'findUserByNameOrMail').resolves(userPromise);
            sandbox.stub(bcrypt, 'compareSync').returns(true);

            const userService = new UserService();
            return userService.login(loginRequest)
                .then(response => {
                        assert.isNotNull((response as LoginResponse).token);
                        assert((response as LoginResponse).token.length > 20);
                        assert.equal((response as LoginResponse).user.userName, 'lion50');
                    },
                    rejection => {
                        assert.fail('expected success');
                    }
                ).catch((error) => {
                    assert.fail('did not expect exception' + error);
                });
        });
    });
});
