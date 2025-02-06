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
            type: 'column'
        },
        title: {
            text: 'Number of occurrences of the ERC panels'
        },
        xAxis: {
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text : '# of submission'
            }
        },
        tooltip: {
            formatter: function() {
                // Hide the x axis label
                return `<b>${this.series.name}</b><br>Number of submission: ${this.y}`;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                cursor: 'pointer',
                dataLabels: {
                    enabled: true
                },
                point:{
                    events: {
                        click: function(){
                            const url = `./search-researchers?erc_panel=${this.series.name}`;
                            window.open(url, '_blank');
                        }
                    },
                },
                boostThreshold: 10,
                boosting: {
                    useGPUTranslations: true,  
                    usePreAllocated: true,    
                },
            }
        },
        series: data
    }
    
    return options
}

function ColumnChart({chart_title, series}){
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${base_url}research-info-surveys/count_submission_by_erc_panel/`)
            const response_data = response.data
            let column_data = []
            for(let i = 0; i<response_data.length; i++){
                let element = false
                if(response_data[i].erc_panel_1 &&  response_data[i].erc_panel_1 != ''){
                    element = {
                        name : response_data[i].erc_panel_1,
                        y : parseInt(response_data[i].num_submission),
                    }
                } else if (response_data[i].erc_panel_2 && response_data[i].erc_panel_2 != ''){
                    element = {
                        name : response_data[i].erc_panel_2,
                        y : parseInt(response_data[i].num_submission),
                    }
                } else if (response_data[i].erc_panel_3 && response_data[i].erc_panel_3 != ''){
                    element = {
                        name : response_data[i].erc_panel_3,
                        y : parseInt(response_data[i].num_submission),
                    }
                }
                if(element)
                    column_data.push(element)
            }
            //Put together the values from the 3 different keywords
            const aggregatedData = column_data.reduce((acc, item) => {
                if (!acc[item.name]) {
                    acc[item.name] = 0;
                }
                acc[item.name] += item.y;
                return acc;
            }, {});

            const seriesData = Object.keys(aggregatedData).map(key => ({
                name: key,
                data: [aggregatedData[key]]
            }));
            
            seriesData.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });            
            
            setData(seriesData)
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
    <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} />
    )
}

export default ColumnChart;