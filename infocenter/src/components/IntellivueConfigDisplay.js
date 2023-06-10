export function IntellivueConfigDisplay({selectedData, parsedConfigData, hospitals, departmentsIndex, hospitalsIndex}) {
    return (
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
            <a href={`${process.env.PUBLIC_URL}${selectedData.config[hospitals[hospitalsIndex]][departmentsIndex]}.cfg`} download>Download</a>
        </div>
    );
} 