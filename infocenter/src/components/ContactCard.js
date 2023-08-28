const backgroundColors = ["#06BE77", "#A833B9", "#F06543", "#5938EB"]

export function ContactCard({identifier, contact, index}) {
    
    return (
        <div className="contact-card-container">
            <div className="contact-card-header" style={{backgroundColor: backgroundColors[index]}}>
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
                    <label className="number-description">Email </label>
                    <label className="number-value">{contact.email}</label>
                </div>}                
            </div>   
        </div>
    );
}