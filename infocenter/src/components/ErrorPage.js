export function ErrorPage({errorType}) {

    return (
        <div className="error-container">
            {errorType === "fetch-error" && <div className="error-description">
                <h1 className="error-heading">Error 503</h1>
                <p className="error-message1">Service currently unavailable.</p>
                <p className="error-message2">Please try again later.</p>
            </div>}
            {errorType === "render-error" && <div className="error-description">
                <h1 className="error-heading">Oops....</h1>
                <p className="error-heading error-subheading">Something went wrong.</p>
                <p className="error-message2">Please refresh the page. If the problem persists contact an administrator.</p>
            </div>}
        </div>
    )
}