import { PersonIcon, PadlockIcon } from '../svg';

export function LoginInput({input}) {
    return (
        <div className="login-input-container">
            <div className="login-input-icon">
                {input === "name" ? <PersonIcon size="25px" color="#ffffff"></PersonIcon> : <PadlockIcon color="#ffffff" size="25px"></PadlockIcon>}
            </div>
            {input === "name" ? <input className="login-input" name="email" type="email" placeholder="Email Address" required></input> :
            <input className="login-input" name="password" type="text" placeholder="Password" maxLength="15" required></input>}
        </div>
    )
}