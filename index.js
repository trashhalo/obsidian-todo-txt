import { Plugin, TextFileView, MarkdownSourceView } from 'obsidian';
import simple from './simple';

export const VIEW_TYPE_TODOTXT_SOURCE = 'trashhalo.obsidian-plugin-todotxt-source';

const replaceUnderscore = (text) => {
	return text.replace(/[_-]/g, " ");
}

class TodoTxtView extends TextFileView {
	constructor(leaf, app) {
		super(leaf);
		this.app = app;
		this.suggests = {
			isShowingSuggestion() {
				return false;
			}
		}
		this.view = this;
		this.render();
	}

	getViewData() {
		return MarkdownSourceView.prototype.get.call(this);
	}

	setViewData(data, clear) {
		return MarkdownSourceView.prototype.set.call(this, data, clear);
	}

	getViewType() {
		return VIEW_TYPE_TODOTXT_SOURCE;
	}

	getDisplayText() {
		return this.file ? this.file.name : 'Todotxt';
	}

	getIcon() {
		return 'checkmark';
	}

	onClose() {
		return Promise.resolve();
	}

	render() {
		const container = this.containerEl.children[1];
		container.empty();
		const editorEl = this.editorEl = container.createDiv("markdown-source-view mod-cm5");
		const cm = this.cmEditor = window.CodeMirror(editorEl, {
			mode: "todotxt",
			theme: "obsidian",
			lineWrapping: true,
			styleActiveLine: true,
			configureMouse: function (e, t, n) {
				return {
					addNew: n.altKey && !n.ctrlKey && !n.metaKey
				}
			}
		});
		cm.on("changes", () => this.requestSave());
		editorEl.addEventListener("mousedown", this.onCodeMirrorMousedown.bind(this));
		MarkdownSourceView.prototype.updateOptions.call(this);
		setTimeout(() => {
			cm.refresh();
		});
	}

	passIfNoSuggestion() {

	}

	canAcceptExtension(ext) {
		return ext == "txt";
	}

	onCodeMirrorMousedown(e) {
		return MarkdownSourceView.prototype.onCodeMirrorMousedown.call(this, e);
	}

	triggerClickableTokenAt(e, t) {
		return MarkdownSourceView.prototype.triggerClickableTokenAt.call(this, e, t);
	}

	getClickableTokenAt(e) {
		const cm = this.cmEditor
			, token = cm.getTokenAt(e, !0)
			, tokenType = token.type;
		if (tokenType) {
			if (token.string.startsWith("@")) {
				return {
					type: "tag",
					text: `#${token.string.substring(1)}`
				};
			} else if (token.string.startsWith("+")) {
				const link = replaceUnderscore(token.string.substring(1));
				console.log(link);
				return {
					type: "internal-link",
					text: link
				};
			}
			return null
		}
	}

	getMousePosition(e) {
		return MarkdownSourceView.prototype.getMousePosition.call(this, e);
	}

	onFileOpen(e) {
		return MarkdownSourceView.prototype.onFileOpen.call(this, e);
	}
}

export default class TodoTxtPlugin extends Plugin {
	async onload() {
		const cm = window.CodeMirror;
		simple(cm);
		cm.defineSimpleMode("todotxt", {
			start: [{ regex: /[0-9]{4}-[0-9]{2}-[0-9]{2}/, token: "number" },
			{ regex: /\@\w+/, token: "keyword" },
			{ regex: /\+\w+/, token: "tag" },
			{ regex: /\([A-Z]\)/, token: "def" }]
		});
		this.registerView(VIEW_TYPE_TODOTXT_SOURCE, (leaf) => {
			return new TodoTxtView(leaf, this.app);
		});
		this.registerExtensions(['txt'], VIEW_TYPE_TODOTXT_SOURCE);
	}
}
