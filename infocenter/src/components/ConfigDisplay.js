import useMediaQueries from "media-queries-in-react"
import { serverConfig } from "../server";

function updateIndicator(e, setConfigIndex, configIndex, configNumber) {
    const rightArrowPressed = e.currentTarget.classList[1] === "config-right-arrow";
    
    if (rightArrowPressed && configIndex < (configNumber -1)) {
        setConfigIndex(c => c + 1);
    }
    else if (!rightArrowPressed && configIndex > 0) {
        setConfigIndex(c => c - 1);
    }
}

function generateConfigData(selectedData, hospitals, hospitalsIndex, configIndex, departmentName, departmentsIndex) {
    
    const currentConfigEntries = selectedData.config[hospitals[hospitalsIndex]];
    
    // Parse the config string to get the department it belongs to
    const filteredCurrentEntries = currentConfigEntries.filter((entry) => {
        const departmentArray = entry.split('/').slice(-1)[0].split('_')[2].split('--');
        
        const departmentId  = departmentArray.map((word) => {
            return word.replace(/-/g, ' ');
        }).join(' - ');
        
        return departmentId === departmentName;
    })
    
    const parsedEntries =  filteredCurrentEntries.map((entry) => {
        return entry.split('/').slice(-1)[0];
    })
         
    // Get the current entry data based on config index
    const parsedConfigData = parsedEntries[configIndex].split('_');

    // Create the filename for the saved link
    const fileName = parsedEntries[configIndex];
    

    // Calculate the number of configs for chosen department
    const configNumber = parsedEntries.length;

    return [parsedConfigData, parsedEntries, configNumber, fileName]
}

export function ConfigDisplay({selectedData, hospitals, departmentName, departmentsIndex, hospitalsIndex, configIndex, setConfigIndex}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const [parsedConfigData, parsedEntries, configNumber, fileName] = generateConfigData(selectedData, hospitals, hospitalsIndex, configIndex, departmentName, departmentsIndex);

    return (
        <>
        {configNumber > 1 && <div className="indicator-container">
            {parsedEntries.map((entry, index) => {
            return <div key={`indicator${index}`} className={index === configIndex ? "indicator active-indicator" : "indicator"}></div>
        })}
        </div>}
            <div className="config-display-container">
                {configNumber > 1 && <img className="config-arrow config-left-arrow" onClick={(e) => updateIndicator(e, setConfigIndex, configIndex, configNumber)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>}
                <div className={mediaQueries.laptop ? "config-display-laptop" : "config-display-desktop"}>
                    <div key={`${hospitals[hospitalsIndex]}-${departmentName}`} className={mediaQueries.laptop ? "config-link config-link-laptop" : "config-link"}>
                            <div className="options-info">
                                <label>{/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3' ? "Options:" : "Type:"} {parsedConfigData[3] === '-' && '-'}</label>
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
                            <a href={`http://${serverConfig.host}:${serverConfig.port}${selectedData.config[hospitals[hospitalsIndex]][departmentsIndex].split('/').slice(0, -1)}/${fileName}`} download={fileName} >Download</a>
                    </div>
                </div>
                {configNumber > 1 && <img className="config-arrow config-right-arrow" onClick={(e) => updateIndicator(e, setConfigIndex, configIndex, configNumber)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>}
            </div>
        </>
    );
} 
    
    
    

    
    