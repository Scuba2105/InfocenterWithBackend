import { Tick, Cross } from "../../../svg";
import { useState } from "react";
const bedNumbers = [1, 2 , 3, 4, 5, 6, 7, 8];

const testData = [{bed: 1, mx700: true, rack: true, x2: false},
                {bed: 2, mx700: true, rack: true, x2: false},
                {bed: 3, mx700: true, rack: true, x2: true},
                {bed: 4, mx700: true, rack: true, x2: false},
                {bed: 5, mx700: true, rack: false, x2: false},
                {bed: 6, mx700: true, rack: true, x2: true},
                {bed: 7, mx700: true, rack: true, x2: false},
                {bed: 8, mx700: false, rack: true, x2: true}
]

function updateTestingProgress(testingProgress, setTestingProgress, selectedBedData, device) {
    const newTestingProgress = testingProgress.reduce((acc, current) => {
        const updatedSelectedData = selectedBedData[device] ? !selectedBedData[device] : selectedBedData[device];
        console.log(updatedSelectedData)        
        if (current.bed === selectedBedData.bed) {
            acc.push(updatedSelectedData)
        }
        else {
            acc.push(current)
        }
        return acc
    }, [])
    console.log(selectedBedData[device]);
    setTestingProgress(newTestingProgress)
}

export function CCUProgress() {

    const [testingProgress, setTestingProgress] = useState(testData);

    return (
        <div className="testing-template-display">
            {bedNumbers.map((entry, index) => {
                const currentBedData = testingProgress.find((bedData) => {
                    return bedData.bed === entry;
                })
                
                return (
                    <div key={`testing-template-table-${index}`} className="testing-template-table-container size-100 flex-c">
                        <table className="tg" style={{tableLayout: "fixed", width: 254 + 'px'}}>
                            <thead>
                            <tr>
                                <th className="tg-c3ow" colSpan="3">{`Room ${entry}`}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="tg-c3ow">MX700</td>
                                <td className="tg-c3ow">Rack</td>
                                <td className="tg-c3ow">X2</td>
                            </tr>
                            <tr>
                                <td className="tg-c3ow" onClick={() => updateTestingProgress(testingProgress, setTestingProgress, currentBedData, "mx700")}>{currentBedData.mx700 ? <Tick color="rgb(5, 234, 146)"></Tick> : <Cross color="rgb(253, 67, 67)" />}</td>
                                <td className="tg-c3ow" onClick={() => updateTestingProgress(testingProgress, setTestingProgress, currentBedData, "rack")}>{currentBedData.rack ? <Tick color="rgb(5, 234, 146)"></Tick> : <Cross color="rgb(253, 67, 67)" />}</td>
                                <td className="tg-c3ow" onClick={() => updateTestingProgress(testingProgress, setTestingProgress, currentBedData, "x2")}>{currentBedData.x2 ? <Tick color="rgb(5, 234, 146)"></Tick> : <Cross color="rgb(253, 67, 67)" />}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )
            })}
        </div>
    )
}