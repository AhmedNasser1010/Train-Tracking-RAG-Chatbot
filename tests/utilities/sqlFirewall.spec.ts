import { sqlFirewall } from '../../src/utilities/sqlFirewall';

describe('sqlFirewall', () => {
	
	it('when given a valid select query', () => {
		const ast = { type: 'select' }
		const result = sqlFirewall(ast);
		expect(result).toEqual({ valid: true, error: null });
	});

  describe('when given a write query', () => {
		it('should return an error for an insert query', () => {
      const ast = { type: 'insert' };
			const result = sqlFirewall(ast);
			expect(result).toEqual({ valid: false, error: 'Incorrect SQL statement.' });
		});

		it('should return an error for an update query', () => {
      const ast = { type: 'update' };
			const result = sqlFirewall(ast);
			expect(result).toEqual({ valid: false, error: 'Incorrect SQL statement.' });
		});

		it('should return an error for a delete query', () => {
      const ast = { type: 'delete' };
			const result = sqlFirewall(ast);
			expect(result).toEqual({ valid: false, error: 'Incorrect SQL statement.' });
		});
	});
})