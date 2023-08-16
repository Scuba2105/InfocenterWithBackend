import { StaffIcon, PadlockIcon } from '../svg';

export function LoginInput({input}) {
    return (
        <div className="login-input-container">
            <div className="login-input-icon">
                {input === "name" ? <StaffIcon size="20px" color="#ffffff"></StaffIcon> : <PadlockIcon color="#ffffff" size="20px"></PadlockIcon>}
            </div>
            {input === "name" ? <input className="login-input" name="email" type="email" placeholder="Email Address" required></input> :
            <input className="login-input" name="password" type="text" placeholder="Password" maxLength="15" required></input>}
        </div>
    )
}