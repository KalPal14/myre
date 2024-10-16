import { injectable } from 'inversify';

import { Workspace } from '../workspace';

import { IWorkspaceFactory, IWorkspaceFactoryCreateArgs } from './workspace-factory.interface';

@injectable()
export class WorkspaceFactory implements IWorkspaceFactory {
	create({ ownerId, name, colors }: IWorkspaceFactoryCreateArgs): Workspace {
		const workspace = new Workspace(ownerId, name, colors);
		return workspace;
	}
}
