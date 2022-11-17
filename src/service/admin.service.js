const { sequelize } = require('../model');
const { Op } = require("sequelize");

const { Contract, Job } = sequelize.models;

const profilesService = require('../service/profiles.service');

const findBestProfession = async (start, end) => {
    const contractors = await profilesService.listContractors();
    const map = {};

    for (const contractor of contractors) {
        const jobs = await Job.findAll({
            include: [{
                model: Contract,
                where: {
                    contractorId: contractor.id
                }
            }],
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [start.valueOf(), end.valueOf()]
                }
            }
        });

        if (jobs?.length === 0) continue;

        const sum = jobs.reduce((acc, job) => parseFloat(acc) + parseFloat(job.price), 0);
        if (!map[contractor.profession]) {
            map[contractor.profession] = parseFloat(sum).toFixed(2);
        } else {
            const newSum = parseFloat(map[contractor.profession]) + parseFloat(sum);
            map[contractor.profession] = newSum.toFixed(2);
        }
    }

    if (Object.keys(map)?.length === 0) return { success: false, status: 404, message: 'No data found' };

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return { success: true, result: sorted[0][0] };
};

const findBestClients = async (start, end, limit) => {
    const clients = await profilesService.listClients();
    const map = {};

    for (const client of clients) {
        const jobs = await Job.findAll({
            include: [{
                model: Contract,
                where: {
                    clientId: client.id
                }
            }],
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [start.valueOf(), end.valueOf()]
                }
            }
        });

        if (jobs?.length === 0) continue;

        const sum = jobs.reduce((acc, job) => parseFloat(acc) + parseFloat(job.price), 0);
        map[client.id] = parseFloat(sum).toFixed(2);
    }

    if (Object.keys(map)?.length === 0) return { success: false, status: 404, message: 'No data found' };

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

    const bestClients = [];
    const length = limit > sorted.length ? sorted.length : limit;
    for (let i = 0; i < length; i++) {
        const client = await profilesService.findClientById(sorted[i][0]);
        if (!client) continue;

        bestClients.push({ id: client.id, fullName: `${client.firstName} ${client.lastName}`, paid: sorted[i][1] });
    }

    return { success: true, result: bestClients };
};

module.exports = { findBestProfession, findBestClients };