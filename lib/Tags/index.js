import { Editor } from 'roosterjs-editor-core';
import { GetContentMode } from 'roosterjs-editor-types';
import { findNearestTagCharacter, findFirstDifferent, filterValidTags, attachDropdown } from './helpers';

import './style.scss';

export default class {
  constructor(options) {
    this.editorDivId = options.editorDivId;
    this.uniqueHash = options.uniqueHash;
  }

  static validTagCharacters = '@#$*';

  getName() {
    return 'TagsPlugin';
  }

  initialize(editor) {
    this.editor = editor;

    this.previousContent = '';
    this.content = '';
    this.lastContentRetrieval = Date.now();
  }

  dispose() {
    this.editor = null;
  }

  onPluginEvent(e) {
    // Prevents getContent from calling itself and causing call stack size to be exceeded
    if (Date.now() - this.lastContentRetrieval > 5) {
      this.lastContentRetrieval = Date.now();

      this.previousContent = this.content;
      this.content = this.editor.getContent();
    }

    if (this.previousContent !== this.content) {
      let changePos = findFirstDifferent(this.previousContent, this.content);
      let tagChar = findNearestTagCharacter(this.content, 0, changePos + 1);
      let searchStr = this.content.substring(tagChar?.pos + 1, changePos + 1).trim();
      let filteredTags = filterValidTags(searchStr, mockData()[tagChar?.char]?.tags, mockData()[tagChar?.char]?.searchFields);

      attachDropdown.call(this, filteredTags, { searchStart: tagChar.pos, searchEnd: changePos });
    }
  }
}

function mockData() {
  return {
    '@': {
      allowSpaces: true,
      maxLength: 20,
      searchFields: ['label', 'color'],
      tags: [
        { label: 'Matthew Saxe', value: 0, color: 'green' },
        { label: 'Sam Saxe', value: 1, color: 'red' },
        { label: 'Joe Shmoe', value: 2, color: 'yellow' },
        { label: 'Big Dawg', value: 3, color: 'green' },
        { label: 'Bimbo', value: 4, color: 'purple' },
      ],
    },
    '#': {
      allowSpaces: false,
      maxLength: 15,
      searchFields: ['label'],
      tags: [
        { label: 'crypto', value: 0 },
        { label: 'fitness', value: 1 },
        { label: 'bitcoin', value: 2 },
        { label: 'financial freedom', value: 3 },
        { label: 'solana', value: 4 },
      ],
    },
  };
}
