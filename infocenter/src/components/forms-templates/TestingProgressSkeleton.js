import { serverConfig } from "../../server"

export function TestingProgressSkeleton({children, closeModal}) {
    return (
        <div className="testing-progress-modal-container">
            <div className="modal-title-bar flex-c">
                <div id="title-aligner"></div>     
                <h2 className="model-title">{`Testing Progress`}</h2> 
                <img className="cross" src={`https://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
            </div>
            {children}
        </div> 
    )
}