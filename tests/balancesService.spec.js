const { seed, clear } = require('./seed');
const { deposit } = require('../src/service/balances.service');

describe('Balances Service', () => {
    beforeAll(async () => {
        await seed();
    });

    afterAll(async () => {
        await clear();
    });

    it('with invalid profileId, should not find any job', async () => {
        const result = await deposit(100, 200, 999);
        expect(result.success).toBe(false);
        expect(result.status).toBe(404);
        expect(result.message).toBe('Jobs not found');
    });

    it('with valid profileId but greater than maximum allowed amount, should return the error message', async () => {
        const result = await deposit(10000, 200, 2);
        expect(result.success).toBe(false);
        expect(result.status).toBe(400);
        expect(result.message).toBe('The amount should be lesser or equal to $100.50 of total jobs to pay');
    });

    it('with valid profileId and amount, should return the new balance', async () => {
        const result = await deposit(50, 200, 2);
        expect(result.success).toBe(true);
        expect(result.message).toBe('Deposit successful');
        expect(result.result.newBalance).toBe(250);
    });
});