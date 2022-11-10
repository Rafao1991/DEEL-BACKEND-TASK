const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const balancesService = require('../service/balances.service');

const router = express.Router();

router.post('/deposit', getProfile, async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: 'Missing amount' });
    }

    const newBalance = await balancesService.deposit(amount, req.profile.balance, req.profile.id);

    if (!newBalance) return res.status(404).end();

    if (!newBalance.success) return res.status(newBalance.status).json(newBalance);

    res.json(newBalance);
});

module.exports = router;