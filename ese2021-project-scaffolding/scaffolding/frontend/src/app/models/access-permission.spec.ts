import { AccessPermission } from './access-permission';

describe('AccessPermission', () => {
  it('should create an instance', () => {
    expect(new AccessPermission(false, false, false, false, false, false, false, false)).toBeTruthy();
  });
});
