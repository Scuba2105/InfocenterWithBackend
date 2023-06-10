import { SearchIcon } from "../svg";

export function SearchInput({onQueryChange}) {
    return (
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
            <SearchIcon color="#97a5dd" size="25px" />  
        </div>
   );
}