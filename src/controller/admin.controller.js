const express = require('express');
const moment = require('moment');
const adminService = require('../service/admin.service');

const router = express.Router();

router.get('/best-profession', async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).send('Start and end dates are required');
    }

    const startDate = moment(start);
    if (!startDate.isValid()) {
        return res.status(400).send('Invalid start date format');
    }

    const endDate = moment(end);
    if (!endDate.isValid()) {
        return res.status(400).send('Invalid end date format');
    }

    const bestProfession = await adminService.findBestProfession(startDate, endDate);

    if (!bestProfession) {
        return res.status(404).end();
    }

    if (!bestProfession.success) {
        return res.status(bestProfession.status).send(bestProfession);
    }

    res.json(bestProfession.result);
});

router.get('/best-clients', async (req, res) => {
    const { start, end, limit } = req.query;

    if (!start || !end) {
        return res.status(400).send('Start and end dates are required');
    }

    const startDate = moment(start);
    if (!startDate.isValid()) {
        return res.status(400).send('Invalid start date format');
    }

    const endDate = moment(end);
    if (!endDate.isValid()) {
        return res.status(400).send('Invalid end date format');
    }

    const bestClients = await adminService.findBestClients(startDate, endDate, limit ? limit : 2);

    if (!bestClients) {
        return res.status(404).end();
    }

    if (!bestClients.success) {
        return res.status(bestClients.status).send(bestClients);
    }

    res.json(bestClients.result);
});

module.exports = router;