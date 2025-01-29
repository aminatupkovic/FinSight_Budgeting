import React from "react";
import { render, screen } from "@testing-library/react";
import * as DashboardModule from "../pages/dashboard"; // Adjust the path based on your folder structure
import { useFinancialRecords } from "../contexts/fin-record-context";

// Mock the context used in the Dashboard
jest.mock("../contexts/fin-record-context.jsx", () => ({
  useFinancialRecords: jest.fn(),
}));

// Mock the Clerk `useUser` hook
jest.mock("@clerk/clerk-react", () => ({
  useUser: jest.fn(() => ({
    user: { firstName: "TestUser", id: "12345" },
  })),
}));

describe("Dashboard Component Tests", () => {
  let mockRecords;

  beforeEach(() => {
    // Example mock data for financial records
    mockRecords = [
      { date: "2023-12-01", type: "income", amount: 100 },
      { date: "2023-12-15", type: "expense", amount: 50 },
      { date: "2023-11-20", type: "income", amount: 200 },
    ];

    // Mock the financial records context
    useFinancialRecords.mockReturnValue({
      records: mockRecords,
    });
  });

  it("calls getMonthlyRecords with correct arguments", () => {
    // Spy on the Dashboard component
    const spy = jest.spyOn(DashboardModule, "Dashboard");

    // Render the Dashboard component
    render(<DashboardModule.Dashboard />);

    // Verify the Dashboard is called
    expect(spy).toHaveBeenCalled();

    // Verify the content displayed based on mock records
    const incomesText = screen.getByText("Incomes: $100.00");
    const expensesText = screen.getByText("Expenses: $50.00");

    expect(incomesText).toBeInTheDocument();
    expect(expensesText).toBeInTheDocument();
  });
});
