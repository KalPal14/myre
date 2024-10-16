import { Workspace } from '../workspace';

export interface IWorkspaceFactoryCreateArgs extends Omit<Workspace, 'colors'> {
	colors?: string[];
}

export interface IWorkspaceFactory {
	create: (workspaceData: IWorkspaceFactoryCreateArgs) => Workspace;
}
