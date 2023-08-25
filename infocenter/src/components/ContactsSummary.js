import { ContactCard } from "./ContactCard";
import { ContactsFilter } from "./ContactsFilter";

export function ContactsSummary({selectedDepartment, pageData, onHospitalChange, onDepartmentChange}) {
    
    const departmentContacts = pageData.filter((entry) => {
        return entry.hospital === selectedDepartment.hospital && entry.department === selectedDepartment.department
    }) 
    
    return (
        <div className="hospital-contacts-container">
            <div className="contacts-heading">
                <h2>Department Contacts</h2>
            </div>   
            <div className="contacts-main-display">
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