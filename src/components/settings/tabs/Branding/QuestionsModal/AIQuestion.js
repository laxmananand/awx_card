import React, { useEffect, useState } from 'react'

function AIQuestion({setAnswers, setIsGenerated}) {

    const [isLight, setIsLight] = useState(true);
    const [colors, setColors] = useState([]);


    useEffect(() => {
        setAnswers({isLight, colors})
    }, [isLight, colors])

    return (
        <>
            <div
                className="modal fade"
                id="AIQuestion"
                aria-hidden="true"
                aria-labelledby="AIQuestionLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="AIQuestionLabel">
                                Answer Few Question for better theme
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />

                        </div>
                        <div className="modal-body">
                            Do you like light theme or dark theme?



                        </div>
                        <div className="modal-footer">
                            <div className='d-flex flex-fill'>
                                <button className='btn m-0 p-0 d-flex align-items-center btn-action py-2 w-100 mx-2 fw-500' data-bs-target="#AIQuestion2"
                                    data-bs-toggle="modal"
                                    data-bs-dismiss="modal"
                                    onClick={() => setIsLight(true)}
                                >Light</button>
                                <button className='btn m-0 p-0 d-flex align-items-center btn-dark py-2 w-100 mx-2 fw-500' data-bs-target="#AIQuestion2"
                                    data-bs-toggle="modal"
                                    data-bs-dismiss="modal"
                                    onClick={() => setIsLight(false)}
                                >Dark</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="AIQuestion2"
                aria-hidden="true"
                aria-labelledby="AIQuestionLabel2"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="AIQuestionLabel2">
                                Answer Few Question for better theme
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            Choose the desired colors

                            <div className='d-flex'>
                                <div role='button' style={{width: "50px", height:"50px"}} onClick={()=>setColors({...colors, black: !colors?.black})} className={'m-2 mx-auto border p-3 text-center text-white bg-dark border-3 rounded-circle ' + ((colors?.black || colors?.any) ? "border-danger shadow" : "")}></div>
                                <div role='button' style={{width: "50px", height:"50px"}} onClick={()=>setColors({...colors, blue: !colors?.blue})} className={'m-2 mx-auto border p-3 text-center text-white bg-primary border-3 rounded-circle ' + ((colors?.blue || colors?.any) ? "border-danger shadow" : "")}></div>
                                <div role='button' style={{width: "50px", height:"50px"}} onClick={()=>setColors({...colors, green: !colors?.green})} className={'m-2 mx-auto border p-3 text-center text-white bg-success border-3 rounded-circle ' + ((colors?.green || colors?.any) ? "border-danger shadow" : "")}></div>
                                <div role='button' style={{width: "50px", height:"50px", background: "#964B00"}} onClick={()=>setColors({...colors, brown: !colors?.brown})} className={'m-2 mx-auto border p-3 text-center text-white border-3 rounded-circle ' + ((colors?.brown || colors?.any) ? "border-danger shadow" : "")}></div>
                                <div role='button' style={{width: "50px", height:"50px", background:'linear-gradient(to right,#ff0000 0%,#ff7f00 10%,#ffff00 20%,#7fff00 30%,#00ff00 40%,#00ff7f 50%,#00ffff 60%,#007fff 70%,#0000ff 80%,#7f00ff 90%,#ff00ff 100%)'}} onClick={()=>setColors({...colors, any: !colors?.any})} className={'m-2 mx-auto border p-3 text-center text-white bg-info border-3 rounded-circle ' + ((colors?.any) ? "border-danger shadow" : "")}></div>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <div className='d-flex flex-fill'>
                                <button
                                    className='btn m-0 p-0 d-flex align-items-center btn-dark py-2 w-100 mx-2 fw-500'
                                    data-bs-target="#AIQuestion"
                                    data-bs-toggle="modal"
                                    data-bs-dismiss="modal"
                                >
                                    Back to first
                                </button>
                                <button
                                    className='btn m-0 p-0 d-flex align-items-center btn-action py-2 w-100 mx-2 fw-500'
                                    type="button"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={()=>setIsGenerated(true)}
                                >
                                    Submit
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <a
                className='btn btn-action fw-500 ms-auto mt-3 w-100'
                data-bs-toggle="modal"
                href="#AIQuestion"
                role="button"
            >
                Generate
            </a>
        </>

    )
}

export default AIQuestion