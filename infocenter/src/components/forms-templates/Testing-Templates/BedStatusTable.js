import { Tick, Cross } from "../../../svg";

function getRoomBedHeading(bedNumber, currentDept) {
    if (Number.isInteger(bedNumber) || ["A", "B", "C"].includes(bedNumber)) {
        if (currentDept === "NICU" || currentDept === "Recovery") {
            return `Bed ${bedNumber}`
        } 
        else if (currentDept === "Operating Suite") {
            return `Theatre ${bedNumber}`
        }
        return `Room ${bedNumber}`
    } 
    else {
        return bedNumber
    }
}

export function BedStatusTable({currentDept, bedNumber, bedIndex, testingTemplatesData, currentBedData, updateTestingProgress, testingProgress, setTestingProgress, bedDevices}) {
    return (
        <div key={`testing-template-table-${bedIndex}`} className="testing-template-table-container size-100 flex-c">
                        <table className="tg" style={{tableLayout: "fixed", width: 254 + 'px'}}>
                            <thead>
                                <tr>
                                    <th className="tg-c3ow" colSpan={bedDevices.length}>{getRoomBedHeading(bedNumber, currentDept)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {bedDevices.map((device, index) => {
                                        return (
                                            <td key={`${device}-Bed${bedNumber}`} className="tg-c3ow">{device}</td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    {bedDevices.map((device) => {
                                        return (
                                            <td key={`${device}-Bed${bedNumber}-Status`} className="tg-c3ow" onClick={() => updateTestingProgress(testingProgress, setTestingProgress, testingTemplatesData, currentBedData, device)}>{currentBedData[device] ? <Tick color="rgb(5, 234, 146)"></Tick> : <Cross color="rgb(253, 67, 67)" />}</td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
    )
}