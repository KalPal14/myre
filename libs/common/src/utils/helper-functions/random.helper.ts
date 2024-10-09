const getNumber = (): string => Math.floor(Math.random() * 10000).toString();

export function random(): string {
	return getNumber() + getNumber() + getNumber() + getNumber() + getNumber();
}
