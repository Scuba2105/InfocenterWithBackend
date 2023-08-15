import { LoginInput } from "./LoginInput"

function submitData(e) {
    e.preventDefault();
    const [emailInput, passwordInput] = e.currentTarget.parentNode.querySelectorAll('input');
    console.log(emailInput.value, passwordInput.value);
}

export function Login() {

    return (
        <div className="wrapper login-container">
            <form className="login-form">
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