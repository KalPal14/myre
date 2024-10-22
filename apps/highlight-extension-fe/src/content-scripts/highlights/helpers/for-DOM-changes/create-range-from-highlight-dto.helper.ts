import findElementsByInitialText from '../to-receive-DOM-data/find-elements-by-initial-text.helper';
import findElementsByText from '../to-receive-DOM-data/find-elements-by-text.helper';

import INodeRangeInfo from '~/highlight-extension-fe/common/types/node-range-info.interface';
import IBaseHighlightDto from '~/highlight-extension-fe/common/types/dto/highlights/base/base-highlight.interface';

export default function createRangeFromHighlightDto(highlight: IBaseHighlightDto): Range {
	const startContainerPerent = findElementsByInitialText(highlight.startContainer.text)[
		highlight.startContainer.indexNumber
	];
	const endContainerPerent = findElementsByInitialText(highlight.endContainer.text)[
		highlight.endContainer.indexNumber
	];

	const [startContainer, startOffsetReducer] = getContainerAndOffsetReducer(
		startContainerPerent,
		highlight.startOffset,
		highlight.startContainer
	);
	const [endContainer, endOffsetReducer] = getContainerAndOffsetReducer(
		endContainerPerent,
		highlight.endOffset,
		highlight.endContainer
	);

	if (!startContainer || !endContainer) {
		throw new Error('Highlight is not defind');
	}

	const newRange = new Range();
	newRange.setStart(startContainer, highlight.startOffset - startOffsetReducer);
	newRange.setEnd(endContainer, highlight.endOffset - endOffsetReducer);

	return newRange;
}

function getContainerAndOffsetReducer(
	perent: Element | null,
	offset: number,
	containerInfo: INodeRangeInfo
): [Node | null, number] {
	if (perent) {
		return findContainerAndOffsetReducer(perent, offset);
	}

	const sameToContainerPerent = findElementsByText(containerInfo.text);
	const containerPerent = sameToContainerPerent[containerInfo.indexNumber];
	return findContainerAndOffsetReducer(containerPerent, offset);
}

function findContainerAndOffsetReducer(
	element: Element,
	initialOffset: number
): [Node | null, number] {
	let container: Node | null = null;
	let offsetReducer = 0;

	find(element);

	function find(node: Node): void {
		if (container) return;
		if (node.nodeType === Node.TEXT_NODE) {
			if (!node.textContent) return;
			if (node.textContent.length < initialOffset - offsetReducer) {
				offsetReducer = offsetReducer + node.textContent.length;
				return;
			}
			container = node;
			return;
		}
		const childNodes = node.childNodes;
		for (let i = 0; i < childNodes.length; i++) {
			const childNode = childNodes.item(i);
			find(childNode);
		}
	}

	return [container, offsetReducer];
}
