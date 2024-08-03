import React, { useState } from 'react';
import SearchForm from '../components/search_form';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { base_url } from '../api';
import MaterialTable from '../components/material_table';
import { ClipLoader } from 'react-spinners';
import logo_neolaia from '../img/logoNEOLAiA.png'
import logo_eu from '../img/eu_logo.png'
import { Link } from 'react-router-dom';

const SearchResearchers = () => {
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleSearch = async (searchParams,keywords) => {
      try {
        setLoading(true)
        const response = await axios.post(`${base_url}research-info-surveys/search_researchers/`, {
          searchParams,
          keywords
        });
        const columns_data = [
          {
            accessorKey: 'id',
            header: 'ID',
          },
          {
            accessorKey: 'name',
            header: 'Name',
          },
          {
            accessorKey: 'surname',
            header: 'Surname',
          },
          {
            accessorKey: 'university_name',
            header: 'University'
          },
          {
            accessorKey: 'department',
            header: 'First level structure'
          },
          {
            accessorKey: 'faculty',
            header: 'Second level structure'
          },
          {
            accessorKey: 'personal_page_link',
            header: 'Personal page link'
          },
          {
            accessorKey: 'research_group_link',
            header: 'Research group link'
          },
          {
            accessorKey: 'orcid_link',
            header: 'ORCID link'
          },
          {
            accessorKey: 'ERC_Panel_1',
            header: 'ERC Panel (first choice)'
          },
          {
            accessorKey: 'ERC_Keyword_1',
            header: 'ERC Keyword (first choice)'
          },
          {
            accessorKey: 'ERC_Panel_2',
            header: 'ERC Panel (second choice)'
          },
          {
            accessorKey: 'ERC_Keyword_2',
            header: 'ERC Keyword (second choice)'
          },
          {
            accessorKey: 'ERC_Panel_3',
            header: 'ERC Panel (third choice)'
          },
          {
            accessorKey: 'ERC_Keyword_3',
            header: 'ERC Keyword (third choice)'
          },
          {
            accessorKey: 'free_keyword_1',
            header: 'Free keyword (first choice)'
          },
          {
            accessorKey: 'free_keyword_2',
            header: 'Free keyword (second choice)'
          },
          {
            accessorKey: 'free_keyword_3',
            header: 'Free keyword (third choice)'
          }
        ]
        response.data.map((item) => {
          if(!item.personal_page_link.includes('http'))
            item.personal_page_link = <a href={`https://${item.personal_page_link}`} target="_blank">{item.personal_page_link}</a>
          else
            item.personal_page_link = <a href={`${item.personal_page_link}`} target="_blank">{item.personal_page_link}</a>
          if(!item.research_group_link.includes('http'))
            item.research_group_link = <a href={`https://${item.research_group_link}`} target="_blank">{item.research_group_link}</a>
          else
            item.research_group_link = <a href={`${item.research_group_link}`} target="_blank">{item.research_group_link}</a>
          if(!item.orcid_link.includes('http'))
            item.orcid_link = <a href={`https://${item.orcid_link}`} target="_blank">{item.orcid_link}</a>
          else
            item.orcid_link = <a href={`${item.orcid_link}`} target="_blank">{item.orcid_link}</a>
          
        })
        setResults(response.data);
        setColumns(columns_data);
        if(response.data.length == 0){
          setNoResults(true)
        } else {
          setNoResults(false)
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false)
      }
    };

    return (
        <Container>
          <Row style={{ paddingTop: '20px', marginBottom: '25px'}}>
            <Col md={12}>
                <img src={logo_neolaia} alt='Logo NEOLAiA' className="img-fluid" id='neolaia-logo'></img>
                <img src={logo_eu} alt='Logo EU' className="img-fluid" id='eu-logo'></img>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-light" style={{ borderRadius: '15px' }} id='dash-btn' as={Link} to="/researchers-dashboard">Go to the Dashboard</Button>{' '}
            </Col>
          </Row>
          <Row className="my-3">
            <Col>
              <SearchForm onSearch={handleSearch} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Search Results</h3>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <ClipLoader color="#87B8EA" size={150}/>
                </div>
              ) : (
                results.length > 0 && <MaterialTable columns_value={columns} data_table={results} />
              )}
              {noResults && <h3>No researcher found </h3>}
            </Col>
          </Row>
        </Container>
      );
};  

export default SearchResearchers;