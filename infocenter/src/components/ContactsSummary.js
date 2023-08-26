import { ContactCard } from "./ContactCard";
import { ContactsFilter } from "./ContactsFilter";
import useMediaQueries from "media-queries-in-react"

export function ContactsSummary({selectedDepartment, pageData, onHospitalChange, onDepartmentChange}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const departmentContacts = pageData.filter((entry) => {
        return entry.hospital === selectedDepartment.hospital && entry.department === selectedDepartment.department
    });
    
    return (
        <div className="hospital-contacts-container">
            <div className="contacts-heading">
                <h2>Department Contacts</h2>
            </div>   
            <div className={mediaQueries.laptop ? "contacts-main-display contacts-main-display-laptop" : "contacts-main-display contacts-main-display-desktop"}>
                <ContactsFilter selectedDepartment={selectedDepartment} pageData={pageData} onHospitalChange={onHospitalChange} onDepartmentChange={onDepartmentChange} ></ContactsFilter>
                <div className="contacts-display">
                    {departmentContacts.map((contact) => {
                        return (
                            <div className="contact-container">
                                <ContactCard  contact={contact}></ContactCard>
                            </div>
                        )
                    })}
                </div>
            </div>                  
        </div>
    )
}