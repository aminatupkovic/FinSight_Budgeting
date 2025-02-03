import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../pages/dashboard'; // Adjust the import based on your file structure
import { FinRecordsContext } from "../contexts/fin-record-context"; // Assuming your context is provided
import { ClerkProvider } from "@clerk/clerk-react";
import { vi } from 'vitest'; // Import vitest for mocking

// Mock the `useUser` hook and `ClerkProvider` from `@clerk/clerk-react`
vi.mock('@clerk/clerk-react', async () => {
  const actual = await vi.importActual('@clerk/clerk-react');
  return {
    ...actual,
    useUser: () => ({
      user: { id: '123', firstName: 'John' },
    }),
    ClerkProvider: ({ children }) => <div>{children}</div>, // Mock ClerkProvider as a simple wrapper
  };
});

const Wrapper = ({ children }) => (
  <ClerkProvider
    publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ"
  >
    <FinRecordsContext.Provider value={{ records: [] }}>
      {children}
    </FinRecordsContext.Provider>
  </ClerkProvider>
);

describe('Dashboard - handleGoalInputChange', () => {
  it('should update goalAmount and goalDuration when inputs are changed', () => {
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    );

    const goalAmountInput = screen.getByLabelText(/Goal Amount \(\$\):/i);
    const goalDurationInput = screen.getByLabelText(/Duration \(months\):/i);

    // Simulate user entering a value into the goalAmount input
    fireEvent.change(goalAmountInput, { target: { value: '5000' } });
    expect(goalAmountInput.value).toBe('5000');

    // Simulate user entering a value into the goalDuration input
    fireEvent.change(goalDurationInput, { target: { value: '12' } });
    expect(goalDurationInput.value).toBe('12');
  });
});

