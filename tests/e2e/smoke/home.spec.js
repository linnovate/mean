'use strict';

describe('Smoke test home page', function () {
  it('title should contain MEAN', function () {
    browser.get('/');
    expect(browser.getTitle()).toMatch(/.*MEAN.*/);
  })
});
