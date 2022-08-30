import React from 'react';
import DataGridDemo from "./components/events/EventsList";
import {RecoilRoot} from "recoil";
import BasicLayout from './components/layouts/BasicLayout';


function App() {
    return (
        <RecoilRoot>
            <BasicLayout>
                <div className="App">
                    <DataGridDemo/>
                </div>
            </BasicLayout>
        </RecoilRoot>
    );
}

export default App;
