import { TEmail } from '@/common/types/email.type';

export function hideEmail(email: TEmail): TEmail {
	const [username, domain] = email.split('@');
	if (username.length > 3) {
		return `${username.slice(0, 3)}***@${domain}`;
	}
	return `${username}***@${domain}`;
}
