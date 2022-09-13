import React from 'react'
import { RecoilRoot } from 'recoil'
import BasicLayout from './components/layouts/BasicLayout'
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigationType
} from 'react-router-dom'
import { DashboardPage } from './components/pages/DashboardPage'
import { EventsPage } from './components/pages/EventsPage'
import { ProfilPage } from './components/pages/ProfilPage'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { EventPage } from './components/pages/EventPage'
import { EventEditPage } from './components/pages/EventEditPage'
import RecoilNexus from 'recoil-nexus'
import FirebaseProvider from './Context/FirebaseContext'
import { LoginPage } from './components/pages/LoginPage'
import { UserSetupPage } from './components/pages/UserSetupPage'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { MaintenancePage } from './components/pages/MaintenancePage'
import { LogoutPage } from './components/pages/LogoutPage'
import { Splashscreen } from './Splashscreen'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { ErrorBoundary } from './ErrorBoundary'
import SentryRRWeb from '@sentry/rrweb'
import {
  CaptureConsole as CaptureConsoleIntegration,
  Offline as OfflineIntegration,
  ReportingObserver as ReportingObserverIntegration
} from '@sentry/integrations'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost'],
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
                    <Route path="/logout" element={<LogoutPage/>}/>
                    <Route element={<BasicLayout/>}>
                      <Route index element={<DashboardPage/>}/>
                      <Route path="events/:eid" element={<EventPage/>}/>
                      <Route path="events/:eid/edit" element={<EventEditPage/>}/>
                      <Route path="events" element={<EventsPage/>}/>
                      <Route path="profile" element={<ProfilPage/>}/>
                    </Route>
                  </SentryRoutes>
                  <ToastContainer/>
                </MaintenancePage>
              </Splashscreen>
            </FirebaseProvider>
          </BrowserRouter>
        </RecoilRoot>
      </LocalizationProvider>
    </Sentry.ErrorBoundary>
  )
}

export default Sentry.withProfiler(App, { includeRender: true, includeUpdates: true })
