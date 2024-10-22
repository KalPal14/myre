import IBaseHighlightDto from '~/highlight-extension-fe/common/types/dto/highlights/base/base-highlight.interface';

export default interface IChangeHighlightForm {
	highlights: {
		highlight: IBaseHighlightDto;
	}[];
}
