import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { useState } from "react";
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";

export function MainArea({page, selectedEntry, onRowClick, queryClient}) {

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
                <SummaryCard key={`${page}-device-card`} page={page} pageData={data.deviceData} selectedEntry={selectedEntry} queryClient={queryClient}/>
            </> :
            page === "staff" ?
            <>
                <SearchFilter key={`${page}-staff-filter`} page={page} pageData={data.staffData} onRowClick={onRowClick} />
                <SummaryCard key={`${page}-staff-card`} page={page} pageData={data.staffData} selectedEntry={selectedEntry} queryClient={queryClient}/>
            </> :
                <h1>Page has not been implemented yet</h1>}
            </div>
        );
    }
    
}