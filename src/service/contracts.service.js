const { sequelize } = require('../model');
const { Op } = require("sequelize");

const { Contract } = sequelize.models;

const findById = async (id, profileId) => {
    const contract = await Contract.findOne({
        where: {
            id,
            [Op.or]: [
                { clientId: profileId },
                { contractorId: profileId },
            ]
        }
    });
    return contract;
};

const listAll = async (profileId) => {
    const contracts = await Contract.findAll({
        where: {
            status: ['new', 'in_progress'],
            [Op.or]: [
                { clientId: profileId },
                { contractorId: profileId },
            ]
        }
    });
    return contracts;
};

module.exports = { findById, listAll };
