import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Dashboard } from "../pages/dashboard";
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

describe("Goal Setting Form", () => {
  it("should update goal amount and duration", async () => {
    render(
      <ClerkProvider
        publishableKey="your-publishable-key-here" // Provide the actual Clerk publishable key
      >
        <FinRecordProvider>
          <Dashboard />
        </FinRecordProvider>
      </ClerkProvider>
    );

    // Find elements by their labels
    const goalAmountInput = screen.getByLabelText(/Goal Amount \(\$\):/i);
    const goalDurationInput = screen.getByLabelText(/Duration \(months\):/i);

    // Simulate user typing in the inputs
    fireEvent.change(goalAmountInput, { target: { value: "1000" } });
    fireEvent.change(goalDurationInput, { target: { value: "12" } });

    // Wait for the goal calculation logic
    await waitFor(() => {
      expect(goalAmountInput.value).toBe("1000");
      expect(goalDurationInput.value).toBe("12");
    });
  });
});
