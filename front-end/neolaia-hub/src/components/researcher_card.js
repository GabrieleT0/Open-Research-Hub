import React, { useState } from 'react';
import { Card, Nav, Button, ListGroup } from 'react-bootstrap';
import { formatHumanReadableDate, return_erc_area } from '../utils';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function ResearcherCard({ card_data }) {
    const [activeTab, setActiveTab] = useState('#personal');
    console.log(card_data)
    if(card_data.personal_page_link){
        if(!card_data.personal_page_link.includes('http'))
            card_data.personal_page_link = `https://${card_data.personal_page_link}`
    }

    if(card_data.research_group_link){
        if(!card_data.research_group_link.includes('http'))
            card_data.research_group_link = `https://${card_data.research_group_link}`
    }

    if(card_data.orcid_link){
        if(!card_data.orcid_link.includes('http'))
            card_data.orcid_link = `https://${card_data.orcid_link}`
    }

    const handleSelect = (eventKey) => {
        setActiveTab(eventKey);
    };

    return ( 
        <div style={{}}>
        <Card id='card'>
            <Card.Header as="h5">
            <p><h3><b>{card_data.name} {card_data.surname}</b></h3></p>
                <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="#personal">Personal information</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="#erc_conducted">ERC Keywords (conducted)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="#erc_interested">ERC Keywords (interested) </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="#free_keywords">Free keywords </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                {activeTab === '#personal' && (
                    <>
                        <Card.Title as={"h4"}><b>{card_data.university_name}</b></Card.Title>
                        <Card.Text as={"h5"} style={{marginBottom: '20px'}}>
                            <span>{card_data.department}</span>
                            {card_data.faculty && <p>{card_data.faculty}</p>}
                            {card_data.research_units_tours && <p><b>Research area:</b> {card_data.research_units_tours.split('_')[0]}</p>}
                            {card_data.specific_research_units_tours && <p><b>Research unit:</b> {card_data.specific_research_units_tours}</p>}
                        </Card.Text>
                        {card_data.personal_page_link && <Button variant="primary" href={card_data.personal_page_link} target="_blank" rel="noopener noreferrer" id='personal-btn'>Go to the personal page</Button>}
                        {card_data.research_group_link && <Button variant="primary" href={card_data.research_group_link} target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px'}} id='research-btn'>Go to the Research group link</Button>}
                        {card_data.orcid_link && <Button variant="secondary" href={card_data.orcid_link} target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px'}} id='orcid-btn'> ORCID profile </Button>}
                    </>
                )}
                {activeTab === '#erc_conducted' && (
                    <>
                        <Card.Title as={"h4"}> <b>ERC Keywords (areas in which the research is conducted)</b></Card.Title>
                        <Card.Text as={"h5"}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <b>First choice</b>
                                    <ul>
                                        <li>Area: {return_erc_area(card_data.ERC_Panel_1)}</li>
                                        <ul>
                                            <li>Panel: {card_data.ERC_Panel_1}</li>
                                            <ul>
                                                <li>Keyword: {card_data.ERC_Keyword_1}</li>
                                            </ul>
                                        </ul>
                                    </ul>
                                </ListGroup.Item>
                            {
                                card_data.ERC_Panel_2 && (
                                    <ListGroup.Item>
                                    <b>Second choice</b>
                                    <ul>
                                        <li>Area: {return_erc_area(card_data.ERC_Panel_2)}</li>
                                        <ul>
                                            <li>Panel: {card_data.ERC_Panel_2}</li>
                                            <ul>
                                                <li>Keyword: {card_data.ERC_Keyword_2}</li>
                                            </ul>
                                        </ul>
                                    </ul>
                                </ListGroup.Item>
                                )
                            }
                            {
                                card_data.ERC_Panel_3 && (
                                    <ListGroup.Item>
                                    <b>Third choice</b>
                                    <ul>
                                        <li>Area: {return_erc_area(card_data.ERC_Panel_3)}</li>
                                        <ul>
                                            <li>Panel: {card_data.ERC_Panel_3}</li>
                                            <ul>
                                                <li>Keyword: {card_data.ERC_Keyword_3}</li>
                                            </ul>
                                        </ul>
                                    </ul>
                                </ListGroup.Item>
                                )
                            }
                            </ListGroup>
                        </Card.Text>
                    </>
                )}
                {activeTab === '#erc_interested' && (
                    <>
                        <Card.Title as={"h4"}> <b>ERC Keywords (research areas of interest) </b></Card.Title>
                        <Card.Text as={"h5"}>
                            <ListGroup variant='flush'>
                                {
                                     card_data.ERC_Panel_interested_1 && (
                                        <ListGroup.Item>
                                        <b>First choice</b>
                                        <ul>
                                            <li>Area: {return_erc_area(card_data.ERC_Panel_interested_1)}</li>
                                            <ul>
                                                <li>Panel: {card_data.ERC_Panel_interested_1}</li>
                                                <ul>
                                                    <li>Keyword: {card_data.ERC_Panel_interested_1}</li>
                                                </ul>
                                            </ul>
                                        </ul>
                                    </ListGroup.Item>
                                    )
                                }
                                {
                                     card_data.ERC_Panel_interested_2 && (
                                        <ListGroup.Item>
                                        <b>Second choice</b>
                                        <ul>
                                            <li>Area: {return_erc_area(card_data.ERC_Panel_interested_2)}</li>
                                            <ul>
                                                <li>Panel: {card_data.ERC_Panel_interested_2}</li>
                                                <ul>
                                                    <li>Keyword: {card_data.ERC_Panel_interested_2}</li>
                                                </ul>
                                            </ul>
                                        </ul>
                                    </ListGroup.Item>
                                    )
                                }
                                {
                                     card_data.ERC_Panel_interested_3 && (
                                        <ListGroup.Item>
                                        <b>Second choice</b>
                                        <ul>
                                            <li>Area: {return_erc_area(card_data.ERC_Panel_interested_3)}</li>
                                            <ul>
                                                <li>Panel: {card_data.ERC_Panel_interested_3}</li>
                                                <ul>
                                                    <li>Keyword: {card_data.ERC_Panel_interested_3}</li>
                                                </ul>
                                            </ul>
                                        </ul>
                                    </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </Card.Text>
                    </>
                )}
                {activeTab === '#free_keywords' && (
                    <>
                        <Card.Title as={"h4"} style={{marginBottom : '15px'}}> <b>Free keywords inserted </b></Card.Title>
                        <Card.Text as={"h5"}>
                        <Stack direction="horizontal" gap={2}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(index => {
                            const keyword = card_data[`free_keyword_${index}`];
                            return (
                                keyword && (
                                    <Badge
                                        key={`pill${index}`}
                                        pill
                                        bg="primary"
                                        id={`pill${index}`}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >
                                        {keyword}
                                    </Badge>
                                )
                            );
                        })}
                            </Stack>
                        </Card.Text>
                    </>
                )}
            </Card.Body>
            <Card.Footer className="text-muted">Last update: {formatHumanReadableDate(card_data.updatedAt)}</Card.Footer>
        </Card>
        </div>
    );
}

export default ResearcherCard;
