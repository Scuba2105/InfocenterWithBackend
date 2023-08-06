import { SearchIcon } from "../svg";
import useMediaQueries from "media-queries-in-react";

export function SearchInput({onQueryChange, openAddModal}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className="search-box-container">
            <div className={mediaQueries.laptop ? "search-box-laptop" : "search-box-desktop"}>
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
            <SearchIcon color="#97a5dd" size="25px" mediaQueries={mediaQueries}/> 
            <button className={mediaQueries.laptop ? "add-new-btn-laptop" : "add-new-btn-desktop"} onClick={openAddModal}>+ Add New</button> 
        </div>
    );
}