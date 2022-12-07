import { cleanEnv, str, bool } from 'envalid'

const ENV = cleanEnv(import.meta.env, {
  VITE_VERSION: str(),
  VITE_NAME: str(),
  BASE_URL: str(),
  VITE_FIREBASE_API_KEY: str(),
  VITE_FIREBASE_AUTH_DOMAIN: str(),
  VITE_FIREBASE_DATABASE_URL: str(),
  VITE_FIREBASE_PROJECT_ID: str(),
  VITE_FIREBASE_STORAGE_BUCKET: str(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: str(),
  VITE_FIREBASE_APP_ID: str(),
  VITE_FIREBASE_MEASUREMENT_ID: str(),
  VITE_SENTRY_ENABLED: bool(),
  VITE_SENTRY_DSN: str(),
  VITE_SENTRY_PROJECT: str(),
  VITE_SENTRY_ENVIRONMENT: str(),
  VITE_OPENREPLAY_ENABLED: bool(),
  VITE_OPENREPLAY_PROJECTKEY: str(),
  MODE: str({ choices: ['production', 'development', 'staging'] }),
})

export default ENV
