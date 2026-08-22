import { sqlFirewall } from '../../src/utilities/sql/sqlFirewall';

describe('sqlFirewall', () => {

	describe('when given a valid read query', () => {
		it('should accept a simple select query', () => {
			const result = sqlFirewall('SELECT * FROM users');
			expect(result.valid).toBe(true);
			expect(result.error).toBe(null);
		});

		it('should accept a select query with different casing', () => {
			const result = sqlFirewall('select train_number from schedule');
			expect(result.valid).toBe(true);
		});

		it('should accept a select query with joins and where clauses', () => {
			const result = sqlFirewall(
				"SELECT t.* FROM trains t JOIN types ty ON t.type_id = ty.id WHERE t.number = '1111'",
			);
			expect(result.valid).toBe(true);
		});
	});

	describe('when given a write query', () => {
		it('should return an error for an insert query', () => {
			const result = sqlFirewall("INSERT INTO trains (number) VALUES ('1111')");
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Incorrect SQL statement.');
		});

		it('should return an error for an update query', () => {
			const result = sqlFirewall("UPDATE trains SET number = '2222'");
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Incorrect SQL statement.');
		});

		it('should return an error for a delete query', () => {
			const result = sqlFirewall('DELETE FROM trains');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Incorrect SQL statement.');
		});
	});

	describe('when given a destructive or invalid query', () => {
		it('should return an error for a drop statement', () => {
			const result = sqlFirewall('DROP TABLE trains');
			expect(result.valid).toBe(false);
		});

		it('should return an error when a select is chained with a write statement', () => {
			const result = sqlFirewall("SELECT * FROM trains; DELETE FROM trains");
			expect(result.valid).toBe(false);
		});

		it('should return an error for a syntactically broken query', () => {
			const result = sqlFirewall('SELECT * FROMM users');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Incorrect SQL statement.');
		});
	});
});
