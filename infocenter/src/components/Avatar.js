import { useUser, useLoggedIn, useProfilePhotoUpdate } from "./StateStore";
import { useState, useEffect, useRef } from "react";
import { ViewRequests } from "./ViewRequests";
import { ChangePassword } from "./ChangePassword";
import { RequestsIcon, PadlockIcon, LogoutIcon, BlankProfile } from "../svg";
import { serverConfig } from "../server";

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

function showModal(link, setModalVisible, setMenuVisible) {
    setMenuVisible(false);
    setModalVisible(link);
}

function closeModal(setModalVisible) {
    setModalVisible(null);
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

function handleHover(option, setHovered) {
    setHovered(option)
}

function handleMouseOut(setHovered) {
    setHovered(null)
}

async function getCurrentRequestData(setRequestsData, closeDialog, showMessage, showModal, setModalVisible, setMenuVisible) {
    
    // Show the uploading dialog while communicating with server
    showMessage("uploading", `Retrieving Requests Data...`);

    try {
        // Send the input BME to the backend to fetch the thermometer batch
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/GetRequestsData`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            responseType: "arraybuffer",
            headers: {
                'Content-Type': 'application/json'
                },
        });

        // If error message is sent form server set response based on error status.
        if (res.status === 400) {
            const error = await res.json();
            throw new Error(`${error.message} If the issue persists please contact an admininistrator.`)
        }
        console.log(res)
        // Get the data from the JSON response.
        const data = await res.json();  
        const pendingRequestsData = JSON.parse(data);

        // Close loading dialog.
        closeDialog();

        // Set the data for the component and open form.
        setRequestsData(pendingRequestsData);
        showModal("requests", setModalVisible, setMenuVisible);
    }
    catch (err) {
        showMessage("error", `${err.message}`);
    }
}

export function Avatar({showMessage, closeDialog}) {

    const [hovered, setHovered] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const avatarMenu = useRef(null);
    useOutsideAlerter(avatarMenu, setMenuVisible);
    const currentUser = useUser((state) => state.userCredentials);
    const profilePhotoUpdates = useProfilePhotoUpdate((state) => state.profilePhotoUpdates);
    
    // Create state variable for setting whether password should be visible
    const [modalVisible, setModalVisible] = useState(null);

    // Store the requests data from server in state 
    const [requestsData, setRequestsData] = useState(null);
    
    // Get the logout function from the state store
    const logout = useLoggedIn((state) => state.logout);

    return (
        <>
            <div ref={avatarMenu} className="avatar-container flex-c" onClick={(e) => toggleMenu(setMenuVisible, e)}>
                {currentUser.imageType ? <img key={profilePhotoUpdates * 10} id="avatar-image" src={`https://${serverConfig.host}:${serverConfig.port}/images/staff/${currentUser.staffId}.${currentUser.imageType}`} alt="avatar"></img> : <BlankProfile identifier="avatar-placeholder" size="25px" foregroundColor="#6B7F82" ></BlankProfile>}
                <label>{currentUser.user}</label>
                {menuVisible && 
                <div className="avatar-menu flex-c-col">
                    <label id="permission-label">{currentUser.permissions === "admin" ? "Administrator" : currentUser.permissions[0].toUpperCase() + currentUser.permissions.split("").slice(1).join("")}</label>
                    <div className={hovered === "requests" ? "avatar-option avatar-option-hovered flex-c" : "avatar-option flex-c"} onClick={() => getCurrentRequestData(setRequestsData, closeDialog, showMessage, showModal, setModalVisible, setMenuVisible)} onMouseOver={() => handleHover("requests", setHovered)} onMouseOut={() => handleMouseOut(setHovered)}>
                        <RequestsIcon color={hovered === "requests" ? "#5ef8ed" : "white"} size="25px"></RequestsIcon>
                        <label id="change-password">View Requests</label>
                    </div>
                    <div className={hovered === "password" ? "avatar-option avatar-option-hovered flex-c" : "avatar-option flex-c"} onClick={() => showModal("password", setModalVisible, setMenuVisible)} onMouseOver={() => handleHover("password", setHovered)} onMouseOut={() => handleMouseOut(setHovered)}>
                        <PadlockIcon color={hovered === "password" ? "#5ef8ed" : "white"} size="25px"></PadlockIcon>
                        <label id="change-password">Change Password</label>
                    </div>
                    <div className={hovered === "logout" ? "avatar-option avatar-option-hovered flex-c" : "avatar-option flex-c"} onClick={() => logoutFromApp(logout)} onMouseOver={() => handleHover("logout", setHovered)} onMouseOut={() => handleMouseOut(setHovered)}>
                        <LogoutIcon color={hovered === "logout" ? "#5ef8ed" : "white"} size="25px"></LogoutIcon>
                        <label id="logout-label">Logout</label>
                    </div>
                </div>}
            </div>
            {modalVisible === "password" && <ChangePassword closeModal={() => closeModal(setModalVisible)} showMessage={showMessage} closeDialog={closeDialog}></ChangePassword>}
            {modalVisible === "requests" && <ViewRequests requestsData={requestsData} closeModal={() => closeModal(setModalVisible)} showMessage={showMessage} closeDialog={closeDialog}></ViewRequests>}
        </>
        
    )
}