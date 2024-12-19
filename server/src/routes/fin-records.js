const express = require('express');
const FinRecord = require('../schema/fin-record');

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await FinRecord.find({ userId: userId });
        if (records.length === 0) {
            return res.status(404).send("No records found");
        }
        res.status(200).send(records);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/", async (req, res) => {
    try {
        const newRecordBody = req.body
        const newRecord = new FinRecord(newRecordBody);
        const savedRecord = await newRecord.save();

        res.status(200).send(savedRecord)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newRecordBody = req.body
        const record = await FinRecord.findByIdAndUpdate(id, newRecordBody, {new:true});

        if (!record) return res.status(404).send();

        res.status(200).send(record)
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const record = await FinRecord.findByIdAndDelete(id);

        if (!record) return res.status(404).send();

        res.status(200).send(record)
    } catch (err) {
        res.status(500).send(err);
    }
});



module.exports = router;
