import React, { useState, useEffect } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { base_url } from '../../api';
require('highcharts/modules/wordcloud.js')(Highcharts);

function create_options(chart_title,data){
    const options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data,
            name: 'Occurrences'
        }],
        title: {
            text: 'Free keywords occurrences',
        },
        tooltip: {
            headerFormat: '<span style="font-size: 16px"><b>{point.key}</b>' +
                '</span><br>'
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point:{
                    events: {
                        click: function(){
                            const url = `./search-researchers?keyword=${this.name}`;
                            window.open(url, '_blank');
                        }
                    },
                }
            }
        }
    }
    
    return options
}

function CloudWords({chart_title, series}){
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${base_url}research-info-surveys/get_free_keywords/`)
            const response_data = response.data
            let text = ''
            for(let i = 0; i<response_data.length; i++){
                response_data[i] = response_data[i].replace(/ /g,'-')
                text += ` ${response_data[i]}`

            }
            let lines = text.replace(/[():'?0-9]+/g, '').split(/[,\. ]+/g),
            data = lines.reduce((arr, word) => {
                let obj = Highcharts.find(arr, obj => obj.name === word);
                if (obj) {
                    obj.weight += 1;
                } else {
                    obj = {
                        name: word,
                        weight: 1
                    };
                    arr.push(obj);
                }
                return arr;
            }, []);
            setData(data)
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
            <HighchartsReact highcharts={Highcharts} options={create_options(chart_title,data)} containerProps={{ style: { height: '100%' } }} />
        </div>
    )
}

export default CloudWords;