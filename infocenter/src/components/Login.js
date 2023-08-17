import { LoginInput } from "./LoginInput";
import useMediaQueries from "media-queries-in-react";
import { serverConfig } from "../server";

async function submitData(e) {
    e.preventDefault();
    const [emailInput, passwordInput] = e.currentTarget.parentNode.querySelectorAll('input');
    const emailRegex = /^[A-Za-z0-9]+\.[A-Za-z0-9]+(@health.nsw.gov.au)$/;
    const invalidPasswordRegex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/
    
    // Check if email address valid
    if (!emailRegex.test(emailInput.value)) {
        console.log("Email does not match the required email pattern");
        return
    }

    // Check if password valid
    if (invalidPasswordRegex.test(passwordInput.value)) {
        console.log("Password does not match required pattern. Please ensure it is at least 8 characters and has at least 1 lowercase letter, 1 uppercase letter and 1 number and 1 special character");
        return
    }

    // Create login credentials object
    const loginCredentials = {email: emailInput.value, password: passwordInput.value}
    
    // Post the form data to the server. 
    const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/VerifyLogin`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(loginCredentials)
    })

//const data = await res.json();
}

export function Login() {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className="wrapper login-container">
            <form className={mediaQueries.laptop ? "login-form-laptop": "login-form-desktop"}>
                <div className="login-header">
                    <img className="app-logo" src={`http://${serverConfig.host}:${serverConfig.port}/images/app-logo.png`} alt="app-logo"></img>
                </div>
                <div className="login-body">
                    <div className="inputs-container">
                        <LoginInput input="name"></LoginInput>
                        <LoginInput input="password"></LoginInput>
                    </div>                    
                    <label>Forgot Password?</label>
                    <button className="login-button" onClick={submitData}>Login</button>
                </div>
            </form>
        </div>
    )
}