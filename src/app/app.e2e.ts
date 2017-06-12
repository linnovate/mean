import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {

  beforeEach(async () => {
    await browser.get('/');
  });

  it('should have a title', async () => {
    let subject = await browser.getTitle();
    let result  = 'Angular2 Webpack Starter by @gdi2290 from @AngularClass';
    expect(subject).toEqual(result);
  });

  it('should have header', async () => {
    let subject = await element(by.css('h1')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <home>', async () => {
    let subject = await element(by.css('app home')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have buttons', async () => {
    let subject = await element(by.css('button')).getText();
    let result  = 'Submit Value';
    expect(subject).toEqual(result);
  });

});
