import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResearcherCard from '../components/researcher_card';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { base_url } from '../api';
import logo_neolaia from '../img/logoNEOLAiA.png'
import logo_eu from '../img/eu_logo.png'
import { Link } from 'react-router-dom';

function ResearcherPage(){
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const researcher_id = queryParams.get('researcher_id');
    const [researcher_data, setResearcherData] = useState({});

    useEffect(() => {
        async function getResearcherData(){
            try {
            const response = await axios.get(`${base_url}research-info-surveys/${researcher_id}`);
            setResearcherData(response.data.data.attributes)
            } catch (error) {
            console.error("Error:",error)
            }
        } 
        getResearcherData();
    }, [])

 //d-flex
    return(
        <Container>
            <Row style={{ paddingTop: '20px', marginBottom: '25px'}}>
            <Col md={12}>
            <img src={logo_neolaia} alt='Logo NEOLAiA' className="img-fluid" id='neolaia-logo'></img>
            <img src={logo_eu} alt='Logo EU' className="img-fluid" id='eu-logo'></img>
            </Col>
            </Row>
            <Row>
                <Col>
                <Button variant="outline-light" style={{ borderRadius: '15px' }} id='search-card-btn' as={Link} to="/search-researchers">Search</Button>{' '}
                <Button variant="outline-light" style={{ borderRadius: '15px' }} id='dash-btn' as={Link} to="/researchers-dashboard">Go to the Dashboard</Button>{' '}
                </Col>
            </Row>
            <Row style={{ paddingTop: '50px' }}>
                <Col className="d-flex justify-content-center">
                    <ResearcherCard card_data={researcher_data}/>
                </Col>
            </Row>
        </Container>
    )
}

export default ResearcherPage;