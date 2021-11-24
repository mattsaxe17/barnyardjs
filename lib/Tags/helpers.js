import { insertEntity } from 'roosterjs-editor-api';

// Returns a string suitable for checking against a tag array
function processString(str) {
  const exclude = ' &.,-_()<>';

  exclude.split('').forEach(char => {
    str = str.replaceAll(char, '');
  });

  return str.toUpperCase();
}

function addDropdownRowEventListener(item, searchRange) {
  item.onclick = (e) => {
    const tagNode = document.createElement('span');
    tagNode.classList.add('barnyardjs-editor-tag');
    tagNode.innerText = this.content[searchRange.searchStart] + e.target.innerText;

    insertEntity(this.editor, 'tag', tagNode, false, true);
    this.editor.insertContent('&nbsp;');
  };
}

// Finds the first character that is different between two strings
export function findFirstDifferent(str1, str2) {
  let longest = str1.length > str2.length ? str1.length : str2.length;
  let ind = 0;

  for (let i = 0; i < longest; i++) {
    if (str1[i] !== str2[i]) {
      ind = i;
      break;
    }
  }

  return ind;
}

// Finds the nearest valid tag character
export function findNearestTagCharacter(str, start, end) {
  for (let i = end; i > start; i--) {
    if (['@', '#'].includes(str[i])) {
      return { char: str[i], pos: i };
    }
  }
}

export function filterValidTags(str, contacts, searchFields) {
  let filtered, sorted;

  filtered = contacts?.filter(cont => {
    return searchFields.some(
      field => processString(cont[field]?.toString()).indexOf(processString(str)) > -1
    );
  });

  sorted = filtered?.sort((a, b) => {
    let aInd = a.label.indexOf(str),
      bInd = b.label.indexOf(str);

    if (aInd < bInd) return -1;
    if (aInd > bInd) return 1;
    return 0;
  });

  return sorted || [];
}

export function attachDropdown(tags, searchRange) {
  if (!tags.length) {
    document
      .querySelectorAll('.barnyardjs-editor-tag-dropdown')
      .forEach(dropdown => dropdown.remove());
    return;
  }

  const span = document.createElement('span');
  span.classList.add('barnyardjs-editor-tags-cursor-position');
  span.setAttribute(this.uniqueHash, '');
  span.innerText = '|';

  const dropdown = document.createElement('div');
  dropdown.classList.add('barnyardjs-editor-tag-dropdown');
  dropdown.style.position = 'absolute';

  this.editor.insertNode(span);

  let boundingRect = span.getBoundingClientRect();
  dropdown.style.top = boundingRect.bottom + 'px';
  dropdown.style.left = boundingRect.left + 'px';

  dropdown.innerHTML = '';
  tags?.forEach(tag => {
    const tagRow = document.createElement('div');
    tagRow.classList.add('barnyardjs-editor-tag-dropdown-row');
    tagRow.innerText = tag.label;

    dropdown.appendChild(tagRow);
    addDropdownRowEventListener.call(this, tagRow, searchRange);
  });

  document
    .querySelectorAll('.barnyardjs-editor-tag-dropdown')
    .forEach(dropdown => dropdown.remove());
  document
    .querySelector(`#${this.editorDivId} .barnyardjs-editor__inner-wrapper`)
    .appendChild(dropdown);

  this.editor.deleteNode(span);
}
