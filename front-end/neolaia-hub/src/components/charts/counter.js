import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { base_url } from '../../api';

function Counter(){
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCount = async () => {
        try {
            const response = await axios.get(`${base_url}research-info-surveys/count_submission/`)
            setCount(response.data)
            setLoading(false)
        } catch (error){
            setError(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCount()
        const intervalId = setInterval(() => {
            fetchCount()
        }, 120000) //every 60 seconds
    }, []);

    if (loading) return <Spinner animation="border" variant="primary" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <div className="text-center mt-4">
        <Card className="text-white bg-primary mb-3" style={{ maxWidth: '18rem' }}>
          <Card.Body>
            <Card.Title>The total number of submissions is:</Card.Title>
            <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {count}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
}

export default Counter;