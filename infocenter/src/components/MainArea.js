import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { Utilities } from "./Utilities";
import { DialogBox } from "./DialogBox"; 
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";
import { useState } from "react";
import { ServiceReportUploads } from "./ServiceReportUploads";
import { ServiceReportGenerator } from "./ServiceReportGenerator";
import { ThermometerManagement } from "./ThermometerManagement";
import { workshops } from "../data";

export function MainArea({page, selectedEntry, onRowClick, queryClient}) {
    
    const {data, status} = useQuery(['dataSource'], fetchData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({type: "info", message: ""});
    const [utilityPage, setUtilityPage] = useState(0)

    function closeDialog() {
        setDialogOpen(false);
    }

    function showMessage(dialogType, message) {
        setDialogMessage({type: dialogType, message: message});
        setDialogOpen(true);
    }

    function selectUtility(index) {
        setUtilityPage(index);
    }

    if (status === 'loading') {
        <div>Loading...</div>
    }
    else if (status === 'error') {
        <div>{`An error occurred: ${status.error}`}</div>
    }
    else if (status === 'success') {

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