import { FinancialRecordForm } from "./fin-record-form";
import { IncomeForm } from "./income-form";
import { FinancialRecordList } from "./fin-record-list";
import "./fin-record.css";
import "../../App.css";
import { useState, useMemo, useEffect } from "react";
import { useFinancialRecords } from "../../contexts/fin-record-context";
import { PieChart, Pie, Cell, Legend } from "recharts";
import DatePicker from "react-datepicker";

export const Dashboard = () => {
  const { records } = useFinancialRecords();

  // Define selectedDate state and initialize with the current date
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const currentMonthRecords = useMemo(() => {
    return records.filter(
      (record) =>
        new Date(record.date).getMonth() === selectedMonth &&
        new Date(record.date).getFullYear() === selectedYear
    );
  }, [records, selectedMonth, selectedYear]);

  const previousMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
  const previousMonthRecords = useMemo(() => {
    return records.filter(
      (record) =>
        new Date(record.date).getMonth() === previousMonthDate.getMonth() &&
        new Date(record.date).getFullYear() === previousMonthDate.getFullYear()
    );
  }, [records, previousMonthDate]);

  const totalPreviousNet = useMemo(() => {
    const incomes = previousMonthRecords.filter((r) => r.type === "income").reduce((sum, r) => sum + r.amount, 0);
    const expenses = previousMonthRecords.filter((r) => r.type !== "income").reduce((sum, r) => sum + r.amount, 0);
    return incomes - expenses;
  }, [previousMonthRecords]);

  const incomes = currentMonthRecords.filter((record) => record.type === "income");
  const expenses = currentMonthRecords.filter((record) => record.type !== "income");
  const totalIncomes = incomes.reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = expenses.reduce((sum, record) => sum + record.amount, 0);
  const totalNet = totalIncomes - totalExpenses + totalPreviousNet;

 

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const categoryMap = {};
    expenses.forEach((record) => {
      if (!categoryMap[record.category]) categoryMap[record.category] = 0;
      categoryMap[record.category] += record.amount;
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));
  }, [expenses]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#61dafb", "#a29bfe", "#fd79a8"];

  // Goal-Setting State
  const [goalAmount, setGoalAmount] = useState(localStorage.getItem("goalAmount") || "");
  const [goalDuration, setGoalDuration] = useState(localStorage.getItem("goalDuration") || "");
  const [goalMessage, setGoalMessage] = useState(localStorage.getItem("goalMessage") || "");
  const [currentSavings, setCurrentSavings] = useState(
    parseFloat(localStorage.getItem("currentSavings")) || 0
  );
  const [savingInput, setSavingInput] = useState("");

  // Save goal-related states to localStorage
  useEffect(() => {
    localStorage.setItem("goalAmount", goalAmount);
    localStorage.setItem("goalDuration", goalDuration);
    localStorage.setItem("goalMessage", goalMessage);
    localStorage.setItem("currentSavings", currentSavings.toString());
  }, [goalAmount, goalDuration, goalMessage, currentSavings]);

  const calculateSavingsGoal = () => {
    if (!goalAmount || !goalDuration) {
      setGoalMessage("Please enter a valid goal amount and duration.");
      return;
    }

    const monthlySavingsRequired = parseFloat(goalAmount) / parseInt(goalDuration);
    if (monthlySavingsRequired > totalNet) {
      setGoalMessage(
        `You need to save $${monthlySavingsRequired.toFixed(
          2
        )} per month. Adjust your expenses or increase income.`
      );
    } else {
      setGoalMessage(
        `Great! You can achieve your goal by saving $${monthlySavingsRequired.toFixed(
          2
        )} per month.`
      );
    }
  };

  const addToSavings = () => {
    const amountToAdd = parseFloat(savingInput);
    if (!amountToAdd || amountToAdd <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (currentSavings + amountToAdd >= parseFloat(goalAmount)) {
      setCurrentSavings(parseFloat(goalAmount));
    } else {
      setCurrentSavings((prev) => prev + amountToAdd);
    }
    setSavingInput("");
  };

  const handleResetGoal = () => {
    setGoalAmount("");
    setGoalDuration("");
    setGoalMessage("");
    setCurrentSavings(0);
    setSavingInput("");
    localStorage.removeItem("goalAmount");
    localStorage.removeItem("goalDuration");
    localStorage.removeItem("goalMessage");
    localStorage.removeItem("currentSavings");
  };

  const savingsPercentage =
    goalAmount > 0 ? Math.min((currentSavings / parseFloat(goalAmount)) * 100, 100) : 0;

    

  return (
    <div className="dashboard-container">
      <div className="date-picker-container">
        <label>Select Month:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
        />
      </div>
      <div className="form-section">
        <div>
          <h2>Enter your Income:</h2>
          <IncomeForm /> {/* New Income Form */}
        </div>
        <div>
          <h2>Enter your Expenses:</h2>
          <FinancialRecordForm /> {/* Existing Expense Form */}
        </div>
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
        <div className="goal-container">
          <h3>Set Your Financial Goal</h3>
          <div>
            <label>Goal Amount ($):</label>
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label>Duration (months):</label>
            <input
              type="number"
              value={goalDuration}
              onChange={(e) => setGoalDuration(e.target.value)}
              placeholder="Enter months"
            />
          </div>
          <button onClick={calculateSavingsGoal}>Calculate Goal</button>
          {goalMessage && <p>{goalMessage}</p>}
        </div>
        <div className="savings-container">
          <h3>Savings Progress</h3>
          {goalAmount === "" ? (
            <p>No current saving goals.</p>
          ) : currentSavings >= parseFloat(goalAmount) ? (
            <>
              <p>🎉 Congratulations! You’ve reached your goal! 🎉</p>
              <button onClick={handleResetGoal}>Set a New Goal</button>
            </>
          ) : (
            <>
              <div className="progress-bar" style={{ backgroundColor: "#f0f0f0", height: "20px" }}>
                <div
                  style={{
                    width: `${savingsPercentage}%`,
                    backgroundColor: "#4caf50",
                    height: "100%",
                  }}
                />
              </div>
              <p>
                ${currentSavings.toFixed(2)} saved out of ${goalAmount || 0}
              </p>
              <div>
                <label>Add to Savings ($):</label>
                <input
                  type="number"
                  value={savingInput}
                  onChange={(e) => setSavingInput(e.target.value)}
                  placeholder="Enter amount"
                />
                <button onClick={addToSavings}>Add</button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="stat-and-analysis">
        <div className="stats-container">
          <h4>Monthly Totals</h4>
          <p>
            <strong>Incomes:</strong> ${totalIncomes.toFixed(2)}
          </p>
          <p>
            <strong>Expenses: </strong>${totalExpenses.toFixed(2)}
          </p>
          <p>
            <strong>Net Total: </strong>${totalNet.toFixed(2)}
          </p>
        </div>

        <div>
          <h1>To be continued...</h1>
        </div>
      </div>
      <h2 style={{ marginTop: "80px" }}>Recent Transactions:</h2>
      <div className="list-container">
        {currentMonthRecords.length > 0 ? (
          <FinancialRecordList records={currentMonthRecords} />
        ) : (
          <p>No transactions for this month.</p>
        )}
      </div>
    </div>
  );
};

