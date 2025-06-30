import React, { useState } from 'react'

function Layout({ children }) {
    const [width, setWidth] = useState(100)
    const [height, setHeight] = useState(100)

    const maximise = () => {
        setWidth(400)
        setHeight(600)
    }

    const minimize = () => {
        setWidth(100)
        setHeight(100)
    }

    return (
        <div className='position-relative'>
            <div>
                {children}
            </div>
            {/* <div className='position-absolute bottom-0 end-0' onMouseEnter={maximise} onMouseLeave={minimize}>
                <iframe src="https://zoqq-bot.vercel.app/chat" width={width} height={height} className='mx-5 my-3 border rounded-4' />
            </div> */}
        </div>
    )
}

export default Layout