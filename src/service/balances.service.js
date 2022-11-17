const { sequelize } = require('../model');
const { Op } = require("sequelize");

const profilesService = require('./profiles.service');

const { Contract, Job } = sequelize.models;

const deposit = async (amount, balance, profileId) => {
    const jobs = await Job.findAll({
        include: [{
            model: Contract,
            where: {
                status: ['new', 'in_progress'],
                clientId: profileId,
            }
        }],
        where: {
            [Op.or]: [
                { paid: false },
                { paid: null },
            ]
        }
    });

    if (jobs?.length <= 0) return { success: false, status: 404, message: 'Jobs not found' };

    const total = jobs.reduce((acc, job) => acc + job.price, 0);
    const quarter = total / 4;

    if (amount > quarter) return { success: false, status: 400, message: `The amount should be lesser or equal to $${quarter.toFixed(2)} of total jobs to pay` };

    const newBalance = parseFloat(balance) + parseFloat(amount);
    await profilesService.updateBalance(profileId, newBalance.toFixed(2));

    return { success: true, message: 'Deposit successful', result: { newBalance } };
};

module.exports = { deposit };