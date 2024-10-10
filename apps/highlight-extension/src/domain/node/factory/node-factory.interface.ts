import { Node } from '../node';

export interface INodeFactory {
	create: (nodeData: Node) => Node;
}
