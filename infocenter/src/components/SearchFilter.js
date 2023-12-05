import { SearchInput } from "./SearchInput";
import { SearchTable } from "./SearchTable";
import { useState } from "react";
import useMediaQueries from "media-queries-in-react"
import { generateDataPages } from "../utils/utils";
import { ModalSkeleton } from "./ModalSkeleton";
import { AddNewForm } from "./AddNewForm";

// Update table index when arrow clicked
function onTableArrowClick(e, tableIndex, setTableIndex, maxIndex) {
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

// Change the search query when search input changes
function onQueryChange(e, setQuery, setTableIndex) {
    const lastCharacter = e.target.value.split("").slice(-1)[0];
    const prevCharacters = e.target.value.split("").slice(0, -1).join("");
    if (lastCharacter !== "\\") {
        setQuery(e.target.value);
        setTableIndex(0);
    }
    else {
        e.target.value = prevCharacters;
        setQuery(prevCharacters);
        setTableIndex(0);
    }
}

function openAddModal(setAddNewModal) {
    setAddNewModal(true);
}

function closeAddModal(setAddNewModal) {
    setAddNewModal(false);
}

export function SearchFilter({page, pageData, vendorData, onRowClick, queryClient, showMessage, closeDialog}) {
    const [query, setQuery] = useState('null');
    const [tableIndex, setTableIndex] = useState(0);
    const [addNewModal, setAddNewModal] = useState(false);
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });
    
    const entriesPerPage = mediaQueries.laptop ? 11 : 15;
    
    // Set the page selected and currentDataSet
    const pageSelected = page;
    const currentDataSet = pageData;
    
    // Filter the data based on search box query
    const queryData = currentDataSet.filter((entry) => {
        const regex = new RegExp(query,'ig');
        return regex.test(entry.model) || regex.test(entry.manufacturer) || regex.test(entry.type) || regex.test(entry.name) || regex.test(entry.hospital) || regex.test(entry.department);
    }).sort((a, b) => {
        return a.model < b.model ? -1 : a.model > b.model ? 1 : 0;
    });
    
    // Display all data if no query present
    const displayData = queryData.length === 0 ? currentDataSet.sort((a, b) => {
        return a.model < b.model ? -1 : a.model > b.model ? 1 : 0;
    }) : queryData;
    
    // Create the paginated data from the search box query filtered data
    const paginatedData = generateDataPages(displayData, entriesPerPage);
    const maxIndex = paginatedData.length - 1;
    
    return (
        <div className="search-filter-container flex-c-col">
            <div className="search-filter flex-c-col">
                <SearchInput key={`${pageSelected}-input`} page={page} onQueryChange={(e) => onQueryChange(e, setQuery, setTableIndex)} openAddModal={() => openAddModal(setAddNewModal)}/>
                <SearchTable key={`${pageSelected}-table`} tableIndex={tableIndex} maxIndex={maxIndex} pageSelected={page} paginatedData={paginatedData} onRowClick={onRowClick} onTableArrowClick={(e) => onTableArrowClick(e, tableIndex, setTableIndex, maxIndex)} />
                {addNewModal && 
                <ModalSkeleton closeModal={() => closeAddModal(setAddNewModal)} type="add-new" page={page}>
                    <AddNewForm page={page} pageData={pageData} vendorData={vendorData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={() => closeAddModal(setAddNewModal)}></AddNewForm>
                </ModalSkeleton>}
            </div>
        </div>
        );
}