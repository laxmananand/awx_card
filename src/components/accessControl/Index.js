import React, { useEffect, useState } from 'react'
import SideBar from '../SideBar'
import { useLocation } from 'react-router-dom';
import AccessControl from './AccessControl';
import TeamMembers from './tabs/TeamMembers';
import RolesAndPermissions from './tabs/RolesAndPermissions';


function AccessControlHome() {
    const location = useLocation();
    const [url, setUrl] = useState();

    useEffect(() => {
        const { pathname } = location;
        if (pathname.endsWith('/')) {
          const newPathname = pathname.slice(0, -1);
          setUrl(newPathname);
        } else {
            setUrl(pathname);
        }
      }, [location.pathname]);

    return (
        <div>
            <div className='d-flex'>
                <SideBar />
                <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ height: "100vh" }}>
                    {
                        (url === "/access-control") ? <AccessControl /> : (url === "/access-control/team-members") ? <TeamMembers /> : (url === "/access-control/roles-permissions") ? <RolesAndPermissions /> : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default AccessControlHome