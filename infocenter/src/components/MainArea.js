import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";

export function MainArea({pageData, selectedEntry, onRowClick, updatePageData}) {

    const mainBody = pageData.page === "technical-info" ? 
            <>
                <SearchFilter key={`${pageData.page}-device-filter`} pageData={pageData} selectedEntry={selectedEntry} onRowClick={onRowClick} />
                <SummaryCard key={`${pageData.page}-device-card`} pageData={pageData} selectedEntry={selectedEntry} updatePageData={updatePageData}/>
            </> :
            pageData.page === "staff" ?
            <>
                <SearchFilter key={`${pageData.page}-staff-filter`} pageData={pageData} selectedEntry={selectedEntry} onRowClick={onRowClick} />
                <SummaryCard key={`${pageData.page}-staff-card`} pageData={pageData} selectedEntry={selectedEntry} />
            </> :
            <h1>Page has not been implemented yet</h1>
            
            

    return (
        <div key={pageData.page} className="main-area">
            {mainBody}
        </div>
    );
}