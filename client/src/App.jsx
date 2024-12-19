
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinRecordProvider } from './contexts/fin-record-context';

function App() {
  
  return (
  <Router>
    <div className='app-container'>
      <Routes>
        <Route path='/' element={<FinRecordProvider><Dashboard /></FinRecordProvider>}/>
        <Route path='/auth' element={<Auth />}/>
      </Routes>
    </div>
  </Router>
   
  );
}

export default App
