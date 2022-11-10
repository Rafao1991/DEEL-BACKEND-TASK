const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const contractsService = require('../service/contracts.service');

const router = express.Router();

router.get('/:id', getProfile, async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Missing contract id' });
    }

    const contract = await contractsService.findById(id, req.profile.id);

    if (!contract) return res.status(404).end();
    res.json(contract);
});

router.get('/', getProfile, async (req, res) => {
    const contracts = await contractsService.listAll(req.profile.id);
    res.json(contracts);
});

module.exports = router;