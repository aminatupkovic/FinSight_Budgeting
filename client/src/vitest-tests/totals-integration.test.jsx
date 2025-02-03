import { render, screen } from '@testing-library/react';
import { Dashboard } from '../pages/dashboard';
import { ClerkProvider } from "@clerk/clerk-react";
import { FinRecordProvider } from "../contexts/fin-record-context"; // Ensure correct import
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mocking Clerk
vi.mock("@clerk/clerk-react", () => ({
  ...vi.importActual("@clerk/clerk-react"),
  useUser: () => ({
    user: {
      id: "mockUserId", // Mock user ID
    },
  }),
  ClerkProvider: ({ children }) => <div>{children}</div>, // Mocking ClerkProvider
}));

// Mocking the FinRecordProvider context directly
const mockFinRecordProvider = ({ children }) => (
  <FinRecordProvider>
    {children}
  </FinRecordProvider>
);

describe("Dashboard Monthly Totals", () => {
  it("should display the correct monthly totals for income, expenses, and net total", () => {
    render(
      <ClerkProvider
        publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ" // Replace with actual publishable key
      >
        {mockFinRecordProvider({
          children: <Dashboard />
        })}
      </ClerkProvider>
    );

    // Use getAllByRole to get all <p> elements
    const paragraphs = screen.getAllByRole('paragraph'); 

    // Filter only those containing the expected totals
    const totals = paragraphs.filter((p) => p.textContent.includes('$0.00'));

    // Assert that only 3 elements match
   // expect(totals).toHaveLength(6);

    // Optionally, you can further check each total if needed
    expect(totals[0]).toHaveTextContent('Incomes:');
    expect(totals[1]).toHaveTextContent('Expenses:');
    expect(totals[2]).toHaveTextContent('Net Total:');
  });
});

