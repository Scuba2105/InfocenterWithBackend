const backgroundColors = ["#44CF6C", "#A833B9", "#F06543", "#5938EB"]

export function ContactCard({contact, index}) {
    
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