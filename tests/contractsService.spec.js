const { seed, clear } = require('./seed');
const { findById, listAll } = require('../src/service/contracts.service');

describe('Contracts service', () => {
    beforeAll(async () => {
        await seed();
    });

    afterAll(async () => {
        await clear();
    });

    describe('find by id', () => {
        it('with a valid profileId and contractId, should find the contract', async () => {
            const contract = await findById(3, 2);
            expect(contract).toBeDefined();
            expect(contract.id).toBe(3);
            expect(contract.terms).toBe('bla bla bla');
            expect(contract.status).toBe('in_progress');
            expect(contract.ClientId).toBe(2);
            expect(contract.ContractorId).toBe(6);
        });

        it('with an invalid profileId, should not find the contract', async () => {
            const contract = await findById(3, 1);
            expect(contract).toBeNull();
        });

        it('with an invalid contractId, should not find the contract', async () => {
            const contract = await findById(1, 2);
            expect(contract).toBeNull();
        });
    });

    describe('list all', () => {
        it('with a valid profileId, should list all contracts for the current profile', async () => {
            const contracts = await listAll(2);
            expect(contracts.length).toBe(2);

            expect(contracts[0].id).toBe(3);
            expect(contracts[0].terms).toBe('bla bla bla');
            expect(contracts[0].status).toBe('in_progress');
            expect(contracts[0].ClientId).toBe(2);
            expect(contracts[0].ContractorId).toBe(6);

            expect(contracts[1].id).toBe(4);
            expect(contracts[1].terms).toBe('bla bla bla');
            expect(contracts[1].status).toBe('in_progress');
            expect(contracts[1].ClientId).toBe(2);
            expect(contracts[1].ContractorId).toBe(7);
        });

        it('with an invalid profileId, should not list any contract', async () => {
            const contracts = await listAll(999);
            expect(contracts.length).toBe(0);
        });
    });
});