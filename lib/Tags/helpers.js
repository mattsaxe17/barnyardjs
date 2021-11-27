import { insertEntity } from 'roosterjs-editor-api';
import { PositionContentSearcher } from 'roosterjs-editor-dom';

// Returns a string suitable for checking against a tag array
function processString(str, excludeSpace) {
  let exclude = '&.,-_()<> ';
  exclude = excludeSpace ? exclude : exclude.trim();

  exclude.split('').forEach(char => {
    str = str.replaceAll(char, '');
  });

  return str.toUpperCase();
}

// Adds the tag entity to the editor and removes what the user was typing
function addTag(tagText, searchRange) {
  const tagNode = document.createElement('span');
  tagNode.classList.add('barnyardjs-editor-tag');
  tagNode.innerText = this.content[searchRange.searchStart] + tagText;
  tagNode.innerHTML += '&nbsp;&nbsp;';

  let searchString = this.content
    .substring(searchRange.searchStart, searchRange.searchEnd + 1)
    .replace('<', '');

  this.editor.insertContent(this.uniqueHash);
  insertEntity(this.editor, 'tag', tagNode, false, true);
  this.editor.insertContent('&nbsp;');

  let editor = document.querySelector(
    `.barnyardjs-editor-wrapper[${this.uniqueHash}] .barnyardjs-editor`
  );

  document.querySelector(
    `.barnyardjs-editor-wrapper[${this.uniqueHash}] .barnyardjs-editor`
  ).innerHTML = editor.innerHTML.replace(searchString + this.uniqueHash, '');

  removeDropdowns();
}

// Gets the label of a dropdown row from a click event
function getLabel(e) {
  if (e.target.classList.contains('barnyardjs-editor-tag-dropdown-row')) {
    return e.target.dataset.label;
  } else {
    return e.target.parentElement.dataset.label;
  }
}

// Creates a dropdown row based on fields avilable
function createDropdownRow(tag) {
  const tagRow = document.createElement('div');
  tagRow.classList.add('barnyardjs-editor-tag-dropdown-row');
  tagRow.setAttribute('data-label', tag.label);

  if (tag.image) {
    const img = document.createElement('img');
    img.classList.add('barnyardjs-editor-tag-dropdown-row-image');
    img.src = tag.image;
    tagRow.appendChild(img);
  }

  const label = document.createElement('span');
  label.classList.add('barnyardjs-editor-tag-dropdown-row-label');
  label.innerText = tag.label;
  tagRow.appendChild(label);

  if (tag.helpText) {
    const helpText = document.createElement('span');
    helpText.classList.add('barnyardjs-editor-tag-dropdown-row-help-text');
    helpText.innerText = tag.helpText;
    tagRow.appendChild(helpText);
  }

  return tagRow;
}

// Removes all dropdowns from DOM
function removeDropdowns() {
  document
    .querySelectorAll('.barnyardjs-editor-tag-dropdown')
    .forEach(dropdown => dropdown.remove());
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

  removeDropdowns();
  return ind;
}

// Finds the nearest valid tag character
export function findNearestTagCharacter(str, start, end) {
  for (let i = end; i > start; i--) {
    if (this.constructor.validTagCharacters.indexOf(str[i]) !== -1) {
      return { char: str[i], pos: i };
    }
  }
}

export function filterValidTags(str, contacts, searchFields, tagChar) {
  let filtered, sorted;
  let allowSpaces = this.constructor.tagData?.[tagChar]?.allowSpaces || false;

  console.log(str)

  filtered = contacts?.filter(cont => {
    return searchFields.some(
      field =>
        processString(cont[field]?.toString(), allowSpaces).indexOf(
          processString(str, allowSpaces)
        ) > -1
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
    removeDropdowns();
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
    let dropdownRow = createDropdownRow(tag);

    dropdown.appendChild(dropdownRow);
    dropdownRow.onclick = e => addTag.call(this, getLabel(e), searchRange);
  });

  removeDropdowns();
  document
    .querySelector(
      `.barnyardjs-editor-wrapper[${this.uniqueHash}] .barnyardjs-editor__inner-wrapper`
    )
    .appendChild(dropdown);

  this.editor.deleteNode(span);
}

// Makes sure user-passed tag data conforms to the editor's usage
export function processTagData() {
  console.log(this);
  for (let key in this.tagData) {
    if (this.constructor.validTagCharacters.indexOf(key) < 0) {
      delete tagData[key];
    }

    if (Array.isArray(this.tagData[key])) {
      this.tagData[key] = {
        ...this.constructor.defaultTagConfig,
        tags: this.tagData[key],
      };
    }

    // Uses defaults if no value is passed by user
    this.tagData[key] = {
      ...this.constructor.defaultTagConfig,
      ...this.tagData[key],
    };

    for (let configKey in this.tagData[key]) {
      if (!Object.keys(this.constructor.defaultTagConfig).includes(configKey)) {
        delete this.tagData[key][configKey];
      }

      if (configKey === 'tags') {
        this.tagData[key][configKey].forEach(tag => {
          if (!tag.label) {
            throw new Error(
              `barnyardjs ERROR: Each tag object must have a label property. Failing object is contained in '${key}' tags: ${JSON.stringify(tag)}`
            );
          }
        });
      }
    }
  }
}
