import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { Utilities } from "./Utilities";
import { DialogBox } from "./DialogBox"; 
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";
import { useState, useEffect } from "react";
import { ServiceReportUploads } from "./ServiceReportUploads";
import { ServiceReportGenerator } from "./ServiceReportGenerator";
import { ThermometerManagement } from "./ThermometerManagement";
import { workshops } from "../data";

export function MainArea({page, selectedEntry, onRowClick, queryClient}) {
    
    const { isLoading, error, data } = useQuery(['dataSource'], fetchData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({type: "info", message: ""});
    const [utilityPage, setUtilityPage] = useState(0)

    function closeDialog() {
        setDialogOpen(false);
    };
    
    function showMessage(dialogType, message) {
        setDialogMessage({type: dialogType, message: message});
        setDialogOpen(true);
    }

    function selectUtility(index) {
        setUtilityPage(index);
    }

    // If is loading then show the loading dialog, or error dialog if error. Once data loaded, then close dialog.
    useEffect(() => {
        if (isLoading) {
            showMessage("uploading", "Loading App Data...");
        }
        if (error) {
            showMessage("error", "An error occurred loading the app data from the server!");
        }
        if (data) {
            closeDialog();
        }
    }, [isLoading, error, data])
    
    // If error occurs fetching data then load error dialog.
    useEffect(() => {
        
    }, [error])
     
    // If data retrieved then render the main area based on returned data.
    if (data) {
        const staffNames = data.staffData.reduce((acc, currStaff) => {
            if (!workshops.includes(currStaff.name)) {
                acc.push(currStaff.name);
                return acc;
            }
            return acc;
        }, [])

        return (
            <div key={page} className="main-area">
                {page === "technical-info" ? 
                <>
                    <SearchFilter key={`${page}-device-filter`} page={page} pageData={data.deviceData} onRowClick={onRowClick} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>
                    <SummaryCard key={`${page}-device-card`} page={page} pageData={data.deviceData} selectedEntry={selectedEntry} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} />
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                page === "staff" ?
                <>
                    <SearchFilter key={`${page}-staff-filter`} page={page} pageData={data.staffData} onRowClick={onRowClick} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>
                    <SummaryCard key={`${page}-staff-card`} page={page} pageData={data.staffData} selectedEntry={selectedEntry} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                page === "utilities" ?
                <>
                    <Utilities utilityPage={utilityPage} onClick={selectUtility}>
                        {utilityPage === 0 && <ServiceReportUploads></ServiceReportUploads>}
                        {utilityPage === 1 && <ServiceReportGenerator></ServiceReportGenerator>}
                        {utilityPage === 2 && <ThermometerManagement staffNames={staffNames} page={page} dialogOpen={dialogOpen} closeDialog={closeDialog} showMessage={showMessage}></ThermometerManagement>}
                        <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                    </Utilities>
                </> :
                    <h1>Page has not been implemented yet</h1>}
            </div>
        );
    }
}
    
