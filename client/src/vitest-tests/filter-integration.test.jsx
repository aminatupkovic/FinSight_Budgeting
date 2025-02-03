import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../pages/dashboard';
import { ClerkProvider } from "@clerk/clerk-react";
import { FinRecordProvider } from "../contexts/fin-record-context"; 
import { FinancialRecordList } from '../pages/dashboard/fin-record-list'; // Import FinancialRecordList
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mocking Clerk and User context
vi.mock("@clerk/clerk-react", () => ({
  ...vi.importActual("@clerk/clerk-react"),
  useUser: () => ({
    user: {
      id: "mockUserId", // Mock user ID
      firstName: "John", // Optional: You can mock the user data if needed
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

describe("Dashboard Financial Record Filter Tests", () => {
  it("should filter and display only income records", () => {
    render(
<ClerkProvider
      publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ" // Replace with actual publishable key
    >
      {mockFinRecordProvider({
        children: <FinancialRecordList /> // Render FinancialRecordList directly
      })}
    </ClerkProvider>
    );

    // Get the filter dropdown and set it to "Income"
    const filterDropdown = screen.getByLabelText(/filter/i); // Use label text to specifically find the filter dropdown
    fireEvent.change(filterDropdown, { target: { value: 'income' } });

    // Assert that only income records are displayed
    const incomeRecords = screen.getAllByText(/Income/);
    expect(incomeRecords).toHaveLength(1); // Adjust the expected count based on your mock data

    const expenseRecords = screen.queryAllByText(/Expense/);
    expect(expenseRecords).toHaveLength(1); // Ensure no expense records are shown
  });

  it("should filter and display only expense records", () => {
    render(
        <ClerkProvider
        publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ" // Replace with actual publishable key
      >
        {mockFinRecordProvider({
          children: <FinancialRecordList /> // Render FinancialRecordList directly
        })}
      </ClerkProvider>
    );

    // Get the filter dropdown and set it to "Expense"
    const filterDropdown = screen.getByRole('combobox', { name: /filter/i }); // Assuming it's a <select> element
    fireEvent.change(filterDropdown, { target: { value: 'expense' } });
  
    // Assert that only expense records are displayed
    const expenseRecords = screen.getAllByText(/Expense/);
    expect(expenseRecords).toHaveLength(1); // Adjust the expected count based on your mock data
  
    const incomeRecords = screen.queryAllByText(/Income/);
    expect(incomeRecords).toHaveLength(1); // Make sure no income records are shown
  });
  it("should display both income and expense records when filter is 'all'", () => {
    render(
        <ClerkProvider
        publishableKey="pk_test_a2luZC1oYWxpYnV0LTM2LmNsZXJrLmFjY291bnRzLmRldiQ" // Replace with actual publishable key
      >
        {mockFinRecordProvider({
          children: <FinancialRecordList /> // Render FinancialRecordList directly
        })}
      </ClerkProvider>
    );
  
    // Log the DOM to check if the filter dropdown is available
    screen.debug(); // Helps in checking if the component is rendering correctly
  
    // Get the filter dropdown by label text
    const filterDropdown = screen.getByLabelText(/filter/i); // Using the 'aria-label' set on <select>
    fireEvent.change(filterDropdown, { target: { value: 'all' } });
  
    // Assert that both income and expense records are displayed
    const incomeRecords = screen.getAllByText(/Income/);
    expect(incomeRecords).toHaveLength(1); // Adjust based on mock data
  
    const expenseRecords = screen.getAllByText(/Expense/);
    expect(expenseRecords).toHaveLength(1);  // Adjust based on mock data
  });

});