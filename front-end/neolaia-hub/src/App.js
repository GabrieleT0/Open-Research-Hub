import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticatedForm from './pages/authenticated_form';
import ResearchersFeedbackPage from './pages/researchers_survey_feedback';
import EditResearcherPage from './pages/edit_researchers_form';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function App() {
  return (
      <Router basename='/surveys'>
        <Routes>
          <Route basename={'/surveys'} path="/researchers" element={<AuthenticatedForm />}/>
          <Route basename={'/surveys'} path="/researchersfeedback" element={<ResearchersFeedbackPage />} />
          <Route basename={'/surveys'} path="/editresearcherdata" element={<EditResearcherPage />} />
        </Routes>
      </Router>
  );
}

export default App;
