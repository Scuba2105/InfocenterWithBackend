import { useUser, useLoggedIn } from "./StateStore";
import { useState, useEffect, useRef } from "react";
import useMediaQueries from "media-queries-in-react";
import { ChangePassword } from "./ChangePassword";
import { PadlockIcon, LogoutIcon, BlankProfile } from "../svg";

function logoutFromApp(logout) {
    sessionStorage.removeItem("currentInfoCentreSession");
    logout();
}

function toggleMenu(setMenuVisible, e) {
    const profilePhoto = e.currentTarget.children[0];
    const label = e.currentTarget.children[1];
    if (profilePhoto.contains(e.target) || label.contains(e.target)) {
        setMenuVisible(m => !m);
    }
}

function showModal(setChangePasswordVisible, setMenuVisible) {
    setMenuVisible(false);
    setChangePasswordVisible(true);
}

function closePasswordModal(setChangePasswordVisible) {
    setChangePasswordVisible(false);
}

function useOutsideAlerter(ref, setMenuVisible) {
    useEffect(() => {
      
      // Close avatar menu if clicked on outside of element
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setMenuVisible(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, setMenuVisible]);
  }

export function Avatar({showMessage, closeDialog}) {

    const [menuVisible, setMenuVisible] = useState(false);
    const avatarMenu = useRef(null);
    useOutsideAlerter(avatarMenu, setMenuVisible);
    const currentUser = useUser((state) => state.userCredentials);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    
    // Get the logout function from the state store
    const logout = useLoggedIn((state) => state.logout);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <>
            <div ref={avatarMenu} className="avatar-container" onClick={(e) => toggleMenu(setMenuVisible, e)}>
                <BlankProfile identifier="avatar-image" size="25px" foregroundColor="#6B7F82" ></BlankProfile>
                <label>{currentUser.user}</label>
                {menuVisible && <div className={mediaQueries.laptop ? "avatar-menu-laptop" : "avatar-menu avatar-menu-desktop"}>
                    <label id="permission-label">{currentUser.permissions === "admin" ? "Administrator" : currentUser.permissions[0].toUpperCase() + currentUser.permissions.split("").slice(1).join("")}</label>
                    <div className="avatar-option" onClick={() => showModal(setChangePasswordVisible, setMenuVisible)}>
                        <PadlockIcon color="white" size="25px"></PadlockIcon>
                        <label id="change-password">Change Password</label>
                    </div>
                    <div className="avatar-option" onClick={() => logoutFromApp(logout)}>
                        <LogoutIcon color="white" size="25px"></LogoutIcon>
                        <label id="logout-label">Logout</label>
                    </div>
                </div>}
            </div>
            {changePasswordVisible && <ChangePassword closeModal={() => closePasswordModal(setChangePasswordVisible)} showMessage={showMessage} closeDialog={closeDialog}></ChangePassword>}
        </>
        
    )
}