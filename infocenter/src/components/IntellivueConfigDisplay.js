import useMediaQueries from "media-queries-in-react"

export function IntellivueConfigDisplay({selectedData, parsedConfigData, hospitals,  departmentName, departmentsIndex, hospitalsIndex}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const fileName = selectedData.config[hospitals[hospitalsIndex]][departmentsIndex].split('/').slice(-1)[0];
    
    const currentConfigEntries = selectedData.config[hospitals[hospitalsIndex]];
    
    // filter current entries only when multiple config files exist for each dept. eg, B Braun, TC50 etx
    
    if (selectedData.model === 'TC50') {
        const filteredCurrentEntries = currentConfigEntries.filter((entry) => {
            return entry.split('/').slice(-1)[0].split('_')[2].replace('-', ' ') === departmentName;
        })
        const parsedEntries =  filteredCurrentEntries.map((entry) => {
            return entry.split('/').slice(-1)[0];
        })
        console.log(parsedEntries)
        return (
            <div className={mediaQueries.laptop ? "config-display-laptop" : "config-display-desktop"}>
                <div className="config-link">
                    <div className="options-info">
                        <label>Type: {parsedConfigData[departmentsIndex][1] === '-' && '-'}</label>
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
                    <a href={`http://localhost:5000${selectedData.config[hospitals[hospitalsIndex]][departmentsIndex]}`} download={fileName} >Download</a>
                </div>
            </div>
            
        );
    }
    else {
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
                    <a href={`http://localhost:5000${selectedData.config[hospitals[hospitalsIndex]][departmentsIndex]}`} download={fileName} >Download</a>
                </div>
            </div>
            
        );
    } 
    }
    
    

    
    