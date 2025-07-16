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
            const existingIds = new Set();
            response_data.forEach((item, i) => {
            const id = item.university_name;
            existingIds.add(id);
            by_uni.push({
                id,
                name: id,
                value: parseInt(item.num_submission),
                color: colors[i % colors.length],
            });
        });

        response_data2.forEach((item) => {
            const id = item.department;
            const parent = item.university_name;
            if (id !== parent && existingIds.has(parent)) {
                existingIds.add(id);
                by_uni.push({
                    id,
                    name: id,
                    value: parseInt(item.occurrences),
                    parent,
                });
            }
        });

        response_data3.forEach((item) => {
            const id = item.faculty;
            const parent = item.department;
            if (id && id !== parent && existingIds.has(parent)) {
                existingIds.add(id);
                by_uni.push({
                    id,
                    name: id,
                    value: parseInt(item.occurrences),
                    parent,
                });
            }
        });

        research_area.forEach((item) => {
            const id = item.research_units_tours;
            const parent = item.university_name;
            if (id && id !== parent && existingIds.has(parent)) {
                existingIds.add(id);
                by_uni.push({
                    id,
                    name: id,
                    value: parseInt(item.occurrences),
                    parent,
                });
            }
        });

        specific_research_units.forEach((item) => {
            const id = item.specific_research_units_tours;
            const parent = item.research_units_tours;
            if (id && id !== parent && existingIds.has(parent)) {
                existingIds.add(id);
                by_uni.push({
                    id,
                    name: id,
                    value: parseInt(item.occurrences),
                    parent,
                });
            }
        });
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