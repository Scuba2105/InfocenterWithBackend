import { EditIcon } from "../svg";

// Define arrays for contact header background colors.
const backgroundColors = ["#6EDDC0", "#BCE7FD", "#BCE7FD", "#6EDDC0"]

// Service Request Websites
const serviceRequestSites = ["https://services.gehealthcare.com.au/gehcstorefront/", "https://secure.medtronicinteract.com/SubmitServiceRequest"]

export function ContactCard({identifier, contact, index, openUpdateContactModal}) {
    return (
        <div className="contact-card-container">
            <div className="contact-update-header" style={{color: backgroundColors[index]}}>
                <label>{`Last Updated: ${contact.lastUpdate}`}</label>
                <EditIcon id={"contact-update-edit"} onClick={openUpdateContactModal} color={backgroundColors[index]} size="15px"></EditIcon>
            </div>
            <div className={contact.position === "" ? "contact-card-header contact-header-centered" : "contact-card-header"} style={{color: backgroundColors[index]}}>
                <label id="contact-name">{contact.contact}</label>
                <label id="contact-position">{contact.position}</label>
            </div> 
            <div className="contact-numbers-container">
                <div className="contact-number">
                    <label className="number-description">Office Phone</label>
                    <label className="number-value">{contact.officePhone !== "" ? contact.officePhone : "-"}</label>
                </div>
                {identifier === "staff" && <div className="contact-number">
                    <label className="number-description">Dect Phone</label>
                    <label className="number-value">{contact.dectPhone !== "" ? contact.dectPhone : "-"}</label>
                </div>}
                <div className="contact-number">
                    <label className="number-description">Mobile Phone</label>
                    <label className="number-value">{contact.mobilePhone !== "" ? contact.mobilePhone : "-"}</label>
                </div> 
                {identifier === "vendor" && <div className="contact-number">
                    <label className="number-description">{contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? "GE Portal" : "Email" }</label>
                    <a className="number-value website-link" href={contact.email === "" ? null : serviceRequestSites.includes(contact.email) ? contact.email : `mailto:${contact.email}`} target={serviceRequestSites.includes(contact.email) ? "_blank" : null} rel={serviceRequestSites.includes(contact.email) ? "noopener noreferrer": null}>{serviceRequestSites.includes(contact.email) ? "Website" : contact.email !== "" ? contact.email : "-"}</a>
                </div>}                
            </div>
        </div>
    );
}