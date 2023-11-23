import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { ContactsSummary } from "./Contacts/ContactsSummary";
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
import { CalendarComponent } from "./OnCall/CalendarComponent";
import { OnCallFunctions } from "./OnCall/OnCallFunctions";
import { FormsTemplatesDisplay } from "./Forms-Templates/FormsTemplatesDisplay";
import { useUser, useVendor } from "./StateStore";

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
    const currentUser = useUser((state) => state.userCredentials)
    const { isLoading, error, data } = useQuery(['dataSource'], () => fetchData(currentUser.staffId));
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
            <ErrorPage errorType="fetch-error"></ErrorPage>
        )
    }

    // If data retrieved then render the main area based on returned data.
    if (data) {
        return (
            <div key={page} className="main-area">
                {page === "technical-info" ? 
                <>
                    <SearchFilter key={`${page}-device-filter`} page={page} pageData={data.deviceData} vendorData={data.vendorContactsData} onRowClick={onRowClick} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>
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
                <>
                    <div className="size-100 flex-c">                                                                                                                                                                                    
                        <ContactsSummary page={page} identifier="staff" selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} pageData={data.contactsData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}></ContactsSummary>
                    </div>
                    <div className="size-100 flex-c">
                        <ContactsSummary page={page} identifier="vendor" selectedVendor={vendor} setVendor={setVendor} pageData={data.vendorContactsData} onVendorChange={onVendorChange} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}></ContactsSummary>
                    </div>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                page === "utilities" ?
                <>
                    <Utilities utilityPage={utilityPage} onClick={selectUtility} setUtilityPage={setUtilityPage}>
                        {utilityPage === 0 && <ServiceReportUploads></ServiceReportUploads>}
                        {utilityPage === 1 && <ServiceRequestGenerator></ServiceRequestGenerator>}
                        {utilityPage === 2 && <ThermometerManagement page={page} dialogOpen={dialogOpen} closeDialog={closeDialog} showMessage={showMessage}></ThermometerManagement>}
                        <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                    </Utilities>
                </> :
                page === "forms-templates" ?
                <>
                    <FormsTemplatesDisplay userFormsTemplates={data.formsTemplatesData} testingTemplatesData={data.testingTemplatesData} currentUserId={currentUser.staffId} page={page} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}></FormsTemplatesDisplay>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                page === "on-call" ?
                <>
                    <CalendarComponent onCallChangedData={data.onCallData}></CalendarComponent>
                    <OnCallFunctions page={page} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}></OnCallFunctions>
                    <DialogBox dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} />
                </> :
                    <h1 style={{color: 'white', width: 600 + 'px', margin: 'auto auto'}}>Page has not been implemented yet</h1>}
            </div>
        );
    }
}
    
