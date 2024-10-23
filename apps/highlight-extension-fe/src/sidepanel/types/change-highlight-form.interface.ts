import { IBaseHighlightRo } from '~libs/ro/highlight-extension';

export default interface IChangeHighlightForm {
	highlights: {
		highlight: IBaseHighlightRo;
	}[];
}
