import { useState } from "react";
import { NextIcon } from "../svg";
import { ContactCard } from "./ContactCard";
import { ContactsFilter } from "./ContactsFilter";
import useMediaQueries from "media-queries-in-react"

export function ContactsSummary({selectedDepartment, pageData, onHospitalChange, onDepartmentChange}) {
    
    // Contacts for each department are viewed over several pages. Store the state of the page.
    const [contactPage, setContactPage] = useState(0);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const allDepartmentContacts = pageData.filter((entry) => {
        return entry.hospital === selectedDepartment.hospital && entry.department === selectedDepartment.department
    });

    // Define the number of contacts to display per page and the max page number
    const entriesPerPage = mediaQueries.laptop ? 2 : 4;
    const maxIndex = Math.ceil(allDepartmentContacts.length / entriesPerPage - 1);

    // Filter the department contacts to show only those on the current page
    const displayedDepartmentContacts = allDepartmentContacts.slice(contactPage*entriesPerPage, contactPage*entriesPerPage + entriesPerPage);
    
    function pageArrowClick(e) {
        let id = e.target.id;
        while (!id) {
            id = e.target.parentNode.id;
        }
        
        const pressed = id.split('_')[0];
        
        if (pressed === "forward-next" && contactPage < maxIndex) {
            setContactPage(p => p + 1);
        } 
        else if (pressed === "back-next" && contactPage > 0) {
            setContactPage(p => p - 1);
        }
    }

    return (
        <div className="hospital-contacts-container">
            <div className="contacts-heading">
                <h2>Department Contacts</h2>
            </div>   
            <div className={mediaQueries.laptop ? "contacts-main-display contacts-main-display-laptop" : "contacts-main-display contacts-main-display-desktop"}>
                <ContactsFilter selectedDepartment={selectedDepartment} pageData={pageData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange} setContactPage={setContactPage}></ContactsFilter>
                <div className="contacts-display">
                    {displayedDepartmentContacts.map((contact) => {
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