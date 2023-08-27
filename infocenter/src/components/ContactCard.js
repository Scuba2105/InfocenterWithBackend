export function ContactCard({contact}) {
    return (
        <div className="contact-card-container">
            <div className="contact-card-header">
                <label id="contact-name">{contact.contact}</label>
                <label id="contact-position">{contact.position}</label>
            </div> 
            <div className="contact-numbers-container">
                <div className="contact-number">
                    <label className="number-description">Office Phone</label>
                    <label className="number-value">{contact.officePhone}</label>
                </div>
                <div className="contact-number">
                    <label className="number-description">Dect Phone</label>
                    <label className="number-value">{contact.dectPhone ? contact.dectPhone : "-"}</label>
                </div>
                <div className="contact-number">
                    <label className="number-description">Mobile Phone</label>
                    <label className="number-value">{contact.mobilePhone ? contact.mobilePhone : "-"}</label>
                </div>                
            </div>   
        </div>
    );
}