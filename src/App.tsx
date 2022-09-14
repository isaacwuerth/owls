import React from 'react'
import { RecoilRoot } from 'recoil'
import BasicLayout from './common/layouts/BasicLayout'
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigationType
} from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { EventsPage } from './pages/events/EventsPage'
import { ProfilPage } from './pages/ProfilPage'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { EventPage } from './pages/events/EventPage'
import { EventEditPage } from './pages/events/EventEditPage'
import RecoilNexus from 'recoil-nexus'
import FirebaseProvider from './Context/FirebaseContext'
import { LoginPage } from './pages/login/LoginPage'
import { UserSetupPage } from './pages/UserSetupPage'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { MaintenancePage } from './pages/app/MaintenancePage'
import { LogoutPage } from './pages/login/LogoutPage'
import { Splashscreen } from './pages/app/Splashscreen'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { ErrorBoundary } from './pages/app/ErrorBoundary'
import SentryRRWeb from '@sentry/rrweb'
import {
  CaptureConsole as CaptureConsoleIntegration,
  Offline as OfflineIntegration,
  ReportingObserver as ReportingObserverIntegration
} from '@sentry/integrations'
import OpenReplayProvider from './Context/OpenReplayContext'
import { AppInfoPage } from './pages/app/AppInfoPage'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      )
    }),
    new SentryRRWeb(),
    new CaptureConsoleIntegration(),
    new OfflineIntegration({ maxStoredEvents: 50 }),
    new ReportingObserverIntegration()
  ],
  tracesSampleRate: 1.0,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  release: `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}`,
  attachStacktrace: true,
  maxBreadcrumbs: 100,
  autoSessionTracking: true,
  enabled: process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test'
})

Sentry.setTag('rrweb.active', 'yes')

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function App () {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorBoundary/>} showDialog>
      <OpenReplayProvider projectKey={process.env.REACT_APP_OPENREPLAY_PROJECTKEY ?? ''} __DISABLE_SECURE_MODE>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RecoilRoot>
            <RecoilNexus/>
            <BrowserRouter>
              <FirebaseProvider>
                <Splashscreen>
                  <MaintenancePage>
                    <SentryRoutes>
                      <Route path="/login" element={<LoginPage/>}/>
                      <Route path="/user-setup" element={<UserSetupPage/>}/>
                      <Route path="/appinfo" element={<AppInfoPage/>}/>
                      <Route path="/logout" element={<LogoutPage/>}/>
                      <Route element={<BasicLayout/>}>
                        <Route index element={<DashboardPage/>}/>
                        <Route path="events/:eid" element={<EventPage/>}/>
                        <Route path="events/:eid/edit" element={<EventEditPage/>}/>
                        <Route path="events" element={<EventsPage/>}/>
                        <Route path="profile" element={<ProfilPage/>}/>
                      </Route>
                    </SentryRoutes>
                    <ToastContainer position='top-center'/>
                  </MaintenancePage>
                </Splashscreen>
              </FirebaseProvider>
            </BrowserRouter>
          </RecoilRoot>
        </LocalizationProvider>
      </OpenReplayProvider>
    </Sentry.ErrorBoundary>
  )
}

export default Sentry.withProfiler(App, { includeRender: true, includeUpdates: true })
