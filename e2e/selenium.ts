import * as webdriver from 'selenium-webdriver'
import browsers from './browsers.json'

function buildLocalDriver() {
  return new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build()
}

function browserstackCapabilityBuilder(baseconfig: any) {
  const list: any[] = []
  for (const browser of browsers) {
    const browserConfig = {
      'bstack:options': {
        os: browser.os,
        osVersion: browser.osVersion,
      },
      browserName: browser.browserName,
      browserVersion: browser.browserVersion,
    }
    const config = mergeDeep({}, baseconfig, browserConfig)
    list.push(config)
  }
  return list as webdriver.Capabilities[]
}

function buildBrowserstackDriver() {
  if (
    !process.env.BROWSERSTACK_USERNAME &&
    !process.env.BROWSERSTACK_ACCESS_KEY
  )
    throw new Error(
      'Please set the BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables.'
    )

  const username = process.env.BROWSERSTACK_USERNAME
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY
  const buildName = process.env.BROWSERSTACK_BUILD_NAME
  const projectName = process.env.BROWSERSTACK_PROJECT_NAME
  const localIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER

  if (!buildName)
    throw new Error(
      'Please set the BROWSERSTACK_BUILD_NAME environment variable.'
    )
  if (!projectName)
    throw new Error(
      'Please set the BROWSERSTACK_PROJECT_NAME environment variable.'
    )
  if (!localIdentifier)
    throw new Error(
      'Please set the BROWSERSTACK_LOCAL_IDENTIFIER environment variable.'
    )

  const baseConfig = {
    'bstack:options': {
      projectName: `BStack Project Name: ${projectName}`,
      buildName: `BStack Build Name: ${buildName}`,
      localIdentifier,
      userName: username,
      accessKey,
    },
  }

  const capabilitiesList = browserstackCapabilityBuilder(baseConfig)

  const builder = new webdriver.Builder().usingServer(
    'https://hub-cloud.browserstack.com/wd/hub'
  )

  for (const capability of capabilitiesList) {
    builder.withCapabilities(capability)
  }

  return builder.build()
}

export function buildDriver() {
  if (process.env.BROWSERSTACK) return buildBrowserstackDriver()
  return buildLocalDriver()
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
