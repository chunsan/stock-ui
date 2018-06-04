const findNode = (id, root) => {
	if (root.value === id) {
		return root;
	}

	if (!root.children || root.children.length === 0) {
		return null;
	}

	for (const child of root.children) {
		const ret = findNode(id, child);
		if (ret) {
			return ret;
		}
	}
};

const findChildren = (id, root) => {
	const node = findNode(id, root);
	if (node) {
		return node.children;
	}
};

const expandChildren = (node) => {
	if (!node.children || node.children.length === 0) {
		return node;
	}
	let result = [node];
	node.children.every((child) => {
		const c = expandChildren(child);
		if (c) {
			result = result.concat(c);
		}
		return true;
	});
	return result;
};

const findChildrenExpand = (id, root) => {
	let children;
	for (const child of root) {
		const tmp = findChildren(id, child);
		if (tmp && tmp.length > 0) {
			children = tmp;
			break;
		}
	}
	if (!children) {
		return;
	}
	let result = children;
	children.every((child) => {
		const c = expandChildren(child);
		if (c) {
			result = result.concat(c);
		}
		return true;
	});

	return [...new Set(result)];
};

export { findChildrenExpand };
