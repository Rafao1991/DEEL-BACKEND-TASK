const { sequelize } = require('../model');
const { Op } = require("sequelize");
const moment = require('moment');

const profilesService = require('./profiles.service');

const { Contract, Job, Profile } = sequelize.models;

const updatePaid = async (id, paid, paymentDate) => {
    await Job.update(
        { paid, paymentDate },
        { where: { id } }
    );
};

const listUnpaidJobs = async (profileId) => {
    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            where: {
                status: 'in_progress',
                [Op.or]: [
                    { clientId: profileId },
                    { contractorId: profileId },
                ]
            }
        }],
        where: {
            [Op.or]: [
                { paid: false },
                { paid: null },
            ]
        }
    });
    return jobs;
};

const pay = async (jobId, balance, profileId) => {
    const job = await Job.findOne({
        include: [{
            model: Contract,
            where: { clientId: profileId },
        }],
        where: { id: jobId }
    });

    if (!job) return { success: false, status: 404, message: 'Job not found' };

    if (job.price > balance) return { success: false, status: 400, message: 'Insufficient funds' };

    const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } });

    if (!contractor) return { success: false, status: 404, message: 'Contractor not found' };

    const debitBalance = parseFloat(balance) - parseFloat(job.price);
    const creditBalance = parseFloat(contractor.balance) + parseFloat(job.price);

    await Promise.all([
        profilesService.updateBalance(profileId, debitBalance.toFixed(2)),
        profilesService.updateBalance(contractor.id, creditBalance.toFixed(2)),
        updatePaid(jobId, moment().valueOf(), true)
    ]);

    return { success: true };
};

module.exports = { listUnpaidJobs, pay };