export function ContactCard({contact}) {
    return (
        <div className="contact-card-container">
            <label>{contact.contact}</label>
            <label>{contact.position}</label>
            <label>{`Office Ph: ${contact.officePhone}`}</label>
            {contact.dectPhone && <label>{`Dect Ph: ${contact.dectPhone}`}</label>}
        </div>
    );
}