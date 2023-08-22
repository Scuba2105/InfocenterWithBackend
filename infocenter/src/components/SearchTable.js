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