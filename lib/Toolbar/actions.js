import { toggleButtonSelected, deselectAdjacentButtons, noneSelectedInGroup } from './helpers';
import { Alignment, Capitalization, Indentation, ListType } from 'roosterjs-editor-types';
import {
  toggleHeader,
  setFontSize,
  setTextColor,
  setBackgroundColor,
  clearFormat,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleSuperscript,
  toggleSubscript,
  changeCapitalization,
  setAlignment,
  toggleListType,
  setIndentation,
  toggleBlockQuote,
  toggleCodeBlock,
} from 'roosterjs-editor-api';

export default {
  select: {
    toggleHeader(e) {
      toggleHeader(this.editor, e.target.value);
    },

    setFontSize(e) {
      setFontSize(this.editor, e.target.value);
    },
  },

  button: {
    openTextColor(e) {
      document
        .querySelector('.text-color .barnyardjs-editor-toolbar__color-selector')
        .classList.remove('hidden');
    },

    openBackgroundColor(e) {
      document
        .querySelector('.background-color .barnyardjs-editor-toolbar__color-selector')
        .classList.remove('hidden');
    },

    capitalize(e) {
      changeCapitalization(this.editor, Capitalization.Uppercase);
    },

    lowercase(e) {
      changeCapitalization(this.editor, Capitalization.Lowercase);
    },

    bold(e) {
      toggleButtonSelected(e.target);
      toggleBold(this.editor);
    },

    italic(e) {
      toggleButtonSelected(e.target);
      toggleItalic(this.editor);
    },

    underline(e) {
      toggleButtonSelected(e.target);
      toggleUnderline(this.editor);
    },

    strikethrough(e) {
      toggleButtonSelected(e.target);
      toggleStrikethrough(this.editor);
    },

    alignLeft(e) {
      deselectAdjacentButtons(e.target);
      toggleButtonSelected(e.target);
      setAlignment(this.editor, Alignment.Left);

      if (noneSelectedInGroup(e.target)) {
        setAlignment(this.editor, Alignment.Left);
      }
    },

    alignCenter(e) {
      deselectAdjacentButtons(e.target);
      toggleButtonSelected(e.target);
      setAlignment(this.editor, Alignment.Center);

      if (noneSelectedInGroup(e.target)) {
        setAlignment(this.editor, Alignment.Left);
      }
    },

    alignRight(e) {
      deselectAdjacentButtons(e.target);
      toggleButtonSelected(e.target);
      setAlignment(this.editor, Alignment.Right);

      if (noneSelectedInGroup(e.target)) {
        setAlignment(this.editor, Alignment.Left);
      }
    },

    orderedList(e) {
      toggleListType(this.editor, ListType.Ordered);
    },

    unorderedList(e) {
      toggleListType(this.editor, ListType.Unordered);
    },

    increaseIndent(e) {
      setIndentation(this.editor, Indentation.Increase);
    },

    decreaseIndent(e) {
      setIndentation(this.editor, Indentation.Decrease);
    },

    blockQuote(e) {
      toggleBlockQuote(this.editor);
    },

    codeBlock(e) {
      toggleCodeBlock(this.editor);
    },

    superscript(e) {
      deselectAdjacentButtons(e.target);
      toggleButtonSelected(e.target);
      toggleSuperscript(this.editor);
    },

    subscript(e) {
      deselectAdjacentButtons(e.target);
      toggleButtonSelected(e.target);
      toggleSubscript(this.editor);
    },

    undo(e) {
      this.editor.undo();
    },

    redo(e) {
      this.editor.redo();
    },

    clearFormatting() {
      document.querySelector('.text-color .colored i').style.borderColor = 'black';
      document.querySelector('.background-color .colored i').style.borderColor = 'white';

      setTextColor(this.editor, '#000000');
      setBackgroundColor(this.editor, '#ffffff');
      clearFormat(this.editor);
    },

    fullscreen(e, val) {
      let setFullscreen = Boolean(parseInt(val));

      if (setFullscreen) {
        document.getElementById(this.editorDivId).classList.add('fullscreen');
      } else {
        document.getElementById(this.editorDivId).classList.remove('fullscreen');
      }
    },
  },

  colorInput: {
    setTextColor(e) {
      setTextColor(this.editor, e.target.value);
      document.querySelector('.text-color .colored i').style.borderColor = e.target.value;
    },

    setBackgroundColor(e) {
      setBackgroundColor(this.editor, e.target.value);
      document.querySelector('.background-color .colored i').style.borderColor = e.target.value;
    },
  },
};
