export const sqlFirewall = (ast: any) => {
	
	// Malicious query check
	if (ast.length !== 1 && ast[0].type !== 'select') {
		return { valid: false, error: 'Incorrect SQL statement.' };
	}

	return { valid: true, error: null };
};
