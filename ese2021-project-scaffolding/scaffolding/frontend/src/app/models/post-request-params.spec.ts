import { PostRequestParams } from './post-request-params';

describe('PostRequestParams', () => {
  it('should create an instance', () => {
    expect(new PostRequestParams('', '', '', 0, 0)).toBeTruthy();
  });
});
