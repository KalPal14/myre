import { IPage } from './page.entity.interface';

export class Page implements IPage {
	constructor(
		private _userId: number,
		private _url: string,
		private _highlights: number[] = []
	) {}

	get userId(): number {
		return this._userId;
	}
	get url(): string {
		return this._url;
	}
	get highlights(): number[] {
		return this._highlights;
	}

	getData(): IPage {
		return {
			userId: this.userId,
			url: this.url,
			highlights: this.highlights,
		};
	}
}
