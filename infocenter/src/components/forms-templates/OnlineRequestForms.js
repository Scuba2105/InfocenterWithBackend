export function OnlineRequestForms({serviceAgents, onlineForms}) {
    return (
        <div className="templates-links-container">
            {serviceAgents.map((entry, index) => {
                if (onlineForms[entry]) {
                    return (
                        <a key={entry} href={onlineForms[entry]} target="_blank" rel="noreferrer" className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button" : "template-service-request flex-c-col alternate-link-button"} >
                            {typeof entry === "string" ? entry : 
                                entry.map((word, index) => {
                                    return <label key={`${entry}-${index}`}>{word}</label>
                                })
                            }
                        </a>
                    )
                }
                else {
                    return (
                        <div key={entry} className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button unavailable-link" : "template-service-request flex-c-col alternate-link-button unavailable-link"}>
                            {typeof entry === "string" ? entry : 
                                entry.map((word, index) => {
                                    return <label key={`${entry}-${index}`}>{word}</label>
                                })
                            }
                        </div>
                    )
                }
            })}
        </div>
    )
}