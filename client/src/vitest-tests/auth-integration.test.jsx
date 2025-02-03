import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { React } from 'react';
import { waitFor } from '@testing-library/react';
import { SignedIn, SignedOut, useAuth, useUser, ClerkProvider } from '@clerk/clerk-react';
import App from '../App.jsx'; // Adjust the import path as needed
import Auth from '../pages/auth/index.jsx'; // Adjust the import path as needed
import '@testing-library/jest-dom/vitest';

// Mock Clerk's useAuth hook
vi.mock('@clerk/clerk-react', async (importOriginal) => {
  const actual = await importOriginal(); // Import the actual module
  return {
    ...actual, // Spread the actual module's exports
    useAuth: vi.fn(),
    useUser: vi.fn(), // Mock useUser
    SignedIn: ({ children }) => <div>{children}</div>,
    SignedOut: ({ children }) => <div>{children}</div>,
    UserButton: () => <div>UserButton</div>,
    SignInButton: ({ mode, children }) => <button aria-label="Sign In">{children}</button>,
    SignUpButton: ({ mode, children }) => <button aria-label="Sign Up">{children}</button>,
  };
});

// Custom render function that wraps components in ClerkProvider
const renderWithClerk = (ui, options = {}) => {
  return render(
    <ClerkProvider publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ">
      {ui}
    </ClerkProvider>,
    options
  );
};

describe('Authentication and Dashboard Access', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    vi.clearAllMocks();
  });

  it('should redirect to the dashboard after signing in', async () => {
    // Mock the useAuth and useUser hooks to simulate a signed-in user
    useAuth.mockReturnValue({ isSignedIn: true });
    useUser.mockReturnValue({ user: { id: '123', firstName: 'Test', fullName: 'Test User' } });

    // Use the custom render function
    renderWithClerk(<App />);

    // Check if the dashboard is rendered
    expect(screen.getByText(/Welcome to your Dashboard, Test/i)).toBeInTheDocument(); // Match the dynamic text
  });

  it('should show the Auth page when not signed in', async () => {
    // Mock the useAuth hook to simulate a signed-out user
    useAuth.mockReturnValue({ isSignedIn: false });

    // Use the custom render function
    renderWithClerk(<App />);

    // Check if the Auth page is rendered
    expect(screen.getByText(/Let's start saving!/i)).toBeInTheDocument(); // Adjust based on your Auth component content
  });

 
});