import { Tick, Cross } from "../../../svg";

export function BedStatusTable({bedNumber, bedIndex, testingTemplatesData, currentBedData, updateTestingProgress, testingProgress, setTestingProgress, bedDevices}) {
    return (
        <div key={`testing-template-table-${bedIndex}`} className="testing-template-table-container size-100 flex-c">
                        <table className="tg" style={{tableLayout: "fixed", width: 254 + 'px'}}>
                            <thead>
                                <tr>
                                    <th className="tg-c3ow" colSpan="3">{`Room ${bedNumber}`}</th>
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