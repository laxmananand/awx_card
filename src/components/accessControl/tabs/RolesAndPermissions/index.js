import React from 'react'
import BreadCrumbs from '../../../structure/BreadCrumbs'
import { FaBuildingUser } from "react-icons/fa6"
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx"
import { FaUserSecret, FaUserTie } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

function RolesAndPermissions() {

    const navigate = useNavigate()

    const rolesData = [
        {
            id: 1,
            name: "Admin",
            totalUsers: 1,
            icon: <FaUserSecret />,
            color: "green100"
        },
        {
            id: 2,
            name: "Finance",
            totalUsers: 5,
            icon: <FaBuildingUser />,
            color: "yellow100"
        },
        {
            id: 3,
            name: "Employee",
            totalUsers: 5,
            icon: <FaUserTie />,
            color: "blue100"
        }
    ]

    const permissionsData = [
        { id: 1, title: "Manage user access", admin: true, finance: false, employee: false },
        { id: 2, title: "Clear budgets", admin: true, finance: false, employee: false },
        { id: 3, title: "Manage accounting", admin: true, finance: true, employee: false },
        { id: 4, title: "Manage a budget", admin: true, finance: true, employee: true },
        { id: 5, title: "Spend money", admin: true, finance: true, employee: true },
        { id: 6, title: "View all financials", admin: true, finance: true, employee: false }
    ]

    return (
        <div>
            <BreadCrumbs data={{ name: "Roles and Permissions", img: "/arrows/arrowLeft.svg", backurl: "/access-control", info: true }} />
            <div className='d-flex flex-column bg-light'>
                <div className='m-3 bg-white border p-4 d-flex rounded-3 flex-fill'>
                    {
                        rolesData?.map((data) => (
                            <div key={data?.id} className='border w-100 m-3 p-4 rounded-4 blueHover' role='button' onClick={() => navigate("/access-control/team-members?userType=" + data?.name)}>
                                <h4><span className={data?.color}>{data?.icon}</span> {data?.name}</h4>
                                <p className='text-end'>Total Users: {data?.totalUsers}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='m-3 bg-white border p-4 d-flex rounded-3 flex-column'>
                    <div className='row mb-2'>
                        <h4 className='m-0 col-3'><u>Permissions</u></h4>
                        <div className='d-flex col-9 align-items-center justify-content-around'>
                            <p className='text-center h4'><u>Admin</u></p>
                            <p className='text-center h4'><u>Finance</u></p>
                            <p className='text-center h4'><u>Employee</u></p>
                        </div>
                    </div>
                    {
                        permissionsData?.map((data) => (
                            <div key={data?.id} className='row p-2 border rounded-4 my-2 blueHover' role='button'>
                                <h5 className='m-0 col-3'>{data?.title}</h5>
                                <div className='d-flex col-9 align-items-center justify-content-around'>
                                    {data?.admin ? <RxCheckCircled className='text-success fs-4' /> : <RxCrossCircled className='text-danger fs-4' />}
                                    {data?.finance ? <RxCheckCircled className='text-success fs-4' /> : <RxCrossCircled className='text-danger fs-4' />}
                                    {data?.employee ? <RxCheckCircled className='text-success fs-4' /> : <RxCrossCircled className='text-danger fs-4' />}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default RolesAndPermissions