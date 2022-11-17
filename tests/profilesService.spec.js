const { seed, clear } = require('./seed');
const { findClientById, listClients, listContractors, updateBalance } = require('../src/service/profiles.service');

describe('Profiles Service', () => {
    beforeAll(async () => {
        await seed();
    });

    afterAll(async () => {
        await clear();
    });

    it('should find all clients', async () => {
        const clients = await listClients();
        expect(clients.length).toBe(4);
    });

    it('should find all contractors', async () => {
        const contractors = await listContractors();
        expect(contractors.length).toBe(4);
    });

    describe('find client by id', () => {
        it('with a client id, should return the client', async () => {
            const client = await findClientById(1);
            expect(client.type).toBe('client');
            expect(client.firstName).toBe('Harry');
            expect(client.lastName).toBe('Potter');
            expect(client.balance).toBe(1150);
        });

        it('with a contractor id, should return null', async () => {
            const client = await findClientById(7);
            expect(client).toBeNull();
        });

        it('with an invalid id, should return null', async () => {
            const client = await findClientById(999);
            expect(client).toBeNull();
        });
    });

    it('should update balance', async () => {
        let client = await findClientById(1);
        expect(client.balance).toBe(1150);
        await updateBalance(1, 100);
        client = await findClientById(1);
        expect(client.balance).toBe(100);
    });
});