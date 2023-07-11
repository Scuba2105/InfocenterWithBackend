import useMediaQueries from "media-queries-in-react"
import { useState } from "react";
import { ConfigArrow } from "../svg";

export function IntellivueConfigDisplay({selectedData, parsedConfigData, hospitals,  departmentName, departmentsIndex, hospitalsIndex}) {
    
    const [configIndex, setConfigIndex] = useState(0);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const fileName = selectedData.config[hospitals[hospitalsIndex]][departmentsIndex].split('/').slice(-1)[0];
    
    const currentConfigEntries = selectedData.config[hospitals[hospitalsIndex]];
    
    // filter current entries only when multiple config files exist for each dept. eg, B Braun, TC50 etx
    
    if (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3' ) {
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
    else {
        const filteredCurrentEntries = currentConfigEntries.filter((entry) => {
            const departmentArray = entry.split('/').slice(-1)[0].split('_')[2].split('--');
            const departmentId  = departmentArray.map((word) => {
                return word.replace('-', ' ');
            }).join(' - ');
            
            return departmentId === departmentName;
        })
        const parsedEntries =  filteredCurrentEntries.map((entry) => {
            return entry.split('/').slice(-1)[0];
        })

        // Get the current entry data based on config index
        const parsedConfigData = parsedEntries[configIndex].split('_');

        // Calculate the number of configs for chosen department
        const configNumber = parsedEntries.length;

        return (
            <>
            {configNumber > 1 && <div className="indicator-container">
                {parsedEntries.map((entry, index) => {
                return <div className={index === configIndex ? "indicator active-indicator" : "indicator"}></div>
            })}
            </div>}
                <div className="config-display-container">
                    <ConfigArrow color="#000000" />
                    <div className={mediaQueries.laptop ? "config-display-laptop" : "config-display-desktop"}>
                        <div key={`${hospitals[hospitalsIndex]}-${departmentName}`} className="config-link">
                                <div className="options-info">
                                    <label>Type: {parsedConfigData[3] === '-' && '-'}</label>
                                    {parsedConfigData[3] !== '-' && <label>{parsedConfigData[3].replace('-', ' ')}</label>}
                                </div>
                                <div className="software-info">
                                    <label>Software: {parsedConfigData[4] === '-' && '-'}</label>
                                    {parsedConfigData[4] !== '-' && <label>{parsedConfigData[4]}</label>}
                                </div>
                                <div className="date-info">
                                    <label>Date Created:</label>
                                    <label>{parsedConfigData[5].split('.').slice(0, -1).join('/')}</label>
                                </div>
                                <a href={`http://localhost:5000${selectedData.config[hospitals[hospitalsIndex]][configIndex]}`} download={fileName} >Download</a>
                        </div>
                    </div>
                    <img className="config-arrow config-right-arrow" src="http://localhost:5000/images/left-arrow.jpg" alt="left-arrow"></img>
                </div>
            </>
        );
    }
} 
    
    
    

    
    