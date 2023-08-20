import { serverConfig } from "../server";
import { useUser } from "./StateStore";
import { useState } from "react";
import useMediaQueries from "media-queries-in-react";

export function Avatar() {

    const [menuVisible, setMenuVisible] = useState(false);
    const currentUser = useUser((state) => state.userCredentials);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    function toggleMenu() {
        setMenuVisible(m => !m)
    }

    return (
        <div className="avatar-container" onClick={toggleMenu}>
            <img id="avatar-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/staff/blank-profile.png`} alt="staff"></img>
            <label>{currentUser.user}</label>
            <div className={mediaQueries.laptop ? "avatar-menu-laptop" : "avatar-menu avatar-menu-desktop"} style={menuVisible ? {opacity: 1} : {opacity: 0}}>
                <label>{currentUser.permissions[0].toUpperCase() + currentUser.permissions.split("").slice(1).join("")}</label>
                <label>Change Password</label>
                <label>Logout</label>
            </div>
        </div>
    )
}