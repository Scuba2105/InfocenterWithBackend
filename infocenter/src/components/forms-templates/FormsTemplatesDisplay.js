const serviceAgents = ["B Braun", "Cardinal Health", "Fresenius Kabi", "GE Healthcare", ["Generic Delivery", "Note"], "ICU Medical", ["Independent Living", "Specialists"], "Inline Systems", "JD Healthcare",
                       "Masimo", "Medtronic", "Neomedix", ["Philips", "Respironics"], "REM Systems", "Resmed", "Verathon", "Welch Allyn"];

export function FormsTemplatesDisplay() {
    return (
        <div className="forms-templates-container flex-c-col">
            <div className="templates-section flex-c-col">
                <h2 className="template-heading">Service Requests</h2>
                <div className="templates-links-container">
                    {serviceAgents.map((entry) => {
                        return <div className="template-service-request flex-c-col">{typeof entry === "string" ? entry : 
                        entry.map((word) => {
                            return <label>{word}</label>
                        })}</div>
                    })}
                </div>                
            </div>
        </div>
    )
}