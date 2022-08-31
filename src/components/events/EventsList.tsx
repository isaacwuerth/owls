import * as React from 'react';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useRecoilValue} from "recoil";
import {eventListState} from "../../atoms/EventAtom.";


const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', resizable: true,},
    {
        resizable: true,
        field: 'title',
        headerName: 'Titel',
    },
    {
        field: 'start',
        headerName: 'Start',
        type: 'dateTime',
        resizable: true,
    },
    {
        field: 'end',
        headerName: 'ende',
        type: 'dateTime',
        resizable: true,
    }
];

export default function EventsList() {
    const events = useRecoilValue(eventListState)
    return (
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={events}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{newEditingApi: true}}
            />
        </Box>
    );
}
