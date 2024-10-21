import React from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';
import logo_neolaia from '../img/logoNEOLAiA.png'
import logo_eu from '../img/eu_logo.png'
import { Link } from 'react-router-dom';
import Counter from '../components/charts/counter';
import PieChart from '../components/charts/pie_charts_by_uni';
import ColumnChart from '../components/charts/column_charts_by_erc';
import CloudWords from '../components/charts/cloud_words';
import TreeMap from '../components/charts/treemap';

function ResearcherDash(){
    return (
        <div>
            <Container fluid>
                <Row id='welcome-msg'>
                    <p>
                        <h1 className='h1'>Welcome to the Open Research Hub</h1>
                        <img src={logo_neolaia} alt='Logo NEOLAiA' className="img-fluid" id='neolaia-logo'></img>
                        <img src={logo_eu} alt='Logo EU' className="img-fluid" id='eu-logo'></img>
                    </p>
                </Row>
                <Row>
                    <Col md={12} className='text-center'>
                        <h5 id='welcome-text'>
                            Welcome to the Open Research Hub. We are asking to contribute to the mapping of Research in NEOLAiA providing information that will be openly accessible (with license CC-BY-SA) within and outside NEOLAiA to foster networking and stimulate collaboration. 
                            This is only an early prototype that we are testing, and you will be also asked to fill in a very short feedback form. In case you need support, please write to <a href='mailto:neolaiasurvey-support-list@unisa.it'>neolaiasurvey-support-list@unisa.it</a>
                        </h5>
                        <Button as={Link} to="/participate" id='start-btn'>Start/Edit Survey</Button>
                        <Button variant='secondary' as={Link} to="/search-researchers" id='search-btn'>Search</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Counter />
                    </Col>
                    <Col md={9}>
                        <PieChart chart_title={'Total number of submission by University'}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CloudWords />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ColumnChart />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <TreeMap />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ResearcherDash;