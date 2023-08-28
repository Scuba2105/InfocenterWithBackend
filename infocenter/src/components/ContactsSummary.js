import { useState } from "react";
import { NextIcon } from "../svg";
import { ContactCard } from "./ContactCard";
import { ContactsFilter } from "./ContactsFilter";
import useMediaQueries from "media-queries-in-react"

export function ContactsSummary({identifier, selectedDepartment, selectedVendor, pageData, onHospitalChange, onDepartmentChange, onVendorChange}) {
    
    // Contacts for each department are viewed over several pages. Store the state of the page.
    const [contactPage, setContactPage] = useState(0);
    const [vendorContactPage, setVendorContactPage] = useState(0);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

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
    
    function pageArrowClick(e) {
        let id = e.target.id;
        while (!id) {
            id = e.target.parentNode.id;
        }
        
        const pressed = id.split('_')[0];
        
        if (pressed === "forward-next" && contactPage < maxIndex) {
            if (identifier === "staff") {
                setContactPage(p => p + 1);
            }
            else if (identifier === "vendor") {
                setVendorContactPage(v => v + 1);
            }
        } 
        else if (pressed === "back-next" && contactPage > 0) {
            if (identifier === "staff") {
                setContactPage(p => p - 1);
            }
            else if (identifier === "vendor") {
                setVendorContactPage(v => v - 1);
            }
        }
    }

    return (
        <div className="hospital-contacts-container">
            <div className="contacts-heading">
                <h2>{identifier === "staff" ? "Department Contacts" : "Vendor Contacts"}</h2>
            </div>   
            <div className={mediaQueries.laptop ? "contacts-main-display contacts-main-display-laptop" : "contacts-main-display contacts-main-display-desktop"}>
                <ContactsFilter identifier={identifier} selectedDepartment={selectedDepartment} selectedVendor={selectedVendor} pageData={pageData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange} onVendorChange={onVendorChange} setContactPage={setContactPage} setVendorContactPage={setVendorContactPage}></ContactsFilter>
                <div className="contacts-display">
                    {displayedContacts.map((contact) => {
                        const index = allDepartmentContacts.indexOf(contact);
                        const colorIndex = index % 4;
                        return (
                            <div className="contact-container">
                                <ContactCard  contact={contact} index={colorIndex}></ContactCard>
                            </div>
                        )
                    })}
                </div>
                <div className="page-controls" onClick={pageArrowClick}>
                    <NextIcon className="back-next-icon" color="white" size="11px" offset="1" angle="180" id="back-next" />
                    <label className="table-page-info">{`Page ${contactPage + 1} of ${maxIndex + 1}`}</label>
                    <NextIcon className="forward-next-icon" color="white" size="11px" offset="0" angle="0" id="forward-next" />
                </div>
            </div>                  
        </div>
    )
}