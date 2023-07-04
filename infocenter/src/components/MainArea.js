import { SearchFilter } from "./SearchFilter";
import { SummaryCard } from "./SummaryCard";
import { useQuery } from 'react-query'
import { fetchData } from "../utils/utils";

export function MainArea({page, selectedEntry, onRowClick, queryClient}) {

    const {data, status} = useQuery(['dataSource'], fetchData);

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