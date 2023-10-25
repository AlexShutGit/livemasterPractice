// https://developer.mozilla.org/ru/docs/Web/API/ChildNode/after
// Polyfill the after() method in Internet Explorer 9 and higher.
// ChildNode.after()
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('after')) {
			return;
		}
		Object.defineProperty(item, 'after', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function after() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});

				this.parentNode.insertBefore(docFrag, this.nextSibling);
			}
		});
	});
}([Element.prototype, CharacterData.prototype, DocumentType.prototype]));

// https://developer.mozilla.org/ru/docs/Web/API/ParentNode/prepend
// Polyfill the prepend() method in Internet Explorer 9 and higher.
// ParentNode.prepend()
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('prepend')) {
			return;
		}
		Object.defineProperty(item, 'prepend', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function prepend() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});

				this.insertBefore(docFrag, this.firstChild);
			}
		});
	});
}([Element.prototype, Document.prototype, DocumentFragment.prototype]));

// https://developer.mozilla.org/ru/docs/Web/API/ParentNode/append
// Polyfill the append() method in Internet Explorer 9 and higher.
// ParentNode.append()
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('append')) {
			return;
		}
		Object.defineProperty(item, 'append', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function append() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});

				this.appendChild(docFrag);
			}
		});
	});
}([Element.prototype, Document.prototype, DocumentFragment.prototype]));

// https://developer.mozilla.org/ru/docs/Web/API/ChildNode/before
// Polyfill the before() method in Internet Explorer 9 and higher.
// ChildNode.before()
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('before')) {
			return;
		}
		Object.defineProperty(item, 'before', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function before() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});

				this.parentNode.insertBefore(docFrag, this);
			}
		});
	});
}([Element.prototype, CharacterData.prototype, DocumentType.prototype]));

// https://developer.mozilla.org/ru/docs/Web/API/Element/closest
// Polyfill the closest() method in Internet Explorer 9 and higher.
// Element.closest()
(function(ELEMENT) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
	ELEMENT.closest = ELEMENT.closest || function closest(selector) {
		if (!this) {
			return null;
		}
		if (this.matches(selector)) {
			return this;
		}
		if (!this.parentElement) {
			return null;
		}
		return this.parentElement.closest(selector);
	};
}(Element.prototype));

// https://developer.mozilla.org/ru/docs/Web/API/ChildNode/remove
// Polyfill the remove() method in Internet Explorer 9 and higher.
// Node.remove()
(function() {
	var arr = [window.Element, window.CharacterData, window.DocumentType];
	var args = [];

	arr.forEach(function (item) {
		if (item) {
			args.push(item.prototype);
		}
	});

	// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
	(function (arr) {
		arr.forEach(function (item) {
			if (Object.prototype.hasOwnProperty.call(item, 'remove')) {
				return;
			}
			Object.defineProperty(item, 'remove', {
				configurable: true,
				enumerable: true,
				writable: true,
				value: function remove() {
					this.parentNode.removeChild(this);
				}
			});
		});
	}(args));
}());
