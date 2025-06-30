import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import { flag } from '../data/accounts/globalAccounts';
import exchangeRates from "./exchangeRates.json"


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = date.getMonth();
    const year = date.getFullYear() % 100; // Get last two digits of the year

    // Add suffix to day
    const suffix = ['th', 'st', 'nd', 'rd'][((day - 20) % 10)] || 'th';
    const formattedDay = day + suffix;

    return `${formattedDay} ${monthNames[monthIndex]}`;
}


const MyChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const [data, setData] = useState([])
    const [xValues, setXValues] = useState([])

    useEffect(()=>{
        setXValues(exchangeRates?.dates?.map(item => formatDate(item))?.slice(170))
        const {USD, GBP, HKD, AUD, SGD} = exchangeRates;
        setData({USD, GBP, HKD, AUD, SGD})

    }, [exchangeRates])


    const [selectedCurrency, setSelectedCurrency] = useState('GBP');

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    useEffect(() => {
        // const xValues = ["1 Apr", "4 Apr", "7 Apr", "10 Apr", "13 Apr", "16 Apr", "19 Apr", "22 Apr", "Today"];
        const yValues = data[selectedCurrency];

        if (chartInstance.current) {
            chartInstance.current.destroy(); // Destroy existing chart instance
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    data: yValues,
                    borderColor: 'black',
                    fill: false,
                    pointRadius: 0,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 6 // Set maximum number of ticks
                        },
                    },
                    y: {
                        grid: {
                            display: false // Remove horizontal grid lines
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Cleanup on component unmount
            }
        };
    }, [selectedCurrency, xValues]);

    return (
        <div className='rounded-5 p-5 d-flex flex-column justify-content-around h-100 bg-light-primary'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h5>Exchange Rate</h5>
                    <h3>1 EUR = {data[selectedCurrency]?.[9]} {selectedCurrency} </h3>
                </div>
                <div className='d-flex align-items-center border border-dark p-3 rounded-pill my-auto'>
                    <img width="24px" height="24px" src={flag[selectedCurrency]} alt={selectedCurrency} className='rounded-circle' />
                    <select className='bg-transparent my-auto border-0 fw-bold pe-4 ps-2' style={{cursor: "pointer"}} onChange={handleCurrencyChange} value={selectedCurrency}>
                        {Object.keys(data).map(currency => (
                            <option className='p-5 h5' key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
            </div>

            <canvas ref={chartRef} style={{ width: '100%', maxWidth: '600px', maxHeight: "160px" }}></canvas>
        </div>
    );
};

export default MyChart;
