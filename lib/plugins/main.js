export default class MainPlugin {
  getName() {
    return 'MainPlugin';
  }

  initialize(editor) {
    this.editor = editor;
    this.editor.getHtmlContent = this.getHtmlContent.bind(this);
  }

  dispose() {
    this.editor = null;
  }

  // Gets the editor's content
  getHtmlContent() {
    return this.editor?.core?.contentDiv?.children[0]?.innerHTML ?? '';
  }
}