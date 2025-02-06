import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { base_url } from '../../api';
import { Spinner, Alert } from 'react-bootstrap';
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
                alternateStartingDirection: true,
                allowTraversingTree: true,
                levelIsConstant: false,
                dataLabels: {
                    enabled: false
                },
                levels: [
                    {
                        level: 1,
                        layoutAlgorithm: 'sliceAndDice',
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '14px',
                                color: 'black',
                                fontWeight: 'bold'
                            }
                        },
                        borderWidth: 3
                    },
                    {
                        level: 2,
                        layoutAlgorithm: 'sliceAndDice',
                        dataLabels: {
                            enabled: false,
                            style: {
                                fontSize: '14px',
                                color: 'black',
                                fontWeight: 'bold'
                            }
                        },
                        borderWidth: 3
                    }
                ],
                data: data,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            console.log(this)
                            if (!this.node.children.length) {
                                const university = this.node.parentNode.parent
                                const first_level = this.node.parent
                                const second_level = this.node.name
                                let url;
                                if(university != 'University of Tours' && first_level != 'University of Tours'){
                                    if(university != '')
                                        url = `./search-researchers?university_name=${university}&department=${first_level}&faculty=${second_level}`;
                                    else
                                        url = `./search-researchers?university_name=${first_level}&department=${second_level}`;
                                    window.open(url, '_blank'); 
                                } else {
                                    if(university == ''){
                                        url = `./search-researchers?university_name=${first_level}&department=${second_level}&one_level=true`;
                                        window.open(url, '_blank');
                                    } else {
                                        url = `./search-researchers?university_name=${university}&department=${first_level}&faculty=${second_level}`;
                                        window.open(url, '_blank');
                                    }
                                }
                            }
                        }
                    }
                },
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
            const colors = ["#00B3E4", "#E83181", "#F39207", "#B94B96", "#BC9AC8", "#FDC200", "#4BB276", "#99C44A","#F5E723","#C3BA20"];
            const response = await axios.get(`${base_url}research-info-surveys/count_submission_by_uni/`)
            const response2 = await axios.get(`${base_url}research-info-surveys/count_by_departmens/`)
            const response3 = await axios.get(`${base_url}research-info-surveys/count_by_faculties/`)
            const response4 = await axios.get(`${base_url}research-info-surveys/count_by_research_units/`)
            const response5 = await axios.get(`${base_url}research-info-surveys/count_by_specific_units/`)
            const response_data = response.data
            const response_data2 = response2.data
            const response_data3 = response3.data
            const research_area = response4.data
            const specific_research_units = response5.data
            let by_uni = []
            for(let i = 0; i<response_data.length; i++){
                const element = {
                    id: response_data[i].university_name,
                    name : response_data[i].university_name,
                    value : parseInt(response_data[i].num_submission),
                    color: colors[i],
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
                if (response_data3[i].faculty !== ''){
                    const faculty = response_data3[i].faculty
                    const element = {
                        id: faculty,
                        name : faculty,
                        value : parseInt(response_data3[i].occurrences),
                        parent : response_data3[i].department,
                    }
                    by_uni.push(element)
                }
            }
            for(let i = 0; i<research_area.length; i++){
                const element = {
                    id: research_area[i].research_units_tours,
                    name : research_area[i].research_units_tours,
                    value : parseInt(research_area[i].occurrences),
                    parent : research_area[i].university_name
                }
                by_uni.push(element)
            }
            for(let i = 0; i<specific_research_units.length; i++){
                if(specific_research_units[i].specific_research_units_tours){
                    const element = {
                        id: specific_research_units[i].specific_research_units_tours,
                        name : specific_research_units[i].specific_research_units_tours,
                        value : parseInt(specific_research_units[i].occurrences),
                        parent : specific_research_units[i].research_units_tours
                    }
                    by_uni.push(element)
                }
            }
            by_uni.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });          
            
            setData(by_uni)
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
        <div style={{ height: '500px' }}>
            <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} containerProps={{ style: { height: '100%' } }} />
        </div>
    )
}

export default TreeMap;