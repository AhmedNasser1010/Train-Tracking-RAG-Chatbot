jest.mock('../../src/utilities/sql/executeSql', () => ({
	executeSql: jest.fn(async () => []),
}));

import { sqlParser } from '../../src/utilities/sql/sqlParser';

const c = { env: {} };

describe('sqlParser', () => {
	describe('when given an invalid query', () => {
		it('should return an error for an invalid query', async () => {
			const result = await sqlParser(c, 'invalid query', 'user text');
			expect(result).toEqual({ valid: false, error: 'SQL statement is empty.' });
		});

		it('should return an error for an empty query', async () => {
			const result = await sqlParser(c, '', 'user text');
			expect(result).toEqual({ valid: false, error: 'SQL statement is empty.' });
		});
	});

	describe('when given a valid read query', () => {
		it('should validate a correct SQL statement', async () => {
			const result = await sqlParser(c, 'SELECT * FROM users', 'user text');
			expect(result).toEqual({ valid: true, error: null });
		});

		it('should validate a correct SQL statement with extra whitespace', async () => {
			const result = await sqlParser(c, '   SELECT * FROM users   ', 'user text');
			expect(result).toEqual({ valid: true, error: null });
		});

		it('should validate a correct SQL statement with different casing', async () => {
			const result = await sqlParser(c, 'select * from users', 'user text');
			expect(result).toEqual({ valid: true, error: null });
		});
	});

	describe('when given an unsafe query', () => {
		it('should return error for typo SQL', async () => {
			const result = await sqlParser(c, 'SELECT * FROMM users', 'user text');
			expect(result.valid).toBe(false);
			expect(result.error).toEqual(expect.anything());
		});

		it('should reject write statements before touching the database', async () => {
			const result = await sqlParser(c, 'DELETE FROM users', 'user text');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Incorrect SQL statement.');
		});

		it('should reject injection attempts', async () => {
			const result: any = await sqlParser(c, "SELECT * FROM users; DROP TABLE users--", 'user text');
			expect(result.valid).toBe(false);
			expect(result.isInjection).toBe(true);
		});
	});
});
