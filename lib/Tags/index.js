import { Editor } from 'roosterjs-editor-core';
import { PluginEvent, EditorPlugin } from 'roosterjs-editor-types';

export default class {
  getName() {
    return 'TagsPlugin';
  }

  initialize(editor) {
    this.editor = editor;
  }

  dispose() {
    this.editor = null;
  }

  onPluginEvent(e) {
  }
}
