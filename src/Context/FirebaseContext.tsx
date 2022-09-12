import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import * as firebaseui from 'firebaseui'
import { useSetRecoilState } from 'recoil'
import { profileAtom } from '../atoms/ProfileAtom'
import { fetchAndActivate, getAll, getRemoteConfig } from 'firebase/remote-config'
import { siteConfigAtom } from '../atoms/SiteConfigAtom'
import { SiteConfigSchema } from '../model/SiteConfig'
import { getStorage } from 'firebase/storage'
import { EventRepository } from '../repositories/EventRepository'
import { ParticipantRepository } from '../repositories/ParticipantsRepository'
import firebase from 'firebase/compat/app'
import { UsersRepository } from '../repositories/UsersRepository'
import { FileManager } from '../FileManager'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const storage = getStorage(app)

const firebaseContextConfig = {
  firebase: {
    app
  },
  apps: {
    analytics: getAnalytics(app),
    database: getDatabase(app),
    firestore,
    auth: getAuth(app),
    storage,
    loginUi: new firebaseui.auth.AuthUI(getAuth(app)),
    remoteConfig: getRemoteConfig(app)
  },
  uiConfig: {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: '/',
    privacyPolicyUrl: 'https://wwww.google.com'
  },
  eventRepository: new EventRepository(firestore),
  participantRepository: new ParticipantRepository(firestore),
  usersRepository: new UsersRepository(firestore),
  avatarFiles: new FileManager(storage, 'avatar')
}

const defaultConfig = {
  name: '',
  logoUrl: ''
}

firebaseContextConfig.apps.remoteConfig.settings.minimumFetchIntervalMillis = 50000
firebaseContextConfig.apps.remoteConfig.defaultConfig = defaultConfig

export const FirebaseContext = createContext(firebaseContextConfig)

function convertConfig (allConfigs: Record<string, any>): any {
  const result: Record<string, any> = {}
  Object.keys(allConfigs).forEach(key => {
    result[key] = allConfigs[key].asString()
  })
  try {
    SiteConfigSchema.parse(result)
  } catch (e) {
    console.error('Error parsing config', e)
  }
  return SiteConfigSchema.parse(result)
}

export default function FirebaseProvider ({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const setProfile = useSetRecoilState(profileAtom)
  const setSiteConfig = useSetRecoilState(siteConfigAtom)
  useEffect(() => {
    async function UpdateConfig () {
      await fetchAndActivate(firebaseContextConfig.apps.remoteConfig)
      const allConfigs = getAll(firebaseContextConfig.apps.remoteConfig)
      setSiteConfig(convertConfig(allConfigs))
    }
    async function LoadConfigStartup () {
      await UpdateConfig()
      // setInterval(UpdateConfig, 60000)
    }
    LoadConfigStartup().catch(reason => {})
    onAuthStateChanged(firebaseContextConfig.apps.auth, async user => {
      if (user) {
        const q = await query(collection(firebaseContextConfig.apps.firestore, 'users'), where('uid', '==', user.uid))
        const docs = await getDocs(q)
        if (docs.size > 1) throw new Error('There are multiple users with the same UID')
        if (docs.size === 1) {
          // @ts-expect-error
          setProfile(docs.docs[0].data())
        } else {
          navigate('user-setup')
        }
      } else {
        navigate('/login')
      }
    })
  }, [])

  return (
    <FirebaseContext.Provider value={firebaseContextConfig}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const firebaseContext = useContext(FirebaseContext)
  if (firebaseContext === undefined) {
    throw new Error(
      'useFirebase must be used within a FirebaseContext.Provider'
    )
  }
  return firebaseContext
}
