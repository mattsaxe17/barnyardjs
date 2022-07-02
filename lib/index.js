import { createEditor } from 'roosterjs';
import { createHash, wrapElements } from './helpers';
import './style/index.scss';

import MainPlugin from './plugins/main.js';
import ToolbarPlugin from './plugins/Toolbar';
import TagsPlugin from './plugins/Tags';

window.createEditor = (editorDivId, options) => {
  const uniqueHash = 'barnyard_' + createHash();
  document.getElementById(editorDivId).setAttribute(uniqueHash, '');

  options = {
    ...options,
    toolbar: options?.toolbar || {},
    tags: options?.tags || {},
  };

  let main = new MainPlugin();
  let toolbar = new ToolbarPlugin({ editorDivId, uniqueHash, ...options.toolbar });
  let tags = new TagsPlugin({ editorDivId, uniqueHash, ...options.tags });

  return createEditor(document.getElementById(editorDivId), [main, toolbar, tags]);
};
