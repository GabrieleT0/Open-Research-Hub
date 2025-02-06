import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { base_url } from '../../api';
import { Spinner, Alert } from 'react-bootstrap';
import Boost from 'highcharts/modules/boost';

Boost(Highcharts);

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
            },
            series: {
                cursor: 'pointer',
                point:{
                    events: {
                        click: function(){
                            const url = `./search-researchers?university_name=${this.name}`;
                            window.open(url, '_blank');
                        }
                    },
                },
                boostThreshold: 5,
                boosting: {
                useGPUTranslations: true,  
                usePreAllocated: true,    
                },
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
    const colors = ["#00B3E4", "#E83181", "#F39207", "#B94B96", "#BC9AC8", "#FDC200", "#4BB276", "#99C44A","#F5E723","#C3BA20"];
    const fetchData = async () => {
        try {
            const response = await axios.get(`${base_url}research-info-surveys/count_submission_by_uni/`)
            const response_data = response.data
            let pie_chart_data = []
            for(let i = 0; i<response_data.length; i++){
                const element = {
                    name : response_data[i].university_name,
                    y : parseInt(response_data[i].num_submission),
                    color: colors[i]
                }
                pie_chart_data.push(element)
            }
            pie_chart_data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            setData(pie_chart_data)
            setLoading(false)
        } catch (error){
            setError(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
         fetchData()
    //     const intervalId = setInterval(() => {
    //         fetchData()
    //     }, 120000) //every 120 seconds
     }, []);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status" />
                <span> Loading chart ...</span>
            </div>
        );
    }

    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <div style={{ height: '480px' }}>
            <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} />
        </div>
    )
}

export default PieChart;