import { sqlParser } from '../../src/utilities/sqlParser';

describe('sqlParser', () => {
	describe('when given an invalid query', () => {
		it('should return an error for an invalid query', () => {
			const result = sqlParser('invalid query', 'user text');
			expect(result).toEqual({ valid: false, error: 'SQL statement is empty.', ast: null });
		});

		it('should return an error for an empty query', () => {
			const result = sqlParser('', 'user text');
			expect(result).toEqual({ valid: false, error: 'SQL statement is empty.', ast: null });
		});
	});

	describe('when given a valid query', () => {
		it('should validate a correct SQL statement', () => {
			const result = sqlParser('SELECT * FROM users', 'user text');
			expect(result).toEqual({ valid: true, error: null, ast: expect.anything() });
		});

		it('should validate a correct SQL statement with extra whitespace', () => {
			const result = sqlParser('   SELECT * FROM users   ', 'user text');
			expect(result).toEqual({ valid: true, error: null, ast: expect.anything() });
		});

		it('should validate a correct SQL statement with different casing', () => {
			const result = sqlParser('select * from users', 'user text');
			expect(result).toEqual({ valid: true, error: null, ast: expect.anything() });
		});
	});

	it('should return error for typo SQL', () => {
		const result = sqlParser('SELECT * FROMM users', 'user text')
		expect(result).toEqual({ valid: false, error: expect.anything(), ast: null });
	});
});
