import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <>
        <span style={{ color: '#555', fontSize: '16px', width: '50%', margin: '10px 0', textAlign: "right", marginLeft: "5px"}}>
        By filling in the form and ticking the box on the left, you accept our <a href="researchers/privacy_policy" target="_blank" rel="noopener noreferrer"> privacy policy</a>
        </span>
        </>
    );
}

export default PrivacyPolicy;
