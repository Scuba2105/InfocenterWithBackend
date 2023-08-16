import { LoginInput } from "./LoginInput";
import useMediaQueries from "media-queries-in-react";
import { serverConfig } from "../server";

function submitData(e) {
    e.preventDefault();
    const [emailInput, passwordInput] = e.currentTarget.parentNode.querySelectorAll('input');
    const emailRegex = /^[a-zA-Z0-9]+@health.nsw.gov.au$/;
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    console.log(emailInput.value, passwordInput.value)
    if (emailRegex.test(emailInput.value)) {
        console.log("Email does not match the required email pattern");
    }

    if (passwordRegex.test(passwordInput.value)) {
        console.log("Password does not match required pattern. Please ensure it is at least 8 characters and has at least 1 lowercase letter, 1 uppercase letter and 1 number");
    }
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
                    <h2 className="login-title">Login Form</h2>
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