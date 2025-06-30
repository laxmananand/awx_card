import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';

const Session = () => {
    const location = useLocation();
    
    useEffect(() => {
        // Function to extract the code from the URL
        const getCodeFromURL = () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');
            console.log('Authorization Code:', code);
            if (code) {
                localStorage.setItem('authorizationCode', code);
                window.close()
                console.log('Authorization Code stored in local storage.');
            } else {
                window.close();
                console.error('Authorization Code not found in the URL.');
            }  
                   
        };
        getCodeFromURL();
    }, [location]);

    return (
        <>
            Processing
        </>
    );
};

export default Session;
