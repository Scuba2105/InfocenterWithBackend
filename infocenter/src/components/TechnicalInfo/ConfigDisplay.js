import { serverConfig } from "../../server";
import { NavigationArrow } from "../../svg"

function updateIndicator(e, setConfigIndex, configIndex, configNumber, setClicked) {
    const rightArrowPressed = e.currentTarget.classList[1] === "config-right-arrow";
    
    if (rightArrowPressed && configIndex < (configNumber -1)) {
        setConfigIndex(c => c + 1);
    }
    else if (!rightArrowPressed && configIndex > 0) {
        setConfigIndex(c => c - 1);
    }
}

function generateConfigData(selectedData, hospitals, hospitalsIndex, configIndex, departmentName) {
    
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

    // Create the confing link and filename for the downloaded link
    const configLink = filteredCurrentEntries[configIndex];
    const fileName = parsedEntries[configIndex];
    
    // Calculate the number of configs for chosen department
    const configNumber = parsedEntries.length;
    
    return [parsedConfigData, parsedEntries, configNumber, configLink, fileName]
}

export function ConfigDisplay({selectedData, hospitals, departmentName, hospitalsIndex, configIndex, setConfigIndex}) {
    
    const [parsedConfigData, parsedEntries, configNumber, configLink, fileName] = generateConfigData(selectedData, hospitals, hospitalsIndex, configIndex, departmentName);
    
    return (
        <>
            {configNumber > 1 && <div className="indicator-container flex-c">
                {parsedEntries.map((entry, index) => {
                return <div key={`indicator${index}`} className={index === configIndex ? "indicator active-indicator" : "indicator"}></div>
            })}
            </div>}
            <div className="config-display-container flex-c">
                {configNumber > 1 && <NavigationArrow size="45px" color="white" identifier="config-left-arrow" onClick={(e) => updateIndicator(e, setConfigIndex, configIndex, configNumber)}/>}
                <div className="config-display flex-c-col">
                    <div key={`${hospitals[hospitalsIndex]}-${departmentName}`} className="config-link flex-c-col">
                            <div className="options-info flex-c-col">
                                <label>{/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3' ? "Options:" : "Type:"} {parsedConfigData[3] === '-' && '-'}</label>
                                {parsedConfigData[3] !== '-' && <label>{parsedConfigData[3].replace('-', ' ')}</label>}
                            </div>
                            <div className="software-info flex-c-col">
                                <label>Software: {parsedConfigData[4] === '-' && '-'}</label>
                                {parsedConfigData[4] !== '-' && <label>{parsedConfigData[4]}</label>}
                            </div>
                            <div className="date-info flex-c-col">
                                <label>Date Created:</label>
                                <label>{parsedConfigData[5].split('.').slice(0, -1).join('/')}</label>
                            </div>
                            <a className="flex-c config-download-btn main-btn-transition" href={`https://${serverConfig.host}:${serverConfig.port}${configLink}`} download={fileName} >Download</a>
                    </div>
                </div>
                {configNumber > 1 && <NavigationArrow size="45px" color="white" identifier="config-right-arrow" onClick={(e) => updateIndicator(e, setConfigIndex, configIndex, configNumber)} />}
            </div>
        </>
    );
} 
    
    
    

    
    