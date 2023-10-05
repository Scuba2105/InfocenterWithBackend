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

export function SearchInput({onQueryChange, openAddModal}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    
    return (
        <div className="search-box-container">
            <div className="search-box" style={currentUser.permissions !== "admin" ? searchBoxTransform(mediaQueries.laptop) : null}>
                <input className="search-input" placeholder="Search..." onChange={onQueryChange}>
                </input>   
            </div>
            {currentUser.permissions === "admin" && <button className={mediaQueries.laptop ? "add-new-btn-laptop" : "add-new-btn-desktop"} onClick={openAddModal}>+</button>} 
        </div>
    );
}