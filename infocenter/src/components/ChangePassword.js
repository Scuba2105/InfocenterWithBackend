import { ModalSkeleton } from "./ModalSkeleton"
import { Input } from "./Input";
import { useState } from "react";
import { useUser } from "./StateStore";
import { serverConfig } from "../server";

const passwordStrengths = ["Undefined", "Very Bad", "Bad", "Average", "Good", "Very Good"];
const passwordStrengthBar = {"Undefined": [0, "red"], "Very Bad": [67, "rgb(252, 82, 82)"], "Bad": [134, "rgb(252, 82, 82)"], 
                            "Average": [201, "orange"], "Good": [268, "yellow"], "Very Good": [335, "rgb(3, 252, 156)"]};

function checkPasswordStrength(setPasswordStrength, setNewPassword, e) {
    const currentValue = e.currentTarget.value;
    let passwordStrengthCount = 0;
    if (currentValue.length >= 8) {
        passwordStrengthCount++
    }
    if (/[a-z]/.test(currentValue)) {
        passwordStrengthCount++
    }
    if (/[A-Z]/.test(currentValue)) {
        passwordStrengthCount++
    }
    if (/[0-9]/.test(currentValue)) {
        passwordStrengthCount++
    }
    if (/[^a-zA-Z0-9]/.test(currentValue)) {
        passwordStrengthCount++
    }
    
    setPasswordStrength(passwordStrengthCount);
    setNewPassword(currentValue);
}

function enteredCurrentPassword(setCurrentPassword, e) {
    setCurrentPassword(e.currentTarget.value);
}

function checkPasswordsMatch(newPassword, setPasswordMatch, e) {
    const confirmationPassword = e.currentTarget.value;
    if (confirmationPassword !== newPassword) {
        setPasswordMatch(false);
    }
    else {
        setPasswordMatch(true);
    }
}

async function submitNewPassword(staffId, currentPassword, newPassword, passwordStrength, passwordMatch, showMessage, closeDialog, closeModal) {
    if (passwordStrengths[passwordStrength] !== "Very Good") {
        showMessage("warning", "New password is not of sufficient strength. It must be at least 8 characters, and have at least 1 each of a lower case and upper case letter, a number and a special character");
        return
    }
    if (!passwordMatch) {
        showMessage("warning", "The entered passwords do not match. Please make sure the passwords match before submitting.")
        return
    }
    if (currentPassword === newPassword) {
        showMessage("warning", "The new password cannot be the same as your current password");
        return
    }

    // Start uploading new password
    showMessage("uploading", `Storing New Password`); 
    
    const passwordData = JSON.stringify({staffId: staffId, currentPassword: currentPassword, newPassword: newPassword})
    
    // Post the form data to the server. 
    const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/ChangePassword`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        headers: {
            'Content-Type': 'application/json'
            },
        body: passwordData
    })

    // Parse the json response.
    const data = await res.json();
    
    if (data.type === "Error") {
        showMessage("error", data.message);
    }
    else {
        showMessage("info", "Password has been successfully changed");
        setTimeout(() => {
            closeDialog();
            closeModal();
        }, 1600);
    }
}

export function ChangePassword({closeModal, showMessage, closeDialog}) {
    
    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [newPassword, setNewPassword] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(null);
    const strengthBarWidth = passwordStrengthBar[passwordStrengths[passwordStrength]][0];
    const strengthBarColor = passwordStrengthBar[passwordStrengths[passwordStrength]][1];

    return (
        <>
            <ModalSkeleton type="change-password" closeModal={closeModal}>
                <div className="change-password-form">
                    <Input type="password" inputType="password" identifier="change-password" labelText="Current Password" placeholdertext="Enter Current Password" onChange={(e) => enteredCurrentPassword(setCurrentPassword, e)}></Input>  
                    <div className="passwords-input-container">
                        <Input type="password" inputType="password" identifier="change-password" labelText="New Password" placeholdertext="Enter New Password" onChange={(e) => checkPasswordStrength(setPasswordStrength, setNewPassword, e)}></Input>  
                        <Input type="password" inputType="password" identifier="change-password" labelText="Confirm New Password" placeholdertext="Re-Enter New Password" onChange={(e) => checkPasswordsMatch(newPassword, setPasswordMatch, e)}></Input>  
                        {passwordStrength > 0 && <div className="password-strength-container">
                            <label>{`Password Strength: ${passwordStrengths[passwordStrength]}`}</label>
                            <div className="strength-indicator" style={{width: strengthBarWidth + 'px', backgroundColor: strengthBarColor}}></div>
                        </div>}
                        {passwordMatch !== null && <p id="password-match" style={passwordMatch ? {color: 'rgb(3, 252, 156)'} : {color: 'rgb(252, 82, 82)'}}>{passwordMatch === true ? "Passwords Match!" : "Passwords Do Not Match!"}</p>}
                    </div>                                            
                    <button id="submit-password-change" className="update-button" onClick={() => submitNewPassword(currentUser.staffId ,currentPassword, newPassword, passwordStrength, passwordMatch, showMessage, closeDialog, closeModal)}>Submit</button>
                </div>
            </ModalSkeleton>
        </>
        
    )
}