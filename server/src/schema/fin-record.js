const mongoose = require('mongoose');

// Define the schema for financial records
const finRecordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    payment: { type: String, required: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
});

// Create a model from the schema
const FinRecord = mongoose.model('FinRecord', finRecordSchema, 'finrecords');

module.exports = FinRecord;
