import { SearchInput } from "./SearchInput";
import { SearchTable } from "./SearchTable";
import { useState } from "react";
import useMediaQueries from "media-queries-in-react"
import { generateDataPages } from "../utils/utils";

export function SearchFilter({page, pageData, selectedEntry, onRowClick}) {
    const [query, setQuery] = useState('null');
    const [tableIndex, setTableIndex] = useState(0);
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });
    
    const entriesPerPage = mediaQueries.laptop ? 10 : 15;
    
    function onTableArrowClick(e) {
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

    function onQueryChange(e) {
        setQuery(e.target.value);
        setTableIndex(0);
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
    
    const paginatedData = generateDataPages(displayData, entriesPerPage);
    const maxIndex = paginatedData.length - 1;

    return (
        <div className="search-filter">
            <SearchInput key={`${pageSelected}-input`} onQueryChange={onQueryChange} />
            <SearchTable key={`${pageSelected}-table`} tableIndex={tableIndex} maxIndex={maxIndex} pageSelected={page} paginatedData={paginatedData} onRowClick={onRowClick} onTableArrowClick={onTableArrowClick} />
        </div>
    );
}