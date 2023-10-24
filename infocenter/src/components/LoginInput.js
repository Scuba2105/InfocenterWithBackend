import { PersonIcon, PadlockIcon } from '../svg';

export function LoginInput({input}) {
    return (
        <div className="login-input-container flex-c">
            <div className="login-input-icon flex-c">
                {input === "name" ? <PersonIcon size="25px" color="#1a1f28"></PersonIcon> : <PadlockIcon color="#1a1f28" size="25px"></PadlockIcon>}
            </div>
            {input === "name" ? <input className="login-input" name="email" type="email" placeholder="Email Address or Staff ID" required></input> :
            <input className="login-input" name="password" type="password" placeholder="Password" maxLength="25" required></input>}
        </div>
    )
}