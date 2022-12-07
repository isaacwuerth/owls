import { ThenableWebDriver, until } from 'selenium-webdriver'
import { LoginObject } from '../object/LoginObject'
import { LoginModel } from '../model/LoginModel'
import { buildDriver } from '../selenium'

describe('Login Page', function () {
  let driver: ThenableWebDriver
  const baseUrl = 'http://localhost:3000'
  let loginObject: LoginObject
  let loginModel: LoginModel
  const eMail: string = 'selenium@itsvc.ch'
  const password: string = 'Selenium1234'

  beforeAll(function () {
    driver = buildDriver()

    loginModel = new LoginModel(driver)
    loginObject = new LoginObject(loginModel, driver)
  })

  afterAll(async function () {
    await driver.quit()
  })

  afterEach((done) => {
    void driver.navigate().refresh()
    void driver.executeScript(
      'indexedDB.deleteDatabase("firebaseLocalStorageDb");'
    )
    void driver.sleep(1000)
    void driver.navigate().refresh()
    done()
  })

  it('Sign in with correct login credentials', async function () {
    const Url: string = baseUrl

    await driver.get(`${Url}/login`)
    await driver.wait(
      until.elementLocated(loginModel.bySignInWithEmailButton),
      3000
    )
    await loginObject.Login(eMail, password)
    await driver.wait(until.urlIs(`${Url}/`), 5000)
    const currentUrl = await driver.getCurrentUrl()
    expect(currentUrl).toBe(`${Url}/`)
  }, 30000)

  it('Sign in with wrong credentials', async function () {
    const Url: string = baseUrl
    const password: string = '1234567890'
    await driver.get(`${Url}/login`)
    await driver.wait(
      until.elementLocated(loginModel.bySignInWithEmailButton),
      10000
    )
    await loginObject.Login(eMail, password)
    await driver.wait(
      until.elementIsVisible(
        driver.findElement(loginModel.byPasswordErrorMessage)
      ),
      5000
    )
    const currentUrl = await driver.getCurrentUrl()
    expect(currentUrl).toBe(`${Url}/login`)
    const isErrorPresent = await driver
      .findElement(loginModel.byPasswordErrorMessage)
      .isDisplayed()
    expect(isErrorPresent).toBe(true)
  }, 30000)
})
