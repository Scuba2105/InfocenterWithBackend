import { ContactCard } from "./ContactCard"

export function ContactsSummary({selectedDepartment, pageData}) {
    
    const departmentContacts = pageData.filter((entry) => {
        return entry.hospital === selectedDepartment.hospital && entry.department === selectedDepartment.department
    }) 
    
    return (
        <div className="hospital-contacts-container">
            <div className="contacts-heading">
                <h2>Department Contacts</h2>
            </div>   
            <div className="contacts-main-display">
                <div className="contact-location-summary">
                    <h3>{selectedDepartment.hospital}</h3>
                    <h3 className="department-title">{selectedDepartment.department}</h3>
                </div>
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