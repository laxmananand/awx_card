
import React, { useState } from 'react';
import SideBar from '../SideBar'
import BreadCrumbs from '../structure/BreadCrumbs'


function EachNotification({ item, idx }) {
    const [data, setData] = useState(item);

    return <div className='d-flex justify-content-between w-75 p-1 w-100 m-3 blueHover p-3 form-check form-switch' >
        <div className='d-flex align-items-center flex-fill' role='button' onClick={() => setData({ ...data, checked: !data?.checked })}>
            <img className='bg-grey p-2 rounded-4' src={data?.img} alt="Notification Icon" />
            <div className='flex-fill ms-3'>
                <p className='m-0 grey1 fw-normal'>
                    {data?.title}
                </p>
                <h5 className='m-0'>{data?.subtitle}</h5>
            </div>
        </div>

        <input
            type="checkbox"
            checked={data?.checked}
            onClick={() => setData({ ...data, checked: !data?.checked })}
            className='form-check-input'
            role='button'
        />
    </div>
}



function Notification() {
    // const [notificationStates, setNotificationStates] = useState({
    //     transfers: false,
    //     interviews: false,
    //     campaigns: false,
    //     four: false,
    //     five: false,
    //     six: false,
    //     seven: false,
    //     eight: false
    // });

    const notificationStatus = [{
        title: "Your transfers and balance 1",
        subtitle: "Transfer status notification.",
        checked: true,
        img: "/notification/zigzag.svg"
    },
    {
        title: "Interviews, reviews, and surveys",
        subtitle: "Invitations to test new functions and leave feedback",
        checked: false,
        img: "/notification/zigzag.svg"
    },
    {
        title: "Our campaigns",
        subtitle: "Topics that are important to us. You can take part!",
        checked: true,
        img: "/notification/zigzag.svg"
    },
    {
        title: "Your transfers and balance 1",
        subtitle: "Transfer status notification.",
        checked: false,
        img: "/notification/zigzag.svg"

    },
    {
        title: "Your transfers and balance 1",
        subtitle: "Transfer status notification.",
        checked: true,
        img: "/notification/zigzag.svg"

    },
    {
        title: "Your transfers and balance 1",
        subtitle: "Transfer status notification.",
        checked: false,
        img: "/notification/zigzag.svg"

    },
    {
        title: "Your transfers and balance 1",
        subtitle: "Transfer status notification.",
        checked: true,
        img: "/notification/zigzag.svg"

    }


    ]
    // Function to toggle the state of a specific checkbox
    // const toggleNotification = (key) => {
    //     setNotificationStates((prevState) => ({
    //         ...prevState,
    //         [key]: !prevState[key],
    //     }));
    // };
    return (
        <div className='d-flex'>
            <SideBar />

            <div className="container-fluid px-0 bg-white clear-left overflow-auto " style={{ height: "100vh" }}>

                <BreadCrumbs data={{ name: "Notification", img: "/arrows/arrowLeft.svg", backurl: "/", info: true }} />
                <div className='m-4 w-75 mx-auto'>
                    <div className='ms-4 mt-2'>
                        <img src="/notification/notificationbell.svg" className='bg-green10 p-3 rounded-3  d-flex  justify-content-end  p-1' alt="" />
                        <h5 className='d-flex justify-content-between'>Notification settings</h5>
                    </div>

                    <div className='d-flex flex-column w-100'>

                        {
                            notificationStatus.map((item, key) => (
                                <EachNotification item={item} key={key} idx={key} />
                            ))
                        }

                    </div>

                </div>


            </div>



        </div>

    )
}

export default Notification
