import { ModalSkeleton } from "./ModalSkeleton"
import { Input } from "./Input";
import { useState } from "react";

const passwordStrengths = ["Undefined", "Very Bad", "Bad", "Average", "Good", "Very Good"];
const passwordStrengthBar = {"Undefined": [0, "red"], "Very Bad": [67, "red"], "Bad": [134, "red"], 
                            "Average": [201, "orange"], "Good": [268, "yellow"], "Very Good": [335, "green"]};

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

function checkPasswordsMatch(newPassword, setPasswordMatch, e) {
    const confirmationPassword = e.currentTarget.value;
    if (confirmationPassword !== newPassword) {
        setPasswordMatch(false);
    }
    else {
        setPasswordMatch(true);
    }
}

export function ChangePassword({closeModal}) {
    
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [newPassword, setNewPassword] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(null);
    
    const strengthBarWidth = passwordStrengthBar[passwordStrengths[passwordStrength]][0];
    const strengthBarColor = passwordStrengthBar[passwordStrengths[passwordStrength]][1];
    console.log(passwordMatch)
    return (
        <ModalSkeleton type="change-password" closeModal={closeModal}>
            <div className="change-password-form">
                <Input type="password" inputType="password" identifier="change-password" labelText="Current Password" placeholdertext="Enter Current Password"></Input>  
                <div className="passwords-input-container">
                    <Input type="password" inputType="password" identifier="change-password" labelText="New Password" placeholdertext="Enter New Password" onChange={(e) => checkPasswordStrength(setPasswordStrength, setNewPassword, e)}></Input>  
                    <Input type="password" inputType="password" identifier="change-password" labelText="Confirm New Password" placeholdertext="Re-Enter New Password" onChange={(e) => checkPasswordsMatch(newPassword, setPasswordMatch, e)}></Input>  
                    {passwordStrength > 0 && <div className="password-strength-container">
                        <label>{`Password Strength: ${passwordStrengths[passwordStrength]}`}</label>
                        <div className="strength-indicator" style={{width: strengthBarWidth + 'px', backgroundColor: strengthBarColor}}></div>
                    </div>}
                    {passwordMatch !== null && <p id="password-match" style={passwordMatch ? {color: 'green'} : {color: 'red'}}>{passwordMatch === true ? "Passwords Match!" : "Passwords Do Not Match!"}</p>}
                </div>                                            
                <button id="submit-password-change" className="update-button">Submit</button>
            </div>
        </ModalSkeleton>
    )
}