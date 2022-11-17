const { seed, clear } = require('./seed');
const { listUnpaidJobs, pay } = require('../src/service/jobs.service');

describe('Jobs Service', () => {
    beforeAll(async () => {
        await seed();
    });

    afterAll(async () => {
        await clear();
    });

    describe('list unpaid jobs', () => {
        it('with a valid profileId, that has unpaid jobs, should list all unpaid jobs for the current profile', async () => {
            const jobs = await listUnpaidJobs(4);
            expect(jobs.length).toBe(1);

            expect(jobs[0].id).toBe(5);
            expect(jobs[0].description).toBe('work');
            expect(jobs[0].price).toBe(200);
            expect(jobs[0].paid).toBeNull();
            expect(jobs[0].paymentDate).toBeNull();
            expect(jobs[0].ContractId).toBe(7);
            expect(jobs[0].Contract.id).toBe(7);
            expect(jobs[0].Contract.status).toBe('in_progress');
            expect(jobs[0].Contract.ClientId).toBe(4);
            expect(jobs[0].Contract.ContractorId).toBe(7);
        });

        it('with a valid profileId, that has no unpaid jobs, should return an empty array', async () => {
            const jobs = await listUnpaidJobs(5);
            expect(jobs.length).toBe(0);
        });

        it('with an invalid profileId, should return an empty array', async () => {
            const jobs = await listUnpaidJobs(999);
            expect(jobs.length).toBe(0);
        });
    });

    describe('pay', () => {
        it('with a valid jobId but invalid profileId, should not find a job', async () => {
            const result = await pay(5, 20000, 999);
            expect(result.success).toBe(false);
            expect(result.status).toBe(404);
            expect(result.message).toBe('Job not found');
        });

        it('with an invalid jobId but valid profileId, should not find a job', async () => {
            const result = await pay(999, 20000, 2);
            expect(result.success).toBe(false);
            expect(result.status).toBe(404);
            expect(result.message).toBe('Job not found');
        });

        it('with a valid jobId and profileId, but insufficient funds, should return insufficient funds', async () => {
            const result = await pay(3, 0, 2);
            expect(result.success).toBe(false);
            expect(result.status).toBe(400);
            expect(result.message).toBe('Insufficient funds');
        });

        it('with a valid jobId and profileId, and sufficient funds, should pay the job', async () => {
            const jobs = await listUnpaidJobs(2);
            expect(jobs.length).toBe(2);

            const result = await pay(3, 231.11, 2);
            expect(result.success).toBe(true);

            const updatedJobs = await listUnpaidJobs(2);
            expect(updatedJobs.length).toBe(1);
        });
    });
});