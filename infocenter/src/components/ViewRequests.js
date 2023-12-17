import { ModalSkeleton } from "./ModalSkeleton"

export function ViewRequests({requestsData, closeModal, showMessage, closeDialog}) {
    
    return (
        <>
            <ModalSkeleton type="view-requests" closeModal={closeModal}>
                <div className="modal-display">
                    View Requests Display
                </div>
            </ModalSkeleton>
        </>
        
    )
}