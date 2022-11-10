const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const jobsService = require('../service/jobs.service');

const router = express.Router();

router.get('/unpaid', getProfile, async (req, res) => {
    const unpaidJobs = await jobsService.listUnpaidJobs(req.profile.id);
    res.json(unpaidJobs);
});

router.post('/:job_id/pay', getProfile, async (req, res) => {
    const { job_id } = req.params;

    if (!job_id) {
        return res.status(400).json({ message: 'Missing job id' });
    }

    const job = await jobsService.pay(job_id, req.profile.balance, req.profile.id);

    if (!job) return res.status(404).end();

    if (!job.success) return res.status(job.status).json(job);

    res.send();
});

module.exports = router;