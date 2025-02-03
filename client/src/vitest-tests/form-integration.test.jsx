import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useUser } from '@clerk/clerk-react';
import { FinancialRecordForm } from '../pages/dashboard/fin-record-form';
import { FinRecordsContext } from '../contexts/fin-record-context';
import '@testing-library/jest-dom/vitest';

// Mock Clerk's useUser hook
vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(),
}));

describe('FinancialRecordForm', () => {
  let mockAddRecord;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddRecord = vi.fn();

    useUser.mockReturnValue({ user: { id: 'user123', firstName: 'Test' } });
  });

  it('should add a new expense when the form is submitted', () => {
    render(
      <FinRecordsContext.Provider value={{ addRecord: mockAddRecord }}>
        <FinancialRecordForm />
      </FinRecordsContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Groceries' },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '50' },
    });
    
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), {
      target: { value: 'Cash' },
    });

    fireEvent.click(screen.getByText(/Add Expense/i));

    expect(mockAddRecord).toHaveBeenCalledWith({
      userId: 'user123',
      date: expect.any(Date),
      description: 'Groceries',
      amount: 50,
      category: 'Food',
      payment: 'Cash',
      type: 'expense',
    });
  });
});
