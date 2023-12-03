export function AdminLinksSection({documentLinksObject}) {
    
    const documentsArray = []; 
    
    for (const [key, value] of Object.entries(documentLinksObject)) {
        documentsArray.push(key);
    }
    
    return (
        <div className="templates-links-container">        
            {documentsArray.map((entry, index) => {
                return (
                    <a key={entry} href={documentLinksObject[entry]} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
                        {typeof entry === "string" ? entry : 
                            entry.map((word, index) => {
                                return <label key={`${entry}-${index}`}>{word}</label>
                            })
                        }
                    </a>
                )
            })}
        </div>
    )
}