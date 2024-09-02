import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthenticatedForm from './pages/authenticated_form';
import ResearchersFeedbackPage from './pages/researchers_survey_feedback';
import EditResearcherPage from './pages/edit_researchers_form';
import ResearcherDash from './pages/researchers_dashboard';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import SearchResearchers from './pages/search_researchers';
import ResearcherPage from './pages/researcher_page';
import PrivacyPolicy from './pages/privacy_policy';

function App() {
  return (
      <Router basename='/surveys'>
        <Routes>
          <Route basename={'/surveys'} path="/researchers" element={<AuthenticatedForm />}/>
          <Route basename={'/surveys'} path="/researchersfeedback" element={<ResearchersFeedbackPage />} />
          <Route basename={'/surveys'} path="/editresearcherdata" element={<EditResearcherPage />} />
          <Route basename={'/surveys'} path='/researchers-dashboard' element={<ResearcherDash />} /> 
          <Route basename={'/surveys'} path='/search-researchers' element={<SearchResearchers />} /> 
          <Route basename={'/surveys'} path='/researcher-page' element={<ResearcherPage />} /> 
          <Route basename={'/surveys'} path='researchers/privacy_policy' element={<PrivacyPolicy />} /> 
        </Routes>
      </Router>
  );
}

export default App;
