import { createEditor } from 'roosterjs';
import { createHash, wrapElements } from './helpers';
import './style.scss';

import ToolbarPlugin from './Toolbar';
import TagsPlugin from './Tags';

window.createEditor = (editorDivId, options) => {
  const uniqueHash = 'barnyard_' + createHash();
  document.getElementById(editorDivId).setAttribute(uniqueHash, '');

  options = {
    ...options,
    toolbar: options?.toolbar || {},
    tags: options?.tags || {},
  };

  let toolbar = new ToolbarPlugin({ editorDivId, uniqueHash, ...options.toolbar });
  let tags = new TagsPlugin({ editorDivId, uniqueHash, ...options.tags });

  createEditor(document.getElementById(editorDivId), [toolbar, tags]);
};
