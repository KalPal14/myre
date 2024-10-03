import { Request, Response, NextFunction } from 'express';

export type TController<
	Params extends Record<string, string> | null = Record<string, string>,
	ReqBody extends Record<string, any> | null = Record<string, any>,
	ReqQuery extends Record<string, any> | null = Record<string, any>,
> = (
	req: Request<Params, Record<string, any>, ReqBody, ReqQuery>,
	res: Response<Record<string, any>>,
	next: NextFunction
) => Promise<void>;
