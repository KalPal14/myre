import { injectable } from 'inversify';

export interface IMailData {
	subject: string;
	to: string | string[];
	text: string;
	html: string;
}

@injectable()
export abstract class MailerService {
	abstract sendMail(mailData: IMailData): Promise<string | null>;
}
