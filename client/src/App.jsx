
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinRecordProvider } from './contexts/fin-record-context';
import { SignedIn, UserButton  } from '@clerk/clerk-react';
import "./App.css";

function App() {
  
  return (
  <Router>
    <div className='app-container'>
      <div className='navbar'>
        <Link to="/">Dashboard</Link>
        <SignedIn>
             <UserButton />
        </SignedIn>
      </div>
      <Routes>
        <Route path='/' element={<FinRecordProvider><Dashboard /></FinRecordProvider>}/>
        <Route path='/auth' element={<Auth />}/>
      </Routes>
    </div>
  </Router>
   
  );
}

export default App
