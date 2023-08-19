import { serverConfig } from "../server";
import { useUser } from "./StateStore";
import { useState } from "react";

export function Avatar() {

    const [menuVisible, setMenuVisible] = useState(false);
    const currentUser = useUser((state) => state.userCredentials);

    function toggleMenu() {
        setMenuVisible(m => !m)
    }

    return (
        <div className="avatar-container" onClick={toggleMenu}>
            <img id="avatar-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/staff/blank-profile.png`} alt="staff"></img>
            <label>{currentUser.user}</label>
            {menuVisible && <div className="avatar-menu"></div>}
        </div>
    )
}