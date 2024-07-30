import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { base_url } from '../../api';
require('highcharts/modules/treemap.js')(Highcharts);

function create_options(chart_title,data){
    const options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat:
            '<{headingTagName}>{chartTitle}</{headingTagName}><div>' +
            '{typeDescription}</div><div>{chartSubtitle}</div><div>' +
            '{chartLongdesc}</div>'
            },
        },
        series: [
            {
                name : 'Universities',
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                dataLabels: {
                    enabled: false
                },
                levels: [
                    {
                        level: 1,
                        dataLabels: {
                            enabled: true,
                            style: {
                                textOutline: false
                            }
                        },
                        borderWidth: 3
                    }
                ],
                data: data,
            }
        ],
        title: {
            text: 'Number of submissions by faculty'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}</b>: <b>{point.value}</b>'
        }
    }
    
    return options
}

function TreeMap({chart_title, series}){
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const colors = ["#FF5733", "#FFA500", "#FFFF33", "#33FF57", "#33CFFF", "#3357FF", "#8A33FF", "#FF33B5", "#B3B3B3"];
            const response = await axios.get(`${base_url}research-info-surveys/count_submission_by_uni/`)
            const response2 = await axios.get(`${base_url}research-info-surveys/count_by_departmens/`)
            const response3 = await axios.get(`${base_url}research-info-surveys/count_by_faculties/`)
            const response_data = response.data
            const response_data2 = response2.data
            const response_data3 = response3.data
            let by_uni = []
            for(let i = 0; i<response_data.length; i++){
                const element = {
                    id: response_data[i].university_name,
                    name : response_data[i].university_name,
                    value : parseInt(response_data[i].num_submission),
                    color: colors[i]
                }
                by_uni.push(element)
            }
            for(let i = 0; i<response_data2.length; i++){
                const element = {
                    id: response_data2[i].department,
                    name : response_data2[i].department,
                    value : parseInt(response_data2[i].occurrences),
                    parent : response_data2[i].university_name
                }
                by_uni.push(element)
            }
            for(let i = 0; i<response_data3.length; i++){
                if (response_data3[i].faculty != ''){
                    const faculty = response_data3[i].faculty.split('_')[0]
                    const element = {
                        id: faculty,
                        name : faculty,
                        value : parseInt(response_data3[i].occurrences),
                        parent : response_data3[i].department
                    }
                    by_uni.push(element)
                }
            }
            setData(by_uni)
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
    <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} />
    )
}

export default TreeMap;