import { useUser } from "./StateStore";
import useMediaQueries from "media-queries-in-react";
import { Tooltip } from "./Tooltip";
import { MainButton } from "./MainButton";
import { PlusIcon } from "../svg";

function searchBoxTransform(laptop) {
    if (laptop) {
        return {width: 100 + '%', transform: 'translateX(12px)'}
    }
    else {
        return {width: 100 + '%', transform: 'translateX(13px)'}
    }
}

function ButtonComponent({onMouseOver, onClick, onMouseOut}) {
    return (
        <MainButton buttonSize="40px" Image={PlusIcon} imageColor="#5ef8ed" size="25px" onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
    )
}

export function SearchInput({page, onQueryChange, openAddModal}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    
    return (
        <div className="search-box-container flex-c">
            <div className="search-box flex-c" style={currentUser.permissions !== "admin" ? searchBoxTransform(mediaQueries.laptop) : null}>
                <input className="search-input" placeholder="Search..." onChange={onQueryChange}>
                </input>   
            </div>
            {currentUser.permissions === "admin" && <Tooltip content={page === "staff" ? "Add Employee" : "Add Device"} xPos={page === "staff" ? "-18px" : "-12px"} yPos="-45px" btnTranslateX="0px" ButtonComponent={ButtonComponent} onClick={openAddModal} />} 
        </div>
    );
}