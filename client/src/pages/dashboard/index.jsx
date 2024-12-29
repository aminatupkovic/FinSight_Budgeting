import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./fin-record-form";
import { IncomeForm } from "./income-form"; // New component
import { FinancialRecordList } from "./fin-record-list";
import "./fin-record.css";
import "../../App.css";
import { useMemo } from "react";
import { useFinancialRecords } from "../../contexts/fin-record-context";
import { PieChart, Pie, Cell, Legend } from "recharts";

export const Dashboard = () => {
  const { records } = useFinancialRecords();

  const currentMonth = new Date().getMonth();

  // Separate incomes and expenses
  const incomes = records.filter(
    (record) => record.type === "income" && new Date(record.date).getMonth() === currentMonth
  );
  const expenses = records.filter(
    (record) => record.type !== "income" && new Date(record.date).getMonth() === currentMonth
);

  // Calculate totals
  const totalIncomes = incomes.reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = expenses.reduce((sum, record) => sum + record.amount, 0);
  const totalNet = totalIncomes - totalExpenses;
  



  // Calculate spending by category
  const categoryData = useMemo(() => {
    const categoryMap = {};
    expenses.forEach((record) => {
        if (!categoryMap[record.category]) categoryMap[record.category] = 0;
        categoryMap[record.category] += record.amount;
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));
}, [expenses]); // Use `expenses` instead of `records`



  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#61dafb", "#a29bfe", "#fd79a8"];

  return (
    <div className="dashboard-container">
      <div className="form-and-stats">
        <div className="form-section">
          <IncomeForm /> {/* New Income Form */}
          <FinancialRecordForm /> {/* Existing Expense Form */}
        </div>
        <div className="info-panel">
          <div className="chart-container">
            <h3>Spending by Category</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
          <div className="stats-container">
            <h4>Monthly Totals</h4>
            <p>Incomes: ${totalIncomes.toFixed(2)}</p>
            <p>Expenses: ${totalExpenses.toFixed(2)}</p>
            <p>Net Total: ${totalNet.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="list-container">
      <FinancialRecordList records={expenses} />

      </div>
    </div>
  );
};

