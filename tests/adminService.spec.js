const { seed, clear } = require('./seed');
const { findBestClients, findBestProfession } = require('../src/service/admin.service');

describe('Admin service', () => {
    beforeAll(async () => {
        await seed();
    });

    afterAll(async () => {
        await clear();
    });

    describe('best profession', () => {
        it('should find best profession', async () => {
            const { success, result } = await findBestProfession(new Date('2020-08-01'), new Date('2020-08-31'));
            expect(success).toBe(true);
            expect(result).toBe('Programmer');
        });

        it('should not find best profession', async () => {
            const { success, status, message } = await findBestProfession(new Date('2020-07-01'), new Date('2020-07-31'));
            expect(success).toBe(false);
            expect(status).toBe(404);
            expect(message).toBe('No data found');
        });
    });

    describe('best clients', () => {
        it('with a valid date range and limit lesser or equal to the result, should find best clients', async () => {
            const { success, result } = await findBestClients(new Date('2020-08-01'), new Date('2020-08-31'), 3);

            expect(success).toBe(true);
            expect(result.length).toBeLessThanOrEqual(3);

            expect(result[0].id).toBe(4);
            expect(result[0].fullName).toBe('Ash Kethcum');
            expect(parseFloat(result[0].paid)).toBe(2020.00);

            expect(result[1].id).toBe(1);
            expect(result[1].fullName).toBe('Harry Potter');
            expect(parseFloat(result[1].paid)).toBe(442.00);

            expect(result[2].id).toBe(2);
            expect(result[2].fullName).toBe('Mr Robot');
            expect(parseFloat(result[2].paid)).toBe(442.00);
        });

        it('with a valid date range and limit greater than the result, should find best clients', async () => {
            const { success, result } = await findBestClients(new Date('2020-08-10'), new Date('2020-08-11'), 3);

            expect(success).toBe(true);
            expect(result.length).toBeLessThanOrEqual(3);

            expect(result[0].id).toBe(1);
            expect(result[0].fullName).toBe('Harry Potter');
            expect(parseFloat(result[0].paid)).toBe(21.00);
        });

        it('with invalid date range, should not find best clients', async () => {
            const { success, status, message } = await findBestClients(new Date('2077-08-01'), new Date('2077-08-31'), 3);
            expect(success).toBe(false);
            expect(status).toBe(404);
            expect(message).toBe('No data found');
        });
    });
});