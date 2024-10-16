import { PageModel, WorkspaceModel } from '~/highlight-extension/prisma/client';

export interface IWorkspaceDeepModel extends WorkspaceModel {
	pages: PageModel[];
}
