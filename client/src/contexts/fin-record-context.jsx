//states and functions for states

import React, { createContext, useState } from "react";

// Creating a context for financial records
export const FinRecordsContext = createContext(undefined);

export const FinRecordProvider = ({ children }) => {
    const [records, setRecords] = useState([]);

    const addRecord = async (record) => {
        try {
            console.log("Adding record:", record);
            const response = await fetch("http://localhost:8081/fin-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(record),
            
            });
            console.log("Response status:", response.status);

            if (response.ok) {
                const newRecord = await response.json();
                setRecords((prev) => [...prev, newRecord]);
            }
            else {
                console.error("Failed to add record:", response.statusText);
              }
        } catch (err) {
            console.error("Failed to add record:", err);
        }
    };

    const updateRecord = (id, newRecord) => {
        setRecords(records.map((record) => (record.id === id ? newRecord : record)));
    };

    const deleteRecord = (id) => {
        setRecords(records.filter((record) => record.id !== id));
    };

    return (
        <FinRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
            {children}
        </FinRecordsContext.Provider>
    );
};



