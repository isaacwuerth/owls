import { LoginModel } from '../model/LoginModel'
import { ThenableWebDriver, until } from 'selenium-webdriver'

export class LoginObject {
  private readonly loginModel: LoginModel
  private readonly _driver: ThenableWebDriver

  constructor(loginModel: LoginModel, driver: ThenableWebDriver) {
    this.loginModel = loginModel
    this._driver = driver
  }

  public async typeEmail(email: string) {
    return await this.loginModel.eMailInput.sendKeys(email)
  }

  public async typePassword(password: string) {
    return await this.loginModel.passwordInput.sendKeys(password)
  }

  public async clickSignInWithEmailButton() {
    return await this.loginModel.signInWithEmailButton.click()
  }

  public async clickTermsOfSerivceLink() {
    return await this.loginModel.termsOfSerivceLink.click()
  }

  public async clickPrivacyPolicyLink() {
    return await this.loginModel.privacyPolicyLink.click()
  }

  public async clickEmailInputNextButton() {
    return await this.loginModel.eMailInputNextButton.click()
  }

  public async clickSubmitLoginButton() {
    return await this.loginModel.submitLoginButton.click()
  }

  public async Login(email: string, password: string) {
    await this.clickSignInWithEmailButton()
    await this.typeEmail(email)
    await this.clickEmailInputNextButton()
    await this._driver.wait(
      until.elementLocated(this.loginModel.byPasswordInput),
      3000
    )
    await this.typePassword(password)
    await this.clickSubmitLoginButton()
  }
}
