import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';
import { injectable } from 'inversify';

import { IMailData, MailerService } from '../../port/mailer.service';

@injectable()
export class EtherealNodemailerService extends MailerService {
	async sendMail(mailData: IMailData): Promise<string | null> {
		const fakeAcc = await createTestAccount();
		const transporter = createTransport({
			host: fakeAcc.smtp.host,
			port: fakeAcc.smtp.port,
			secure: fakeAcc.smtp.secure,
			auth: {
				user: fakeAcc.user,
				pass: fakeAcc.pass,
			},
		});

		const info = await transporter.sendMail({
			from: fakeAcc.user,
			to: mailData.to,
			subject: mailData.subject,
			text: mailData.text,
			html: mailData.html,
		});
		const testMessageUrl = getTestMessageUrl(info);
		if (!testMessageUrl) return null;
		return testMessageUrl;
	}
}
