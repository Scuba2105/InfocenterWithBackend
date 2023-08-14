import { LoginInput } from "./LoginInput"

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
                    <button className="login-button">Login</button>
                </div>
            </form>
        </div>
    )
}