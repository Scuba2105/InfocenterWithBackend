import { useState } from "react";
import { NextIcon } from "../../svg";
import { ContactCard } from "./ContactCard";
import { ContactsFilter } from "./ContactsFilter";
import { ModalSkeleton } from "../ModalSkeleton";
import { AddNewContact } from "./AddNewContact";
import { UpdateContact } from "./UpdateContact";
import { Tooltip } from "../Tooltip";
import { MainButton } from "../MainButton";
import { PlusIcon } from "../../svg";
import { useUser } from "../StateStore";
import useMediaQueries from "media-queries-in-react"
import { delayFunctionInitiation } from "../../utils/utils";

function pageArrowClick(identifier, contactPage, vendorContactPage, setContactPage, setVendorContactPage, maxIndex, e) {
    let id = e.target.id;
    while (!id) {
        id = e.target.parentNode.id;
    }
    
    const pressed = id.split('_')[0];
    
    if (identifier === "staff") {
        if (pressed === "forward-next" && contactPage < maxIndex) {
            setContactPage(p => p + 1);
        }
        else if (pressed === "back-next" && contactPage > 0) {
            setContactPage(p => p - 1);
        }
    }
    else if (identifier === "vendor") {
        if (pressed === "forward-next" && vendorContactPage < maxIndex) {
            setVendorContactPage(v => v + 1);
        }
        else if (pressed === "back-next" && vendorContactPage > 0) {
            setVendorContactPage(v => v - 1);
        }   
    }
} 

function openAddContactModal(setAddContactVisible) {
    delayFunctionInitiation(() => {
        setAddContactVisible(true);
    })    
}

function closeAddContactModal(setAddContactVisible) {
    setAddContactVisible(false);
}

function openUpdateContactModal(setCurrentContact, contactData , id, setUpdateContactVisible) {
    delayFunctionInitiation(() => {
        setCurrentContact({id: id, data: contactData})
        setUpdateContactVisible(true)
    })
}

function closeUpdateContactModal(setUpdateContactVisible) {
    setUpdateContactVisible(false)
}

function ButtonComponent({onMouseOver, onClick, onMouseOut}) {
    return (
        <MainButton buttonSize="40px" Image={PlusIcon} imageColor="#BCE7FD" size="25px" onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
    )
}

export function ContactsSummary({page, identifier, selectedDepartment, setSelectedDepartment, setVendor, selectedVendor, pageData, onHospitalChange, onDepartmentChange, onVendorChange, queryClient, showMessage, closeDialog}) {
    
    // Contacts for each department are viewed over several pages. Store the state of the page.
    const [contactPage, setContactPage] = useState(0);
    const [vendorContactPage, setVendorContactPage] = useState(0);
    const [addContactVisible, setAddContactVisible] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [updateContactVisible, setUpdateContactVisible] = useState(false);
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });

    // Get the permissions of the current user from the state store
    const currentUser = useUser((state) => state.userCredentials);
    
    // Get all contacts for the selected department
    const allDepartmentContacts = pageData.filter((entry) => {
        if (identifier === "staff") {
            return entry.hospital === selectedDepartment.hospital && entry.department === selectedDepartment.department
        }
        else {
            return entry.vendor === selectedVendor;
        }  
    });

    // Define the number of contacts to display per page and the max page number
    const entriesPerPage = mediaQueries.laptop ? 2 : 4;
    const maxIndex = Math.ceil(allDepartmentContacts.length / entriesPerPage - 1);

    // Filter the department contacts to show only those on the current page
    let displayedContacts;

    displayedContacts = identifier === "staff" ? 
    allDepartmentContacts.slice(contactPage*entriesPerPage, contactPage*entriesPerPage + entriesPerPage) :
    allDepartmentContacts.slice(vendorContactPage*entriesPerPage, vendorContactPage*entriesPerPage + entriesPerPage)
    
    return (
        <div className="hospital-contacts-container size-100">
            <div className={currentUser.permissions === "admin" ? "contacts-heading-admin flex-c" : "contacts-heading flex-c"}>
                {currentUser.permissions === "admin" && <div id="summary-header-aligner" style={{marginLeft: 15 + 'px'}}></div>}
                <h2>{identifier === "staff" ? "Department Contacts" : "Vendor Contacts"}</h2>
                {currentUser.permissions === "admin" && <Tooltip content={identifier === "staff" ? "Add Dept. Contact": "Add Vendor Contact"} xPos={identifier === "staff" ? "-27px" : "-32px"} yPos="-45px" btnTranslateX="-20px" ButtonComponent={ButtonComponent} onClick={() => openAddContactModal(setAddContactVisible)} />}
            </div>   
            <div className="contacts-main-display">
                <ContactsFilter identifier={identifier} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} selectedVendor={selectedVendor} pageData={pageData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange} setVendor={setVendor} onVendorChange={onVendorChange} setContactPage={setContactPage} setVendorContactPage={setVendorContactPage}></ContactsFilter>
                <div className="contacts-display">
                    {displayedContacts.map((contact) => {
                        const index = allDepartmentContacts.indexOf(contact);
                        const colorIndex = index % 4;
                        return (
                            <div key={`contact-${index}`} className="size-100 flex-c">
                                <ContactCard identifier={identifier} contact={contact} index={colorIndex} setCurrentContact={setCurrentContact} openUpdateContactModal={() => openUpdateContactModal(setCurrentContact, contact, index, setUpdateContactVisible)}></ContactCard>
                            </div>
                        )
                    })}
                </div>
                <div className="page-controls" style={mediaQueries.laptop ? {transform: "translateY(15px)"} : null} onClick={(e) => pageArrowClick(identifier, contactPage, vendorContactPage, setContactPage, setVendorContactPage, maxIndex, e)}>
                    <NextIcon className="back-next-icon" color="white" size="11px" offset="1" angle="180" id="back-next" />
                    <label className="table-page-info">{`Page ${identifier === "staff" ? contactPage + 1 : vendorContactPage + 1} of ${maxIndex + 1}`}</label>
                    <NextIcon className="forward-next-icon" color="white" size="11px" offset="0" angle="0" id="forward-next" />
                </div>
            </div>                  
            {addContactVisible && 
            <ModalSkeleton type={identifier === "staff" ? 'new-department-contact' : 'new-vendor'} closeModal={() => closeAddContactModal(setAddContactVisible)}>
                <AddNewContact formType={identifier} page={page} pageData={pageData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddContactModal={() => closeAddContactModal(setAddContactVisible)}></AddNewContact>
            </ModalSkeleton>}
            {updateContactVisible && 
            <ModalSkeleton selectedData={currentContact} type={identifier === "staff" ? "update-staff-contact" : "update-vendor-contact"} closeModal={() => closeUpdateContactModal(setUpdateContactVisible)}>
                <UpdateContact currentContact={currentContact} formType={identifier} page={page} pageData={pageData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeUpdateContactModal={() => closeUpdateContactModal(setUpdateContactVisible)}></UpdateContact>
            </ModalSkeleton>}
        </div>
    )
}