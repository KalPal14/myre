import { injectable } from 'inversify';

import { Node } from '../node';

import { INodeFactory } from './node-factory.interface';

@injectable()
export class NodeFactory implements INodeFactory {
	create(nodeData: Node): Node {
		return new Node(nodeData.text, nodeData.indexNumber, nodeData.sameElementsAmount);
	}
}
