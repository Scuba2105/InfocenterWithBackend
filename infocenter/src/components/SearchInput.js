import { SearchIcon } from "../svg";
import { useUser } from "./StateStore";
import useMediaQueries from "media-queries-in-react";

function searchBoxTransform(laptop) {
    if (laptop) {
        return {width: 100 + '%', transform: 'translateX(12px)'}
    }
    else {
        return {width: 100 + '%', transform: 'translateX(13px)'}
    }
}

function searchIconClass(laptop, permissions) {
    if (laptop && permissions === "user") {
        return "search-icon-laptop-user";
    }
    else if (laptop && permissions === "admin") {
        return "search-icon-laptop-admin";
    }
    else if (!laptop && permissions === "user") {
        return "search-icon-desktop-user";
    }
    else {
        return "search-icon-desktop-admin";
    }
    
}

export function SearchInput({onQueryChange, openAddModal}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    
    const searchIconClassName = searchIconClass(mediaQueries.laptop, currentUser.permissions)

    return (
        <div className="search-box-container">
            <div className={mediaQueries.laptop ? "search-box-laptop" : "search-box-desktop"} style={currentUser.permissions !== "admin" ? searchBoxTransform(mediaQueries.laptop) : null}>
                <input style={{
                                color: "#69737a", 
                                backgroundColor: "transparent", 
                                border: 'none',
                                paddingLeft: "50px"
                            }} 
                    className="search-input" 
                    placeholder="Search..."
                    onChange={onQueryChange}>
                </input>   
            </div>
            <SearchIcon color="#69737a" size="25px" searchIconClassName={searchIconClassName}/> 
            {currentUser.permissions === "admin" && <button className={mediaQueries.laptop ? "add-new-btn-laptop" : "add-new-btn-desktop"} onClick={openAddModal}>+</button>} 
        </div>
    );
}