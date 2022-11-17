const { sequelize } = require('../model');

const { Profile } = sequelize.models;

const updateBalance = async (id, balance) => {
    await Profile.update(
        { balance },
        { where: { id } }
    );
};

const listContractors = async () => {
    const contractors = await Profile.findAll({
        where: { type: 'contractor' }
    });
    return contractors;
};

const listClients = async () => {
    const clients = await Profile.findAll({
        where: { type: 'client' }
    });
    return clients;
};

const findClientById = async (id) => {
    const client = await Profile.findOne({
        where: { id, type: 'client' }
    });
    return client;
};

module.exports = { findClientById, listClients, listContractors, updateBalance };