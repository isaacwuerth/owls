import * as webdriver from 'selenium-webdriver'

function buildLocalDriver() {
  return new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()
}

function buildBrowserstackDriver() {
  const builder = new webdriver.Builder()
    .usingServer(`http://localhost:4444/wd/hub`)
    .withCapabilities(webdriver.Capabilities.chrome())

  return builder.build()
}

export function buildDriver() {
  if (process.env.BROWSERSTACK) return buildBrowserstackDriver()
  return buildLocalDriver()
}
