import { ThenableWebDriver, By } from 'selenium-webdriver'

export class LoginModel {
  private readonly _driver: ThenableWebDriver

  constructor(driver: ThenableWebDriver) {
    this._driver = driver
  }

  get bySignInWithEmailButton() {
    return By.css('button.firebaseui-idp-password')
  }

  get signInWithEmailButton() {
    return this._driver.findElement(this.bySignInWithEmailButton)
  }

  get byTermsOfSerivceLink() {
    return By.css('a.firebaseui-tos-link')
  }

  get termsOfSerivceLink() {
    return this._driver.findElement(this.byTermsOfSerivceLink)
  }

  get byPrivacyPolicyLink() {
    return By.css('a.firebaseui-pp-link')
  }

  get privacyPolicyLink() {
    return this._driver.findElement(this.byPrivacyPolicyLink)
  }

  get byEMailInput() {
    return By.id('ui-sign-in-email-input')
  }

  get eMailInput() {
    return this._driver.findElement(this.byEMailInput)
  }

  get byEMailInputNextButton() {
    return By.css('button.firebaseui-id-submit')
  }

  get eMailInputNextButton() {
    return this._driver.findElement(this.byEMailInputNextButton)
  }

  get byPasswordInput() {
    return By.id('ui-sign-in-password-input')
  }

  get passwordInput() {
    return this._driver.findElement(this.byPasswordInput)
  }

  get bySubmitLoginButton() {
    return By.css('button.firebaseui-id-submit')
  }

  get submitLoginButton() {
    return this._driver.findElement(this.bySubmitLoginButton)
  }

  get byPasswordErrorMessage() {
    return By.css('p.firebaseui-id-password-error')
  }
}
