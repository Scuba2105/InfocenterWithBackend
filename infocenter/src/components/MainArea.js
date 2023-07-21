import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { Utilities } from "./Utilities";
import { DialogBox } from "./DialogBox"; 
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";
import { useState } from "react";
import { ServiceReportUploads } from "./ServiceReportUploads";
import { ThermometerManagement } from "./ThermometerManagement";
import { utilityFunctions } from "../data";

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

    function selectUtility(e) {
        const newIndex = utilityFunctions.indexOf(e.currentTarget.value);
        setUtilityPage(newIndex);
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
                    <Utilities onChange={selectUtility}>
                        {utilityPage === 0 && <ServiceReportUploads></ServiceReportUploads>}
                        {utilityPage === 1 && <ThermometerManagement></ThermometerManagement>}
                    </Utilities>
                </> :
                    <h1>Page has not been implemented yet</h1>}
            </div>
        );
    }
    
}