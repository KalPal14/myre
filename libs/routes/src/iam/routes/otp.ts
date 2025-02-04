const IAM_URL = process.env.IAM_URL ?? '';

export const OTP_BASE_ROUTE = `/otp`;

export const OTP_ENDPOINTS = {
	upsert: `/upsert`,
	validate: '/validate',
};

export const OTP_URLS = {
	upsert: `${IAM_URL}${OTP_BASE_ROUTE}/upsert`,
	validate: `${IAM_URL}${OTP_BASE_ROUTE}/validate`,
};
