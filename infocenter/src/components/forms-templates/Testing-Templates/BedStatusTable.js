import { Tick, Cross } from "../../../svg";

export function BedStatusTable({bedNumber, bedIndex, currentBedData, updateTestingProgress, testingProgress, setTestingProgress, bedDevices}) {
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
                                    {bedDevices.map((device) => {
                                        return (
                                            <td className="tg-c3ow">{device}</td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    {bedDevices.map((device) => {
                                        return (
                                            <td className="tg-c3ow" onClick={() => updateTestingProgress(testingProgress, setTestingProgress, currentBedData, device)}>{currentBedData[device] ? <Tick color="rgb(5, 234, 146)"></Tick> : <Cross color="rgb(253, 67, 67)" />}</td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
    )
}