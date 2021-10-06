import { describe } from 'mocha';
import { expect } from 'chai';
import { UserService } from '../src/services/user.service';

describe('Test User Services', () => {
    // TODO: Remove this test after writing new unittests
    describe('Test User Service\' returnTrue', () => {
        it('Should return true', () => {
            expect(UserService
                .returnTrue())
                .to
                .equal(true);
        });
    });
});
