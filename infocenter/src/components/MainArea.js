import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { DialogBox } from "./DialogBox"; 
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";
import { useState } from "react";

export function MainArea({page, selectedEntry, onRowClick, queryClient}) {

    const {data, status} = useQuery(['dataSource'], fetchData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({type: "info", message: ""});

    function closeDialog() {
        setDialogOpen(false);
    }

    function showMessage(dialogType, message) {
        setDialogMessage({type: dialogType, message: message});
        setDialogOpen(true);
    }

    if (status === 'loading') {
        <div>Loading...</div>
    }
    else if (status === 'error') {
        <div>{`An error occurred: ${status.error}`}</div>
    }
    else if (status === 'success') {
        return (
            <div key={page} className="main-area">
                {page === "technical-info" ? 
                <>
                    <SearchFilter key={`${page}-device-filter`} page={page} pageData={data.deviceData} onRowClick={onRowClick} />
                    <SummaryCard key={`${page}-device-card`} page={page} pageData={data.deviceData} selectedEntry={selectedEntry} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} />
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                page === "staff" ?
                <>
                    <SearchFilter key={`${page}-staff-filter`} page={page} pageData={data.staffData} onRowClick={onRowClick} />
                    <SummaryCard key={`${page}-staff-card`} page={page} pageData={data.staffData} selectedEntry={selectedEntry} queryClient={queryClient}/>
                </> :
                    <h1>Page has not been implemented yet</h1>}
                </div>
        );
    }
    
}