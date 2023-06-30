import { NextIcon, SkipIcon } from "../svg";
import { useState } from 'react'; 

function generateDataPages(queryData, entriesPerPage) {
    let pageCount = 0;
    const paginatedData = queryData.reduce((acc, curr, index) => {
        const remainder = index % entriesPerPage;
        
        if (remainder === 0 && index !== 0) {
            pageCount++
            acc.push([]);
        }
        
        acc[pageCount].push(curr)
        return acc;
    }, [[]]);
    return paginatedData;
}

export function SearchTable({pageSelected, queryData, onRowClick}) {
    
    const entriesPerPage = 10;
    const paginatedData = generateDataPages(queryData, entriesPerPage);
    
    const [tableIndex, setTableIndex] = useState(0);
    const maxIndex = paginatedData.length - 1;

    function onClick(e) {
        let id = e.target.id;
        while (!id) {
            id = e.target.parentNode.id;
        }
        
        const pressed = id.split('_')[0];
        
        if (pressed === "forward-next" && tableIndex < maxIndex) {
            setTableIndex(i => i + 1);
        } 
        else if (pressed === "back-next" && tableIndex > 0) {
            setTableIndex(i => i - 1);
        }
        else if (pressed === "forward-skip") {
            setTableIndex(maxIndex);
        }
        else if (pressed === "back-skip") {
            setTableIndex(0);
        }
    }

    return (
        <div className="search-table-container">
            <table className="search-table" cellSpacing="0px">
                <thead>
                    <tr key="header-row">
                        <td className="header" >{pageSelected === "staff" ? "Staff ID" : "Model"}</td>
                        <td className="header">{pageSelected === "staff" ? "Name" : "Manufacturer"}</td>
                        <td className="header">{pageSelected === "staff" ? "Office Phone No." : "Type"}</td>
                    </tr>
                </thead>
                <tbody>
                    
                    {paginatedData[tableIndex].map((data, index) => {
                        const rowColor = index % 2 === 0 ? 'white' : '#a3afe1' 
                        return (
                            <>
                                <tr style={{backgroundColor: rowColor}} key={`${data.model}-row`} onClick={onRowClick}>
                                    <td key={pageSelected === 'staff' ? `${data.id}-row` : `${data.model}-row`}>{pageSelected === 'staff' ? data.id : data.model}</td>
                                    <td key={pageSelected === 'staff' ? `${data.name}-row` : `${data.manufacturer}-row`}>{pageSelected === 'staff' ? data.name : data.manufacturer}</td>
                                    <td key={pageSelected === 'staff' ? `${data.officePhone}-row` : `${data.type}-row`}>{pageSelected === 'staff' ? data.officePhone : data.type}</td>
                                </tr>
                            </>

                        );
                    })}
                </tbody>
            </table>
            <div className="table-controls" onClick={onClick}>
                    <SkipIcon className="back-skip-icon" color="white" size="21px" offset="0" angle="0" id="back-skip" />
                    <NextIcon className="back-next-icon" color="white" size="11px" offset="1" angle="180" id="back-next" />
                    <label className="table-page-info">{`Page ${tableIndex + 1} of ${maxIndex + 1}`}</label>
                    <NextIcon className="forward-next-icon" color="white" size="11px" offset="0" angle="0" id="forward-next" />
                    <SkipIcon className="forward-skip-icon" color="white" size="21px" offset="0" angle="180" id="forward-skip" />
            </div>
        </div>
    );
}