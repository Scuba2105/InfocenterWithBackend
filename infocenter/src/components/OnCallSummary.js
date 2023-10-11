export function OnCallSummary({name, comments, title}) {
    return (
        <>
            <table className="on-call-table">
                <thead>
                    <tr>
                        <th className="on-call-title" colspan="2" cellSpacing="0px">{title}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="on-call-name">Name</td>
                        <td className="on-call-comment">Comments</td>
                    </tr>
                    <tr>
                        <td className="on-call-data">{name}</td>
                        <td className="on-call-data" style={comments === "N/A" ? {textAlign: 'center'} : null}>{comments}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}