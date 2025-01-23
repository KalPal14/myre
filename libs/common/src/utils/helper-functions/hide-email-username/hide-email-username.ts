export function hideEmailUsername(email: string): string {
	const [username, domain] = email.split('@');
	if (username.length > 3) {
		return `${username.slice(0, 3)}***@${domain}`;
	}
	return `${username}***@${domain}`;
}
