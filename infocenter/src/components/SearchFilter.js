import { SearchInput } from "./SearchInput";
import { SearchTable } from "./SearchTable";
import { useState } from "react";


export function SearchFilter({page, pageData, selectedEntry, onRowClick}) {
    
    const [query, setQuery] = useState('null');

    function onQueryChange(e) {
        setQuery(e.target.value);
    }

    const pageSelected = page;

    const currentDataSet = pageData;
    
    const queryData = currentDataSet.filter((entry) => {
        const regex = new RegExp(query,'ig');
        return regex.test(entry.model) || regex.test(entry.manufacturer) || regex.test(entry.type) || regex.test(entry.name);
    }).sort((a, b) => {
        return a.model < b.model ? -1 : a.model > b.model ? 1 : 0;
    });

    const displayData = queryData.length === 0 ? currentDataSet.sort((a, b) => {
        return a.model < b.model ? -1 : a.model > b.model ? 1 : 0;
    }) : queryData;
    
    return (
        <div className="search-filter">
            <SearchInput key={`${pageSelected}-input`} onQueryChange={onQueryChange} />
            <SearchTable key={`${pageSelected}-table`} pageSelected={page} queryData={displayData} onRowClick={onRowClick} />
        </div>
    );
}