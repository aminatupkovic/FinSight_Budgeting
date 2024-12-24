//states and functions for states

import React, { createContext, useEffect, useState, useContext } from "react";
import {useUser} from "@clerk/clerk-react";

// Creating a context for financial records
export const FinRecordsContext = createContext(undefined);

export const FinRecordProvider = ({ children }) => {
    const [records, setRecords] = useState([]);
    const {user} = useUser();
    const fetchRecords = async () => {
        if(!user) return;
        const response = await fetch(`http://localhost:8081/fin-records/getAllByUserID/${user?.id}`);
        if(response.ok) {
            const records = await response.json()
            console.log(records);
            setRecords(records);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [user]);

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

    const updateRecord = async (id, updatedField) => {
        try {
            if (!user) return;
            const response = await fetch(`http://localhost:8081/fin-records/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedField),
            
            });
            console.log("Response status:", response.status);

            if (response.ok) { 
                const newRecord = await response.json();
                setRecords((prev) =>
                    prev.map((record) => (record.id === id ? { ...record, ...updatedRecord } : record))
                
            );
            }
            else {
                console.error("Failed to add record:", response.statusText);
              }
        } catch (err) {
            console.error("Failed to add record:", err);
        }
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

export const useFinancialRecords = () => {
    const context = useContext(FinRecordsContext);
    if (context === undefined) {
        throw new Error("useFinancialRecords must be used within a FinRecordProvider");
    }
    return context;
};



