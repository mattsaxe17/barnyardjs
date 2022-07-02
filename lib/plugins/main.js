export default class MainPlugin {
  getName() {
    return 'MainPlugin';
  }

  initialize(editor) {
    this.editor = editor;
    this.editor.getContent = this.getContent.bind(this);
  }

  dispose() {
    this.editor = null;
  }

  // Gets the editor's content
  getContent() {
    return this.editor?.core?.contentDiv?.children[0]?.innerHTML;
  }
}