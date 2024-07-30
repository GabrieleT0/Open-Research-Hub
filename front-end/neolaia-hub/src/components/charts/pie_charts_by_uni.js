import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { base_url } from '../../api';

function create_options(chart_title,data){
    const options = {
        chart : {
            type: 'pie'
        },
        title: {
            text: chart_title
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} '
                }
            }
        },
        series: [
            {
                name: 'Number of submission',
                colorByPoint: true,
                data: data
            }
        ]
    }
    
    return options
}

function PieChart({chart_title, series}){
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${base_url}research-info-surveys/count_submission_by_uni/`)
            const response_data = response.data
            let pie_chart_data = []
            for(let i = 0; i<response_data.length; i++){
                const element = {
                    name : response_data[i].university_name,
                    y : parseInt(response_data[i].num_submission),
                }
                pie_chart_data.push(element)
            }
            setData(pie_chart_data)
            setLoading(false)
        } catch (error){
            setError(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
        const intervalId = setInterval(() => {
            fetchData()
        }, 120000) //every 120 seconds
    }, []);


    return (
        <div style={{ height: '480px' }}>
            <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} />
        </div>
    )
}

export default PieChart;