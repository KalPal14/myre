import IColor from '~/highlight-extension-fe/common/constants/default-values/types/color.interface';

export default interface IBaseUserDto {
	id: number;
	email: string;
	username: string;
	passwordUpdatedAt: string | null;
	colors: IColor[];
}
