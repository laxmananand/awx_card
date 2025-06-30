import React from 'react'

function RFIModal() {
    return (
        <>
            {/* Button trigger modal */}
            <button
                type="button"
                className="btn btn-outline-info"
                data-bs-toggle="modal"
                data-bs-target="#rfiModalActionRequiredModal"
            >
                Action Required
            </button>
            {/* Modal */}
            <div
                className="modal fade"
                id="rfiModalActionRequiredModal"
                tabIndex={-1}
                aria-labelledby="rfiModalActionRequiredModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="rfiModalActionRequiredModalLabel">
                                Action Required
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <label for="file" className='h5'>Bank Passbook Needed for verification and further processing.</label>
                            <input name="file" type="file" className='my-4' multiple></input>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>{alert("Submitted")}}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default RFIModal