import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { FinRecordsContext } from "../../contexts/fin-record-context";

export const FinancialRecordForm = () => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [payment, setPayment] = useState("");

    const { user } = useUser();
    const { addRecord } = useContext(FinRecordsContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newRecord = {
            userId: user?.id,
            date: new Date(),
            description,
            amount: parseFloat(amount),
            category,
            payment,
            type: "expense",
        };

        addRecord(newRecord);

        setDescription("");
        setAmount("");
        setCategory("");
        setPayment("");
    };

    return (
        <div className="form-container-exp">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Description</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Amount:</label>
                    <input
                        type="number"
                        required
                        className="input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Category:</label>
                    <select
                        required
                        className="input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select a Category</option>
                        <option value="Food">Food</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Payment Method:</label>
                    <select
                        required
                        className="input"
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                    >
                        <option value="">Select a payment method</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
                <button type="submit" className="button">
                    Add Expense
                </button>
            </form>
        </div>
    );
};
