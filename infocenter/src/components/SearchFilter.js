import { SearchInput } from "./SearchInput";
import { SearchTable } from "./SearchTable";
import { useState } from "react";
import useMediaQueries from "media-queries-in-react"
import { generateDataPages } from "../utils/utils";
import { ModalSkeleton } from "./ModalSkeleton";
import { AddNewForm } from "./AddNewForm";

export function SearchFilter({page, pageData, onRowClick, queryClient, showMessage, closeDialog}) {
    const [query, setQuery] = useState('null');
    const [tableIndex, setTableIndex] = useState(0);
    const [addNewModal, setAddNewModal] = useState(false);
    
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

    function openAddModal() {
        setAddNewModal(true);
    }

    function closeAddModal() {
        setAddNewModal(false);
    }

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
        <div className="search-filter">
            <SearchInput key={`${pageSelected}-input`} onQueryChange={onQueryChange} openAddModal={openAddModal}/>
            <SearchTable key={`${pageSelected}-table`} tableIndex={tableIndex} maxIndex={maxIndex} pageSelected={page} paginatedData={paginatedData} onRowClick={onRowClick} onTableArrowClick={onTableArrowClick} />
            {addNewModal && 
            <ModalSkeleton closeModal={closeAddModal} type="add-new" page={page}>
                <AddNewForm page={page} pageData={pageData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={closeAddModal}></AddNewForm>
            </ModalSkeleton>}
        </div>
    );
}