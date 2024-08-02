import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import universities_data from './search_components/universities.json'
import panel_data from './search_components/erc_panel.json'
import faculties_data from './search_components/faculties.json'
import axios from 'axios';
import { base_url } from '../api';


const SearchForm = ({onSearch}) => {

    const [formData, setFormData] = useState({
        university: '',
        department: '',
        faculty: '',
        erc_area: '',
        erc_panel: '',
        erc_keyword: '',
        erc_area_int: '',
        erc_panel_int: '',
        erc_keyword_int: '',
        researcher_name: '',
        researcher_surname: '',
        research_unit_tours: '',
        specific_unit_tours: '',
    })

    const [ercPanelData,setErcPanelData] = useState([])
    const [ercKeyword, setErcKeyword] = useState([])
    const [ercPanelDataInt,setErcPanelDataInt] = useState([])
    const [ercKeywordInt, setErcKeywordInt] = useState([])
    const [departmentData, setDepartmentData] = useState([])
    const [facultyData, setFacultyData] = useState([])
    const [showFaculty, setShowFaculty] = useState(false)
    const [freeKeywords, setFreeKeywords] = useState([])
    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [researchUnitData, setResearchUnit] = useState([])
    const [specificUnitData, setSpecificUnit] = useState([])

    const handleChange = (e) => {
        const {name , value} = e.target;
        if(name == 'erc_panel' && value == '')
            formData.erc_keyword = ''
        if(name == 'erc_panel_int' && value == '')
            formData.erc_keyword_int = ''
        if(name == 'university'){
            formData.faculty = ''
            formData.department = ''
            formData.research_unit_tours = ''
            formData.specific_unit_tours = ''
        }
        
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData,selectedKeywords)
    }

    useEffect(() => {
        if(formData.erc_area_int){
            setErcPanelDataInt(panel_data[formData.erc_area_int])
        }
    },[formData.erc_area_int])

    useEffect(() => {
        if(formData.erc_panel_int){
            setErcKeywordInt(panel_data[formData.erc_panel_int])
        }
    },[formData.erc_panel_int])

    useEffect(() => {
        if(formData.erc_area){
            setErcPanelData(panel_data[formData.erc_area])
        }
    },[formData.erc_area])

    useEffect(() => {
        if(formData.erc_panel){
            setErcKeyword(panel_data[formData.erc_panel])
        }
    },[formData.erc_panel])

    useEffect(() => {
        if(formData.university){
            setDepartmentData(universities_data[formData.university])
        }
    }, [formData.university])

    useEffect(() => {
        setShowFaculty(false)
        if(formData.department && faculties_data[formData.department]){
            setFacultyData(faculties_data[formData.department])
            setShowFaculty(true)
        }
    }, [formData.department])

    useEffect(() => {
        if(formData.university && faculties_data[formData.university]){
            setResearchUnit(faculties_data[formData.university])
        } else {
            setResearchUnit('')
        }
    }, [formData.university])

    useEffect(() => {
        if(formData.research_unit_tours && faculties_data[formData.research_unit_tours]){
            setSpecificUnit(faculties_data[formData.research_unit_tours])
        } else {
            setSpecificUnit('')
        }
    }, [formData.research_unit_tours])


    useEffect(() => {
        async function getFreeKeywords(){
            try {
            const response = await axios.get(`${base_url}research-info-surveys/search_keywords/`);
            setFreeKeywords(response.data)
            } catch (error) {
            console.error("Error:",error)
            }
        }
        getFreeKeywords();
    }, [])

    const handleSelectedKeyword = (value) => {
        if(selectedKeywords.includes(value)) {
            setSelectedKeywords((prevSelected) => prevSelected.filter((item) => item !== value ));
        } else {
            setSelectedKeywords((prevSelected) => [...prevSelected, value])
        }
    }

    const handleReset = () => {
        setFormData({
            university: '',
            department: '',
            faculty: '',
            erc_area: '',
            erc_panel: '',
            erc_keyword: '',
            erc_area_int: '',
            erc_panel_int: '',
            erc_keyword_int: '',
            researcher_name: '',
            researcher_surname: '',
        })
        setSelectedKeywords([])
    }

    return (
        <Container >
            <p><h2>Find Researchers</h2></p>
            <Form onSubmit={handleSubmit}>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group controlId='formUni'>
                            <Form.Label>University</Form.Label>
                            <Form.Control as="select" name="university" value={formData.university} onChange={handleChange}>
                                <option value="">Select the University</option>
                                {universities_data.Universities.map((university, index) => (
                                    <option key={index} value={university}>{university}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formUni'>
                            <Form.Label>Select the first level structure (i.e. Department/Faculty)</Form.Label>
                            <Form.Control as="select" name="department" value={formData.department} onChange={handleChange} disabled={!formData.university}>
                                <option value="">Select the first level structure</option>
                                {departmentData.map((dep, index) => (
                                    <option key={index} value={dep}>{dep}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    {showFaculty && (
                        <Col>
                            <Form.Group controlId='formUni'>
                                <Form.Label>Select the second level structure (i.e. Faculty/School)</Form.Label>
                                <Form.Control as="select" name="faculty" value={formData.faculty} onChange={handleChange} disabled={!formData.department}>
                                    <option value="">Select the second level structure</option>
                                    {facultyData.map((fac, index) => (
                                        <option key={index} value={fac}>{fac.split('_')[0]}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    )}
                    <Row className='mb-3'>
                    {
                        researchUnitData!= ''  && (
                                <Col>
                                    <Form.Group controlId='formUni'>
                                        <Form.Label>Select the research area</Form.Label>
                                        <Form.Control as="select" name="research_unit_tours" value={formData.research_unit_tours} onChange={handleChange} disabled={!formData.university}>
                                            <option value="">Select the research area</option>
                                            {researchUnitData.map((dep, index) => (
                                                <option key={index} value={dep}>{dep.split('_')[0]}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                        )
                    }
                    {
                        specificUnitData!= '' && (
                            <Col>
                                <Form.Group controlId='formUni'>
                                    <Form.Label>Select the research unit</Form.Label>
                                    <Form.Control as="select" name="specific_unit_tours" value={formData.specific_unit_tours} onChange={handleChange} disabled={!formData.research_unit_tours}>
                                        <option value="">Select the research unit</option>
                                        {specificUnitData.map((dep, index) => (
                                            <option key={index} value={dep}>{dep}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        )
                    }
                </Row>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Area</Form.Label>
                            <Form.Control as="select" name="erc_area" value={formData.erc_area} onChange={handleChange}>
                                <option value=''>Select the ERC area </option>
                                <option key={0} value={'Physical Sciences and Engineering (PE)'}>Physical Sciences and Engineering (PE)</option>
                                <option key={1} value={'Life Sciences (LS)'}>Life Sciences (LS)</option>
                                <option key={2} value={'Social Sciences and Humanities (SH)'}>Social Sciences and Humanities (SH)</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Panel </Form.Label>
                            <Form.Control as="select" name="erc_panel" value={formData.erc_panel} onChange={handleChange} disabled={!formData.erc_area}>
                                <option value=''>Select the ERC panel</option>
                                {ercPanelData.map((panel, index) => (
                                    <option key={index} value={panel}>{panel}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Keyword </Form.Label>
                            <Form.Control as="select" name="erc_keyword" value={formData.erc_keyword} onChange={handleChange} disabled={!formData.erc_panel}>
                                <option value=''>Select the ERC keyword</option>
                                {ercKeyword.map((keyword, index) => (
                                    <option key={index} value={keyword}>{keyword}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Area (interested) </Form.Label>
                            <Form.Control as="select" name="erc_area_int" value={formData.erc_area_int} onChange={handleChange}>
                                <option value=''>Select the ERC area (interested) </option>
                                <option key={0} value={'Physical Sciences and Engineering (PE)'}>Physical Sciences and Engineering (PE)</option>
                                <option key={1} value={'Life Sciences (LS)'}>Life Sciences (LS)</option>
                                <option key={2} value={'Social Sciences and Humanities (SH)'}>Social Sciences and Humanities (SH)</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Panel (interested) </Form.Label>
                            <Form.Control as="select" name="erc_panel_int" value={formData.erc_panel_int} onChange={handleChange} disabled={!formData.erc_area_int}>
                                <option value=''>Select the ERC panel</option>
                                {ercPanelDataInt.map((panel, index) => (
                                    <option key={index} value={panel}>{panel}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>ERC Keyword (interested)</Form.Label>
                            <Form.Control as="select" name="erc_keyword_int" value={formData.erc_keyword_int} onChange={handleChange} disabled={!formData.erc_panel_int}>
                                <option value=''>Select the ERC keyword</option>
                                {ercKeywordInt.map((keyword, index) => (
                                    <option key={index} value={keyword}>{keyword}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-tags">
                            Free keywords
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {freeKeywords && freeKeywords.map((keyword, index) => (
                              <Form.Check 
                                key={index}
                                className='free-keywords-check'
                                label={`${keyword.matched_keyword} (x${keyword.occurrences})`}
                                name='keywords'
                                type='checkbox'
                                id={index}
                                onChange={() => handleSelectedKeyword(keyword.matched_keyword)}
                                checked={selectedKeywords.includes(keyword.matched_keyword)}
                              /> 
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>Researcher name </Form.Label>
                            <Form.Control as="textarea" rows={1} name="researcher_name" value={formData.researcher_name} onChange={handleChange}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='formArea'>
                            <Form.Label>Researcher surname </Form.Label>
                            <Form.Control as="textarea" rows={1} name="researcher_surname" value={formData.researcher_surname} onChange={handleChange}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Button  type='submit' id='search-sub'>Search</Button>
                <Button variant='danger' type='reset' id='reset-btn' style={{marginLeft: '10px'}} onClick={handleReset}>Resets all fields</Button>
            </Form>
        </Container>
    )

}

export default SearchForm;