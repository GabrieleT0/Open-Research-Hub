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
import About from './pages/about';

function App() {
  return (
      <Router basename='/research-hub'>
        <Routes>
          <Route basename={'/research-hub'} path='*' element={<ResearcherDash />} /> 
          <Route basename={'/research-hub'} path="/participate" element={<AuthenticatedForm />}/>
          <Route basename={'/research-hub'} path="/researchersfeedback" element={<ResearchersFeedbackPage />} />
          <Route basename={'/research-hub'} path="/editresearcherdata" element={<EditResearcherPage />} />
          <Route basename={'/research-hub'} path='/search-researchers' element={<SearchResearchers />} /> 
          <Route basename={'/research-hub'} path='/researcher-page' element={<ResearcherPage />} /> 
          <Route path='/privacy_policy' element={<PrivacyPolicy />} />
          <Route path='/about' element={<About />} />
          <Route basename={'/research-hub'} path='researchers/privacy_policy' element={<PrivacyPolicy />} /> 
        </Routes>
      </Router>
  );
}

export default App;
