
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { FinRecordProvider } from './contexts/fin-record-context';
import { SignedIn, UserButton  } from '@clerk/clerk-react';
import logo from "./assets/FinSight-removebg-preview.png";
import "./App.css";

function App() {
  
  return (
  <Router >
    <div className='app-container'>
      <div className='navbar'>
        <div className='img-and-dash'>
          <img src={logo} className='logo-img'/>
          <Link className= 'dashboard-link' to="/">Dashboard</Link>
        </div>
       <div className='user-section'>
       <SignedIn>
             <UserButton />
        </SignedIn>
       </div>
        
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
