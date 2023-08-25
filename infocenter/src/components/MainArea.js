import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { ContactsSummary } from "./ContactsSummary";
import { Utilities } from "./Utilities";
import { DialogBox } from "./DialogBox"; 
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";
import { useState } from "react";
import { ServiceReportUploads } from "./ServiceReportUploads";
import { ServiceRequestGenerator } from "./ServiceRequestGenerator";
import { ThermometerManagement } from "./ThermometerManagement";
import { workshops } from "../data";

// Update the selected entry when changing the hospital select input
function onDepartmentChange(selectedDepartment, setSelectedDepartment, e) {
    const newDepartment = e.currentTarget.value;
    setSelectedDepartment({...selectedDepartment, department: newDepartment});
}

export function MainArea({page, selectedEntry, dialogOpen, dialogMessage, closeDialog, showMessage, onRowClick, queryClient}) {
    
    const { isLoading, error, data } = useQuery(['dataSource'], fetchData);
    const [utilityPage, setUtilityPage] = useState(0)
    const [selectedDepartment, setSelectedDepartment] = useState({hospital: "John Hunter Hospital", department: "Anaesthetics & Recovery"})
    
    function selectUtility(index) {
        setUtilityPage(index);
    }

    // Update the selected entry when changing the hospital select input
    function onHospitalChange(pageData, e) {
        const newHospital = e.currentTarget.value;
        const matchingEntry = pageData.find((entry) => {
            return entry.hospital === newHospital
        })        
        const initialDepartment = matchingEntry.department;
        setSelectedDepartment({hospital: newHospital, department: initialDepartment})
    }    

    // If is loading then show the loading dialog, or error dialog if error. Once data loaded, then close dialog.
    if (isLoading) {
        return (
            <LoadingPage></LoadingPage> 
        )
    }
    
    if (error !== null) {
        return (
            <ErrorPage></ErrorPage>
        )
    }

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
                page === "contacts" ?
                <div className="contacts-page-container">
                    <div className="contacts-summary-container">
                        <ContactsSummary selectedDepartment={selectedDepartment} pageData={data.contactsData} onHospitalChange={onHospitalChange} onDepartmentChange={(e) => onDepartmentChange(selectedDepartment, setSelectedDepartment, e)}></ContactsSummary>
                    </div>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </div> :
                page === "utilities" ?
                <>
                    <Utilities utilityPage={utilityPage} onClick={selectUtility}>
                        {utilityPage === 0 && <ServiceReportUploads></ServiceReportUploads>}
                        {utilityPage === 1 && <ServiceRequestGenerator staffNames={staffNames}></ServiceRequestGenerator>}
                        {utilityPage === 2 && <ThermometerManagement staffNames={staffNames} page={page} dialogOpen={dialogOpen} closeDialog={closeDialog} showMessage={showMessage}></ThermometerManagement>}
                        <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                    </Utilities>
                </> :
                    <h1>Page has not been implemented yet</h1>}
            </div>
        );
    }
}
    
