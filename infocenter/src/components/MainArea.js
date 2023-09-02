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
import { useVendor } from "./StateStore";

// Set the current utility for the utilities page
function selectUtility(setUtilityPage, index) {
    setUtilityPage(index);
}

// Update the selected vendor entry when changing the vendor select input on the contacts page
function onVendorChange(setVendor, setVendorContactPage, e) {
    const newVendor = e.currentTarget.value;
    setVendor(newVendor);
    setVendorContactPage(0);
}

// Update the selected entry when changing the department select input
function onDepartmentChange(selectedDepartment, setSelectedDepartment, setContactPage, e) {
    const newDepartment = e.currentTarget.value;
    setSelectedDepartment({...selectedDepartment, department: newDepartment});
    setContactPage(0);
}

// Update the selected entry when changing the hospital select input
function onHospitalChange(pageData, setSelectedDepartment, setContactPage, inputsContainer, e) {
    const newHospital = e.currentTarget.value;
    const matchingEntry = pageData.find((entry) => {
        return entry.hospital === newHospital;
    })   
    // Get the department select element so it can be set to the initial department for new hospital
    const departmentSelectElement = inputsContainer.current.querySelectorAll("select")[1];     
    const initialDepartment = matchingEntry.department;
    departmentSelectElement.value = initialDepartment;
    setSelectedDepartment({hospital: newHospital, department: initialDepartment});
    setContactPage(0);
}  

export function MainArea({page, setPage, selectedEntry, dialogOpen, dialogMessage, closeDialog, showMessage, onRowClick, queryClient}) {
    
    const { isLoading, error, data } = useQuery(['dataSource'], fetchData);
    const [utilityPage, setUtilityPage] = useState(0)
    const [selectedDepartment, setSelectedDepartment] = useState({hospital: "John Hunter Hospital", department: "Anaesthetics & Recovery"})
    
    // Get the vendor and setVendor function from the state store
    const vendor = useVendor((state) => state.vendor);
    const setVendor = useVendor((state) => state.setVendor);

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
                    <SummaryCard key={`${page}-device-card`} page={page} setPage={setPage} pageData={data.deviceData} selectedEntry={selectedEntry} setVendor={setVendor} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} />
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
                        <ContactsSummary identifier="staff" selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} pageData={data.contactsData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange}></ContactsSummary>
                    </div>
                    <div className="contacts-summary-container">
                        <ContactsSummary identifier="vendor" selectedVendor={vendor} setVendor={setVendor} pageData={data.vendorContactsData} onVendorChange={onVendorChange}></ContactsSummary>
                    </div>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </div> :
                page === "utilities" ?
                <>
                    <Utilities utilityPage={utilityPage} onClick={selectUtility} setUtilityPage={setUtilityPage}>
                        {utilityPage === 0 && <ServiceReportUploads></ServiceReportUploads>}
                        {utilityPage === 1 && <ServiceRequestGenerator staffNames={staffNames}></ServiceRequestGenerator>}
                        {utilityPage === 2 && <ThermometerManagement staffNames={staffNames} page={page} dialogOpen={dialogOpen} closeDialog={closeDialog} showMessage={showMessage}></ThermometerManagement>}
                        <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                    </Utilities>
                </> :
                    <h1 style={{color: 'white', width: 600 + 'px', margin: 'auto auto'}}>Page has not been implemented yet</h1>}
            </div>
        );
    }
}
    
