import useMediaQueries from "media-queries-in-react"

export function IntellivueConfigDisplay({selectedData, parsedConfigData, hospitals, departmentsIndex, hospitalsIndex}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className={mediaQueries.laptop ? "config-display-laptop" : "config-display-desktop"}>
            <div className="config-link">
                <div className="options-info">
                    <label>Options: {parsedConfigData[departmentsIndex][1] === '-' && '-'}</label>
                    {parsedConfigData[departmentsIndex][1] !== '-' && <label>{parsedConfigData[departmentsIndex][1]}</label>}
                </div>
                <div className="software-info">
                    <label>Software: {parsedConfigData[departmentsIndex][2] === '-' && '-'}</label>
                    {parsedConfigData[departmentsIndex][2] !== '-' && <label>{parsedConfigData[departmentsIndex][2]}</label>}
                </div>
                <div className="date-info">
                    <label>Date Created:</label>
                    <label>{parsedConfigData[departmentsIndex][3]}</label>
                </div>
                <a href={`http://localhost:5000${selectedData.config[hospitals[hospitalsIndex]][departmentsIndex]}`} download>Download</a>
            </div>
        </div>
        
    );
} 