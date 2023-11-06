import { LoginInput } from "./LoginInput";
import { useEffect, useState, useRef } from "react";
import { serverConfig } from "../server";
import { useLoggedIn, useUser } from "./StateStore";

function startLogin(setLoggingIn, e) {
    e.preventDefault();
    setLoggingIn(true);
}

export function Login() {

    // Define state variables and refs
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState(null);
    const [loggingIn, setLoggingIn] = useState(false);
    const loginForm = useRef(null);
    
    // Get login function and setUser functions from Zustand state store
    const login = useLoggedIn((state) => state.login)
    const setUser = useUser((state) => state.setUser)

    useEffect(() => {
        document.title = 'HNECT Information Centre'
        const sessionData = sessionStorage.getItem("currentInfoCentreSession");
        if (sessionData) {
            const currentSession = JSON.parse(sessionData);
            setUser(currentSession.name, currentSession.staffId, currentSession.permissions, currentSession.imageType);
            login();
        }
    }, [])

    useEffect(() => {
        async function submitData(setLoginError, setLoginErrorMessage, login, setUser) {
            const [emailInput, passwordInput] = loginForm.current.querySelectorAll('input');
            const emailRegex = /^[A-Za-z0-9]+\.[A-Za-z0-9]+(@health.nsw.gov.au)$|[0-9]+/;
            const invalidPasswordRegex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/
            
            // Check if email address valid
            if (!emailRegex.test(emailInput.value)) {
                setLoginErrorMessage("Email does not match the required email pattern");
                setLoginError(true);
                setLoggingIn(false);
                return
            }
        
            // Check if password valid
            if (invalidPasswordRegex.test(passwordInput.value)) {
                setLoginErrorMessage("Password does not match required pattern. Please ensure it is at least 8 characters and has at least 1 lowercase letter, 1 uppercase letter and 1 number and 1 special character");
                setLoginError(true);
                setLoggingIn(false);
                return
            }
            
            // Create login credentials object
            const loginCredentials = {email: emailInput.value, password: passwordInput.value}
            console.log(loginCredentials);
            // Post the form data to the server. 
            const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/VerifyLogin`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify(loginCredentials)
            })
        
            const data = await res.json();
            
            if (data.type === "Error") {
                setLoginError(true);
                setLoginErrorMessage(data.message);
                setLoggingIn(false);
            }
            else {
                // Write data to session storage for page reloads
                sessionStorage.setItem("currentInfoCentreSession", JSON.stringify({name: data.credentials.name, staffId: data.credentials.staffId, permissions: data.credentials.accessPermissions, imageType: data.credentials.imageType}));
                setUser(data.credentials.name, data.credentials.staffId, data.credentials.accessPermissions, data.credentials.imageType);
                login();
            }
        }
        if (loggingIn) {
            submitData(setLoginError, setLoginErrorMessage, login, setUser);
        }

    }, [loggingIn, login, setUser])

    return (
        <div className="wrapper login-container">
            <form ref={loginForm} className="login-form">
                <div className="login-header flex-c">
                    <img className="app-logo" src={`https://${serverConfig.host}:${serverConfig.port}/images/new-app-logo.png`} alt="app-logo"></img>
                </div>
                <div className="login-body flex-c-col">
                    <div className="inputs-container flex-c-col">
                        <LoginInput input="name"></LoginInput>
                        <LoginInput input="password"></LoginInput>
                    </div> 
                    <p style={loginError ? {opacity: 1} : {opacity: 0}}>{loginErrorMessage}</p>
                    <label>Forgot Password?</label>
                    <button className="login-button" onClick={(e) => startLogin(setLoggingIn, e)}>{loggingIn ? "Logging In..." : "Login"}</button>
                </div>
            </form>
        </div>
    )
}