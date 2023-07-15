import { SearchIcon } from "../svg";

export function SearchInput({onQueryChange, openAddModal}) {
    return (
        <div className="search-box-container">
            <div className="search-box">
                <input style={{
                                color: "#97a5dd", 
                                backgroundColor: "transparent", 
                                border: 'none',
                                paddingLeft: "50px"
                            }} 
                    className="search-input" 
                    placeholder="Search..."
                    onChange={onQueryChange}>
                </input>   
            </div>
            <SearchIcon color="#97a5dd" size="25px" /> 
            <button className="add-new-btn" onClick={openAddModal}>+ Add New</button> 
        </div>
    );
}