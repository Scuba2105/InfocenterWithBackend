import { StaffIcon, PadlockIcon } from '../svg';

export function LoginInput({input}) {
    return (
        <div className="login-input-container">
            <div className="login-input-icon">
                {input === "name" ? <StaffIcon size="20px" color="#ffffff"></StaffIcon> : <PadlockIcon color="#ffffff" size="20px"></PadlockIcon>}
            </div>
            <input className="login-input" type="text" placeholder={input === "name" ? "Full Name/Username" : "Password"}></input>
        </div>
    )
}