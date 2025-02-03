import React, { useState } from "react";
import { useFinancialRecords } from "../../contexts/fin-record-context";
import "./fin-record.css";

export const FinancialRecordList = ({selectedMonth}) => {
    const { records, deleteRecord, updateRecord } = useFinancialRecords();
    const [editingRecord, setEditingRecord] = useState(null);
    const [filterType, setFilterType] = useState("all");

    const handleDeleteRecord = (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            deleteRecord(id);
        }
    };

    const handleEditClick = (record) => {
        setEditingRecord({ ...record }); // Create a copy of the record to avoid modifying the state directly
    };

    const handleSaveEdit = () => {
        if (editingRecord.amount <= 0 || isNaN(editingRecord.amount)) {
            alert("Please enter a valid amount.");
            return;
        }
        updateRecord(editingRecord._id, editingRecord);
        setEditingRecord(null);
    };

    const handleCancelEdit = () => {
        setEditingRecord(null);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };

    const filteredRecords = records.filter((record) => {
        const recordDate = new Date(record.date);
        const recordMonth = recordDate.getMonth();

        if (recordMonth !== selectedMonth) {
            return false;
        }

        // Filter by type
        if (filterType === "all") return true;
        return filterType === "income" ? record.type === "income" : record.type !== "income";
       
    });

    return (
        <div className="list-container">
            <div className="transactions-header">
                <h2 style={{ marginTop: "80px", marginLeft: "6%" }}>Recent Transactions:</h2>
                <div className="filter-container">
                    <select
                        aria-label="filter"
                        id="filter"
                        onChange={handleFilterChange}
                        value={filterType}
                        className="filter-dropdown"
                    >
                        <option value="all">All</option>
                        <option value="income">Only Incomes</option>
                        <option value="expense">Only Expenses</option>
                    </select>
                </div>
            </div>

            {filteredRecords.map((record, index) => (
                <div
                    className="expense-card"
                    key={record._id || index}
                    style={{ borderColor: record.type === "income" ? "#f5c116" : "#38b6ff" }}
                >
                    {editingRecord && editingRecord._id === record._id ? (
                        <div className="edit-container">
                            <input
                                type="text"
                                value={editingRecord.description}
                                onChange={(e) =>
                                    setEditingRecord({ ...editingRecord, description: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                value={editingRecord.amount}
                                onChange={(e) => {
                                    const newValue = parseFloat(e.target.value);
                                    setEditingRecord({ ...editingRecord, amount: isNaN(newValue) ? "" : newValue });
                                }}
                            />
                            <input
                                type="text"
                                value={editingRecord.category}
                                onChange={(e) =>
                                    setEditingRecord({ ...editingRecord, category: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                value={editingRecord.payment}
                                onChange={(e) =>
                                    setEditingRecord({ ...editingRecord, payment: e.target.value })
                                }
                            />
                            <button className="save-button" onClick={handleSaveEdit}>Save</button>
                            <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <div className="expense-detail">
                                <strong>Description:</strong> {record.description}
                            </div>
                            <div className="expense-detail">
                                <strong>Amount:</strong> ${record.amount.toFixed(2)}
                            </div>
                            <div className="expense-detail">
                                <strong>Category:</strong> {record.category}
                            </div>
                            <div className="expense-detail">
                                <strong>Payment:</strong> {record.payment}
                            </div>
                            <div className="expense-detail">
                                <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
                            </div>
                            <button role="button" aria-label="edit" id="edit" name="edit" className="edit-button" onClick={() => handleEditClick(record)}>Edit</button>
                            <button role="button" name="delete" className="delete-button" onClick={() => handleDeleteRecord(record._id)}>Delete</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
