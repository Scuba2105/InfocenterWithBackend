import { EditIcon } from "../svg";

// Define arrays for contact header background colors
const backgroundColors = ["#6EDDC0", "#CBFF4D", "#CBFF4D4", "#6EDDC0"]
const vendorBackgroundColors = ["#6EDDC0", "#CBFF4D", "#CBFF4D4", "#6EDDC0"]

export function ContactCard({identifier, contact, index, openUpdateContactModal}) {

    return (
        <div className="contact-card-container" style={{border: `1px solid ${backgroundColors[index]}`}}>
            <div className="contact-update-header" style={identifier === "staff" ? {color: backgroundColors[index]} : {color: backgroundColors[index]}}>
                <label>{`Last Updated: ${contact.lastUpdate}`}</label>
                <EditIcon id={"contact-update-edit"} onClick={openUpdateContactModal} color={identifier === "staff" ? backgroundColors[index] : vendorBackgroundColors[index]} size="15px"></EditIcon>
            </div>
            <div className={contact.position === "" ? "contact-card-header contact-header-centered" : "contact-card-header"} style={identifier === "staff" ? {color: backgroundColors[index]} : {color: backgroundColors[index]}}>
                <label id="contact-name">{contact.contact}</label>
                <label id="contact-position">{contact.position}</label>
            </div> 
            <div className="contact-numbers-container">
                <div className="contact-number">
                    <label className="number-description">Office Phone</label>
                    <label className={[0, 3].includes(index) ? "number-value number-value-main" : "number-value number-value-alternate"}>{contact.officePhone !== "" ? contact.officePhone : "-"}</label>
                </div>
                {identifier === "staff" && <div className="contact-number">
                    <label className="number-description">Dect Phone</label>
                    <label className={[0, 3].includes(index) ? "number-value number-value-main" : "number-value number-value-alternate"}>{contact.dectPhone !== "" ? contact.dectPhone : "-"}</label>
                </div>}
                <div className="contact-number">
                    <label className="number-description">Mobile Phone</label>
                    <label className={[0, 3].includes(index) ? "number-value number-value-main" : "number-value number-value-alternate"}>{contact.mobilePhone !== "" ? contact.mobilePhone : "-"}</label>
                </div> 
                {identifier === "vendor" && <div className="contact-number">
                    <label className="number-description">{contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? "GE Portal" : "Email" }</label>
                    <a className={[0, 3].includes(index) ? "number-value website-link-main" : "number-value website-link-alternate"} href={contact.email === "" ? null : contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? contact.email : `mailto:${contact.email}`}>{contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? "Website" : contact.email !== "" ? contact.email : "-"}</a>
                </div>}                
            </div>
        </div>
    );
}