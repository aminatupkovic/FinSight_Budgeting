import React from "react";
import { useFinancialRecords } from "../../contexts/fin-record-context";

export const FinancialRecordList = () => {
    const { records, deleteRecord } = useFinancialRecords();

    const handleDeleteRecord = (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            deleteRecord(id);
        }
    };

    const generateRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="list-container">
            {records.map((record, index) => (
                <div
                    className="expense-card"
                    key={record._id || index}
                    style={{ borderColor: generateRandomColor() }}
                >
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
                    <button
                        className="delete-button"
                        onClick={() => handleDeleteRecord(record._id)}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};
