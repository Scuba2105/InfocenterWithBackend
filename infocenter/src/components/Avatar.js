import { serverConfig } from "../server";
import { useUser, useLoggedIn } from "./StateStore";
import { useState } from "react";
import useMediaQueries from "media-queries-in-react";
import { PadlockIcon, LogoutIcon } from "../svg";

function logoutFromApp(logout) {
    sessionStorage.removeItem("currentInfoCentreSession");
    logout();
}

export function Avatar() {

    const [menuVisible, setMenuVisible] = useState(false);
    const currentUser = useUser((state) => state.userCredentials);

    // Get the logout function from the state store
    const logout = useLoggedIn((state) => state.logout);

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
                <label id="permission-label">{currentUser.permissions === "admin" ? "Administrator" : currentUser.permissions[0].toUpperCase() + currentUser.permissions.split("").slice(1).join("")}</label>
                <div className="avatar-option">
                    <PadlockIcon color="white" size="25px"></PadlockIcon>
                    <label id="change-password">Change Password</label>
                </div>
                <div className="avatar-option" onClick={() => logoutFromApp(logout)}>
                    <LogoutIcon color="white" size="25px"></LogoutIcon>
                    <label id="logout-label">Logout</label>
                </div>
            </div>
        </div>
    )
}