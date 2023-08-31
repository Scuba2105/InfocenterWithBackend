const backgroundColors = ["#59B561", "#A833B9", "#F06543", "#5938EB"]
const vendorBackgroundColors = ["#D23B6B", "#2D5CC9", "#419D78", "#DD614A"]

export function ContactCard({identifier, contact, index}) {
    
    return (
        <div className="contact-card-container">
            <div className="contact-card-header" style={identifier === "staff" ? {backgroundColor: backgroundColors[index]} : {backgroundColor: vendorBackgroundColors[index]}}>
                <label id="contact-name">{contact.contact}</label>
                <label id="contact-position">{contact.position}</label>
            </div> 
            <div className="contact-numbers-container">
                <div className="contact-number">
                    <label className="number-description">Office Phone</label>
                    <label className="number-value">{contact.officePhone}</label>
                </div>
                {identifier === "staff" && <div className="contact-number">
                    <label className="number-description">Dect Phone</label>
                    <label className="number-value">{contact.dectPhone ? contact.dectPhone : "-"}</label>
                </div>}
                <div className="contact-number">
                    <label className="number-description">Mobile Phone</label>
                    <label className="number-value">{contact.mobilePhone ? contact.mobilePhone : "-"}</label>
                </div> 
                {identifier === "vendor" && <div className="contact-number">
                    <label className="number-description">{contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? "GE Portal" : "Email" }</label>
                    <a className="number-value" href={contact.email === "-" ? null : contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? contact.email : `mailto:${contact.email}`}>{contact.email === "https://services.gehealthcare.com.au/gehcstorefront/" ? "Website" : contact.email}</a>
                </div>}                
            </div>   
        </div>
    );
}