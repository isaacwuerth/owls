import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  CaptureConsole as CaptureConsoleIntegration,
  Offline as OfflineIntegration,
  ReportingObserver as ReportingObserverIntegration,
} from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import SentryRRWeb from '@sentry/rrweb'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import BasicLayout from './common/layouts/BasicLayout'
import FirebaseProvider from './Context/FirebaseContext'
import OpenReplayProvider from './Context/OpenReplayContext'
import { AppInfoPage } from './pages/app/AppInfoPage'
import { ErrorBoundary } from './pages/app/ErrorBoundary'
import { MaintenancePage } from './pages/app/MaintenancePage'
import { Splashscreen } from './pages/app/Splashscreen'
import { DashboardPage } from './pages/DashboardPage'
import { EventEditPage } from './pages/events/EventEditPage'
import { EventPage } from './pages/events/EventPage'
import { EventsPage } from './pages/events/EventsPage'
import { FileManagerPage } from './pages/FileManagerPage'
import { LoginPage } from './pages/login/LoginPage'
import { LogoutPage } from './pages/login/LogoutPage'
import { NotFound } from './pages/NotFound'
import { ProfileOwnPage } from './pages/ProfileOwnPage'
import UserPage from './pages/users/UserPage'
import { UsersPage } from './pages/users/UsersPage'
import { UserSetupPage } from './pages/UserSetupPage'
import {
  AuthenticationOutlet,
  FirebaseAuthorizationProvider,
} from './Context/AuthorizationContext'
import { RolesPage } from './pages/RolesPage'
import LayoutProvider from './Context/LayoutContext'
import ENV from './env'

Sentry.init({
  dsn: ENV.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new SentryRRWeb(),
    new CaptureConsoleIntegration(),
    new OfflineIntegration({ maxStoredEvents: 50 }),
    new ReportingObserverIntegration(),
  ],
  tracesSampleRate: 1.0,
  environment: ENV.VITE_SENTRY_ENVIRONMENT,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  release: `${ENV.VITE_NAME}@${ENV.VITE_VERSION}`,
  attachStacktrace: true,
  maxBreadcrumbs: 100,
  autoSessionTracking: true,
  enabled: ENV.VITE_SENTRY_ENABLED,
})

Sentry.setTag('rrweb.active', 'yes')

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
      <OpenReplayProvider projectKey={ENV.VITE_OPENREPLAY_PROJECTKEY ?? ''}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RecoilRoot>
            <RecoilNexus />
            <BrowserRouter>
              <FirebaseProvider>
                <LayoutProvider>
                  <Splashscreen>
                    <MaintenancePage>
                      <FirebaseAuthorizationProvider>
                        <SentryRoutes>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/logout" element={<LogoutPage />} />
                          <Route path="/appinfo" element={<AppInfoPage />} />
                          <Route element={<AuthenticationOutlet />}>
                            <Route element={<BasicLayout />}>
                              <Route index element={<DashboardPage />} />
                              <Route
                                path="events/:eid"
                                element={<EventPage />}
                              />
                              <Route
                                path="events/:eid/edit"
                                element={<EventEditPage />}
                              />
                              <Route path="events" element={<EventsPage />} />
                              <Route
                                path="profile"
                                element={<ProfileOwnPage />}
                              />
                              <Route path="users" element={<UsersPage />} />
                              <Route path="roles" element={<RolesPage />} />
                              <Route path="users/:id" element={<UserPage />} />
                              <Route
                                path="files"
                                element={<FileManagerPage />}
                              />
                              <Route
                                path="/user-setup"
                                element={<UserSetupPage />}
                              />
                            </Route>
                          </Route>
                          <Route path="*" element={<NotFound />} />
                        </SentryRoutes>
                      </FirebaseAuthorizationProvider>
                      <ToastContainer position="top-center" />
                    </MaintenancePage>
                  </Splashscreen>
                </LayoutProvider>
              </FirebaseProvider>
            </BrowserRouter>
          </RecoilRoot>
        </LocalizationProvider>
      </OpenReplayProvider>
    </Sentry.ErrorBoundary>
  )
}

export default Sentry.withProfiler(App, {
  includeRender: true,
  includeUpdates: true,
})
