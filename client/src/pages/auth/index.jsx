import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import './Auth.css'; // Make sure the CSS file is imported.
import pic from "../../assets/no-money.png";

export const Auth = () => {
  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <h3 className='box-text'>Let's start saving!</h3>
       
        
        <SignedOut>
          <div className="auth-options">
            <SignUpButton mode='modal' />
            <SignInButton mode='modal' />
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div>
        <img className='box-img' src={pic} />
      </div>
    </div>
  );
};
