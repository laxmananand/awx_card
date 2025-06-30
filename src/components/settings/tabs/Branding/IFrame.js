import React, { useEffect, useRef } from 'react';

const ZoomedIframe = ({ colour, logo, font }) => {

    const iframeRef = useRef(null);

    const updateImageInIframe = (logo) => {
        const iframeDocument = iframeRef.current.contentDocument;

        if (iframeDocument) {
            const imageElement = iframeDocument.getElementById('logo');

            if (imageElement) {
                imageElement.src = logo;
            }
        }
    };

    useEffect(() => {
        if (logo)
            updateImageInIframe(logo);
    }, [logo])


    const changeIframeFont = (font) => {
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;

            if (iframeDocument) {
                const rootStyles = iframeDocument.documentElement?.style;
                if (font)
                    rootStyles?.setProperty('--font', font); // Modify the value of a CSS variable
            }
        }
    };


    // Function to modify CSS variables in the iframe
    const changeIframeStyles = (colour) => {
        if (iframeRef.current) {
            const iframeDocument = iframeRef.current.contentDocument;

            if (iframeDocument) {
                const rootStyles = iframeDocument.documentElement?.style;
                if (colour?.main)
                    rootStyles?.setProperty('--main-color', colour?.main); // Modify the value of a CSS variable
                if (colour?.primary)
                    rootStyles?.setProperty('--primary-color-100', colour?.primary); // Modify the value of a CSS variable
                if (colour?.primaryB)
                    rootStyles?.setProperty('--primary-color-10', colour?.primaryB); // Modify the value of a CSS variable
                if (colour?.secondary)
                    rootStyles?.setProperty('--secondary-color-100', colour?.secondary); // Modify the value of a CSS variable
                if (colour?.secondaryB)
                    rootStyles?.setProperty('--secondary-color-10', colour?.secondaryB); // Modify the value of a CSS variable
                if (colour?.tertiary)
                    rootStyles?.setProperty('--tertiary-color-100', colour?.tertiary); // Modify the value of a CSS variable
                if (colour?.tertiaryB)
                    rootStyles?.setProperty('--tertiary-color-10', colour?.tertiaryB); // Modify the value of a CSS variable
                if (colour?.color0)
                    rootStyles?.setProperty('--color-0', colour?.color0); // Modify the value of a CSS variable
                if (colour?.color25)
                    rootStyles?.setProperty('--color-25', colour?.color25); // Modify the value of a CSS variable
                if (colour?.color50)
                    rootStyles?.setProperty('--color-50', colour?.color50); // Modify the value of a CSS variable
                if (colour?.color75)
                    rootStyles?.setProperty('--color-75', colour?.color75); // Modify the value of a CSS variable
                if (colour?.color100)
                    rootStyles?.setProperty('--color-100', colour?.color100); // Modify the value of a CSS variable
                rootStyles?.setProperty('--primary', colour?.brand); // Modify the value of a CSS variable
                rootStyles?.setProperty('--primary-s', colour?.brand_S); // Modify the value of a CSS variable
                rootStyles?.setProperty('--primary-l', colour?.brand_L); // Modify the value of a CSS variable
                if (colour?.button)
                    rootStyles?.setProperty('--button', colour?.button);
            }
        }
    };

    useEffect(() => {
        changeIframeStyles(colour);
    }, [colour])

    useEffect(() => {
        changeIframeFont(font);
    }, [font])


    return (
        <div className='w-100 pe-3' style={{ height: "70vh" }}>
            {/* <button onClick={updateImageInIframe}>
                Update Image in Iframe
            </button> */}

            <iframe
                id='frame'
                ref={iframeRef}
                src={"/dashboard"}
                title="Zoomed Iframe"
                className='w-100 h-100 border rounded-5 shadow'
            />
        </div>
    );
};

export default ZoomedIframe;
