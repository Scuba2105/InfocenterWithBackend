import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { useState } from "react";
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";

export function MainArea({page}) {

    const {data, status} = useQuery(['dataSource'], async () => {
        const res = await fetch("http://localhost:5000/getData", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer"
        })
        const data = await res.json();
        return data;
    });

    const initialEntry = page === 'staff' ? '60146568' : page === 'technical-info' ? 'MX450' : null

    const [selectedEntry, setSelectedEntry] = useState(initialEntry);

    // Update the selected entry on selecting a row
    function onRowClick(e) {
        const row = e.target.parentNode;
        const entryIdentifier = row.children[0].textContent === '-' ? row.children[1].textContent : row.children[0].textContent
        setSelectedEntry(entryIdentifier);
    }

    if (status === 'loading') {
        <div>Loading...</div>
    }
    else if (status === 'error') {
        <div>{`An error occurred: ${status.error}`}</div>
    }
    else if (status === 'success') {
        return (
            <div key={page} className="main-area">
                {page === "technical-info" ? 
            <>
                <SearchFilter key={`${page}-device-filter`} page={page} pageData={data.deviceData} onRowClick={onRowClick} />
                <SummaryCard key={`${page}-device-card`} page={page} pageData={data.deviceData} selectedEntry={selectedEntry} />
            </> :
            page === "staff" ?
            <>
                <SearchFilter key={`${page}-staff-filter`} page={page} pageData={data.staffData} onRowClick={onRowClick} />
                <SummaryCard key={`${page}-staff-card`} page={page} pageData={data.staffData} selectedEntry={selectedEntry} />
            </> :
                <h1>Page has not been implemented yet</h1>}
            </div>
        );
    }
    
}