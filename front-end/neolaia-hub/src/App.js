import logo from './logo.svg';
import './App.css';
import AuthenticatedForm from './pages/authenticated_form';
import ResearchersFeedbackPage from './pages/researchers_survey_feedback';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function App() {
  return (
      <Router basename='/surveys'>
        <Routes>
          <Route basename={'/surveys'} path="/researchers" element={<AuthenticatedForm />}/>
          <Route basename={'/surveys'} path="/researchersfeedback" element={<ResearchersFeedbackPage />} />
        </Routes>
      </Router>
  );
}

export default App;
