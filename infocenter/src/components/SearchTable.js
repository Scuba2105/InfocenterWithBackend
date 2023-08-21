import { NextIcon, SkipIcon } from "../svg";
import useMediaQueries from "media-queries-in-react";

export function SearchTable({tableIndex, maxIndex, pageSelected, paginatedData, onRowClick, onTableArrowClick}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className="search-table-container">
            <table className={mediaQueries.laptop ? "search-table-laptop" : "search-table-desktop"} cellSpacing="0px">
                <thead>
                    <tr key="header-row">
                        <td className="header" >{pageSelected === "staff" ? "Staff ID" : pageSelected === "technical-info" ? "Model" : "Name"}</td>
                        <td className="header">{pageSelected === "staff" ? "Name" : pageSelected === "technical-info" ? "Manufacturer" : "Hospital"}</td>
                        <td className="header">{pageSelected === "staff" ? "Office Phone No." : pageSelected === "technical-info" ? "Type" : "Department"}</td>
                    </tr>
                </thead>
                <tbody>
                    
                    {paginatedData[tableIndex].map((data, index) => {
                        const rowColor = index % 2 === 0 ? 'white' : '#a3afe1' 
                        return (
                            <>
                                <tr style={{backgroundColor: rowColor}} key={`${data.model}-row`} onClick={onRowClick}>
                                    <td key={pageSelected === 'staff' ? `${data.id}-row` : pageSelected === 'technical-info' ? `${data.model}-row` : `${data.contact}-row`}>{pageSelected === 'staff' ? data.id : pageSelected === 'technical-info' ? data.model : data.contact}</td>
                                    <td key={pageSelected === 'staff' ? `${data.name}-row` : pageSelected === 'technical-info' ? `${data.manufacturer}-row` : `${data.hospital}-row`}>{pageSelected === 'staff' ? data.name : pageSelected === 'technical-info' ? data.manufacturer : data.hospital}</td>
                                    <td key={pageSelected === 'staff' ? `${data.officePhone}-row` : pageSelected === 'technical-info' ? `${data.type}-row` : `${data.department}-row`}>{pageSelected === 'staff' ? data.officePhone : pageSelected === 'technical-info' ? data.type : data.department}</td>
                                </tr>
                            </>

                        );
                    })}
                </tbody>
            </table>
            <div className="table-controls" onClick={onTableArrowClick}>
                    <SkipIcon className="back-skip-icon" color="white" size="21px" offset="0" angle="0" id="back-skip" />
                    <NextIcon className="back-next-icon" color="white" size="11px" offset="1" angle="180" id="back-next" />
                    <label className="table-page-info">{`Page ${tableIndex + 1} of ${maxIndex + 1}`}</label>
                    <NextIcon className="forward-next-icon" color="white" size="11px" offset="0" angle="0" id="forward-next" />
                    <SkipIcon className="forward-skip-icon" color="white" size="21px" offset="0" angle="180" id="forward-skip" />
            </div>
        </div>
    );
}