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

export default function App () {
  return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <RecoilRoot>
                <BrowserRouter>
                    <BasicLayout>
                        <Routes>
                            <Route index element={<DashboardPage/>}/>
                            <Route path="events/:id" element={<EventPage/>}/>
                            <Route path="events" element={<EventsPage/>}/>
                            <Route path="profile" element={<ProfilPage/>}/>
                        </Routes>
                    </BasicLayout>
                </BrowserRouter>
            </RecoilRoot>
        </LocalizationProvider>

  )
}
