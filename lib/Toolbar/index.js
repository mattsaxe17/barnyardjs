import { Editor } from 'roosterjs-editor-core';
import { PluginEvent, EditorPlugin } from 'roosterjs-editor-types';
import toolbarHtml from './toolbar.html';
import actions from './actions';
import { getAncestors, hideOtherButtonExteders } from './helpers';
import './style.scss';

export default class ToolbarPlugin {
  constructor(options) {
    this.editorDivId = options.editorDivId;
    this.uniqueHash = options.uniqueHash;
  }

  getName() {
    return 'MentionsPlugin';
  }

  initialize(editor) {
    this.editor = editor;

    this.wrapEditor();

    this.setSelectActions();
    this.setButtonActions();
    this.setColorSelectorActions();

    this.setGlobalClickListener();
  }

  dispose() {
    this.editor = null;
  }

  setGlobalClickListener() {
    document.body.addEventListener('click', e => {
      hideOtherButtonExteders(e.target);
    });
  }

  setSelectActions() {
    document
      .querySelectorAll(`.barnyardjs-editor-toolbar[${this.uniqueHash}] select`)
      .forEach(select => {
        select.onchange = e => {
          actions.select[e.target.dataset.action].call(this, e);
        };
      });
  }

  setButtonActions() {
    document
      .querySelectorAll(`.barnyardjs-editor-toolbar[${this.uniqueHash}] button`)
      .forEach(button => {
        button.onclick = e => {
          let action = e.target.dataset.action || e.target.parentElement.dataset.action;
          let actionValue =
            e.target.dataset.actionValue || e.target.parentElement.dataset.actionValue;

          actions.button[action].call(this, e, actionValue);
        };
      });
  }

  setColorSelectorActions() {
    document
      .querySelectorAll(`.barnyardjs-editor-toolbar[${this.uniqueHash}] input[type="color"]`)
      .forEach(input => {
        input.onchange = e => {
          actions.colorInput[e.target.dataset.action].call(this, e);
        };
      });
  }

  wrapEditor() {
    let el = document.getElementById(this.editorDivId);
    let elWrapper = document.createElement('div');
    let wrapper = document.createElement('div');
    let toolbar = document.createElement('div');

    toolbar.innerHTML = toolbarHtml;
    toolbar.classList.add('barnyardjs-editor-toolbar');
    toolbar.setAttribute(this.uniqueHash, '');

    let elClassList = el.classList;
    el.classList.add('barnyardjs-editor');
    el.removeAttribute('id');

    elWrapper.classList.add('barnyardjs-editor__inner-wrapper');

    wrapper.id = this.editorDivId;
    wrapper.classList = elClassList;
    wrapper.classList.add('barnyardjs-editor-wrapper');
    wrapper.classList.remove('barnyardjs-editor');
    wrapper.setAttribute(this.uniqueHash, '');

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(elWrapper);
    elWrapper.appendChild(el);
  }
}
