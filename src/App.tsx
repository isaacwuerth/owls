import React from 'react'
import { RecoilRoot } from 'recoil'
import BasicLayout from './components/layouts/BasicLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

export default function App () {
  return (

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RecoilRoot>
        <RecoilNexus/>
        <BrowserRouter>
          <FirebaseProvider>
            <MaintenancePage>
              <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/user-setup" element={<UserSetupPage/>}/>
                <Route path="/logout" element={<LogoutPage/>}/>
                <Route element={<BasicLayout/>}>
                  <Route index element={<DashboardPage/>}/>
                  <Route path="events/:id" element={<EventPage/>}/>
                  <Route path="events/:id/edit" element={<EventEditPage/>}/>
                  <Route path="events" element={<EventsPage/>}/>
                  <Route path="profile" element={<ProfilPage/>}/>
                </Route>
              </Routes>
              <ToastContainer/>
            </MaintenancePage>
          </FirebaseProvider>
        </BrowserRouter>
      </RecoilRoot>
    </LocalizationProvider>
  )
}
