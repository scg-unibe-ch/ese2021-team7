import { FeaturePermission } from './feature-permission';

describe('FeaturePermission', () => {
  it('should create an instance', () => {
    expect(new FeaturePermission(false,false,false, false, false)).toBeTruthy();
  });
});
