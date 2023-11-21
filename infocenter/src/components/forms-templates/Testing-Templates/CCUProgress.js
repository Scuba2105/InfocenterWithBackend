const bedNumbers = [1, 2 , 3, 4, 5, 6, 7, 8]

export function CCUProgress() {
    return (
        <div className="testing-template-display">
            {bedNumbers.map((entry) => {
                return (
                    <>
                <table class="tg" style={{tableLayout: "fixed", width: 254 + 'px'}}>
                    <thead>
                    <tr>
                        <th class="tg-c3ow" colspan="3">{`Room ${entry}`}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="tg-c3ow">MX700</td>
                        <td class="tg-c3ow">X2</td>
                        <td class="tg-c3ow">Rack</td>
                    </tr>
                    <tr>
                        <td class="tg-c3ow">Incomplete</td>
                        <td class="tg-c3ow">Incomplete</td>
                        <td class="tg-c3ow">Incomplete</td>
                    </tr>
                    </tbody>
                </table>
                </>
                )
            })}
        </div>
    )
}