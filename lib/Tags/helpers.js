import { insertEntity } from 'roosterjs-editor-api';
import { PositionContentSearcher } from 'roosterjs-editor-dom';


// --------------------------------------------------------------- //
// ----- Inserts a child at a specific index in a container ----- //
// ------------------------------------------------------------- //
Element.prototype.insertChildAtIndex = function (child, ind) {
  if (!ind) ind = 0;
  if (ind >= this.children.length) {
    this.appendChild(child);
  } else {
    this.insertBefore(child, this.children[ind]);
  }
};

// ----------------------------------------------------------------------- //
// ----- Returns a string suitable for checking against a tag array ----- //
// --------------------------------------------------------------------- //
function processString(str, excludeSpace) {
  let exclude = '&.,-_()<> ';
  exclude = excludeSpace ? exclude : exclude.trim();

  exclude.split('').forEach(char => {
    str = str.replaceAll(char, '');
  });

  return str.toUpperCase();
}

// --------------------------------------------------------- //
// ----- Swaps two elements in the same DOM container ----- //
// ------------------------------------------------------- //
function swapElements(elem1, elem2) {
  if (elem1.parent !== elem2.parent) return;

  let parent = elem1.parentElement;
  let ind1 = [...elem1.parentElement.children].indexOf(elem1);
  let ind2 = [...elem2.parentElement.children].indexOf(elem2);

  elem1.remove();
  elem2.remove();

  parent.insertChildAtIndex(elem2, ind1);
  parent.insertChildAtIndex(elem1, ind2);
}

// --------------------------------------------------- //
// ----- Removes all tag dropdowns from the DOM ----- //
// ------------------------------------------------- //
function removeDropdowns() {
  document
    .querySelectorAll('.barnyardjs-editor-tag-dropdown')
    .forEach(dropdown => dropdown.remove());
}

// ----------------------------------------------------------------------------------- //
// ----- Adds the tag entity to the editor and removes what the user was typing ----- //
// --------------------------------------------------------------------------------- //
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

  let editor = document.querySelector(`[${this.uniqueHash}] .barnyardjs-editor`);

  document.querySelector(`[${this.uniqueHash}] .barnyardjs-editor`).innerHTML =
    editor.innerHTML.replace(searchString + this.uniqueHash, '');

  removeDropdowns();
}

// ---------------------------------------------------------------- //
// ----- Gets the label of a dropdown row from a click event ----- //
// -------------------------------------------------------------- //
function getLabel(e) {
  if (e.target.classList.contains('barnyardjs-editor-tag-dropdown-row')) {
    return e.target.dataset.label;
  } else {
    return e.target.parentElement.dataset.label;
  }
}

// ----------------------------------------------------- //
// ----- Creates a dropdown row from a tag object ----- //
// --------------------------------------------------- //
function createDropdownRow(tag) {
  const tagRow = document.createElement('div');
  tagRow.classList.add('barnyardjs-editor-tag-dropdown-row');
  tagRow.setAttribute('data-label', tag.label);
  tagRow.setAttribute('data-key', tag.key || tag.value);

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

// -------------------------------------------------------- //
// ----- Filters and sorts options in a new dropdown ----- //
// ------------------------------------------------------ //
function attachDropdown(tags, searchRange) {
  // Create a span at selection position to find coordinates for dropdown
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

  document
    .querySelector(`[${this.uniqueHash}] .barnyardjs-editor__inner-wrapper`)
    .appendChild(dropdown);

  this.editor.deleteNode(span);
}

// -------------------------------------------------------------- //
// ----- Filters and sorts options in an existing dropdown ----- //
// ------------------------------------------------------------ //
function filterDropdownOptions(tags, searchRange, dropdown) {
  let currentDropdownOptions = document.querySelectorAll(
    `[${this.uniqueHash}] .barnyardjs-editor-tag-dropdown-row`
  );
  let keys = tags.map(tag => tag.key || tag.value);

  // Check dropdown for rows that should be removed
  currentDropdownOptions.forEach(row => {
    if (!keys.includes(row.dataset.key)) {
      row.remove();
    }
  });

  // Check filtered tags for tags that should be added as rows
  tags.forEach((tag, ind) => {
    if (!Array.from(currentDropdownOptions).find(row => row.dataset.key === tag.key)) {
      let newRow = createDropdownRow(tag);
      dropdown.insertChildAtIndex(newRow, ind);

      newRow.onclick = e => addTag.call(this, getLabel(e), searchRange);
    }
  });

  // Re-orders any dropdown rows that are out of place
  currentDropdownOptions = document.querySelectorAll(
    `[${this.uniqueHash}] .barnyardjs-editor-tag-dropdown-row`
  );
  currentDropdownOptions.forEach((row, ind) => {
    if (ind !== tags.indexOf(tags.find(tag => tag.key === row.dataset.key))) {
      swapElements(
        row,
        currentDropdownOptions[tags.indexOf(tags.find(tag => tag.key === row.dataset.key))]
      );
    }
  });
}

// ----------------------------------------------------------------------------------------- //
// ----- Finds the index of the first character that is different between two strings ----- //
// --------------------------------------------------------------------------------------- //
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

// -------------------------------------------------- //
// ----- Finds the nearest valid tag character ----- //
// ------------------------------------------------ //
export function findNearestTagCharacter(str, start, end) {
  for (let i = end; i > start; i--) {
    if (this.constructor.validTagCharacters.indexOf(str[i]) !== -1) {
      return { char: str[i], pos: i };
    }
  }
}

// --------------------------------------------------------- //
// ----- Filters and sorts tags based on user's input ----- //
// ------------------------------------------------------- //
export function filterTags(str, contacts, searchFields, tagChar) {
  let filtered, sorted;
  let allowSpaces = this.constructor.tagData?.[tagChar]?.allowSpaces || false;

  filtered = contacts?.filter(cont => {
    return searchFields.some(
      field =>
        processString(cont[field]?.toString(), allowSpaces).indexOf(
          processString(str, allowSpaces)
        ) > -1
    );
  });

  sorted = filtered?.sort((a, b) => {
    let aInd = processString(a.label).indexOf(processString(str)),
      bInd = processString(b.label).indexOf(processString(str));

    if (aInd < bInd) return -1;
    if (aInd > bInd) return 1;
    return 0;
  });

  return sorted || [];
}

// ---------------------------------------------------------------------- //
// ----- Handles the rendering of the tag dropdown as a user types ----- //
// -------------------------------------------------------------------- //
export function renderDropdown(tags, searchRange) {
  // If no tags are found, remove drowpowns
  if (!tags.length) {
    removeDropdowns();
    return;
  }

  let existingDropdown = document.querySelector(
    `[${this.uniqueHash}] .barnyardjs-editor-tag-dropdown`
  );

  // Check if dropdown is already attached so an expensive re-render doesn't happen
  if (existingDropdown) {
    filterDropdownOptions.call(this, tags, searchRange, existingDropdown);
  } else {
    attachDropdown.call(this, tags, searchRange);
  }
}

// --------------------------------------------------------------------------- //
// ----- Makes sure user-passed tag data conforms to the editor's usage ----- //
// ------------------------------------------------------------------------- //
export function processTagData() {
  for (let key in this.tagData) {
    // Removes any tags for a non-valid tag character
    if (this.constructor.validTagCharacters.indexOf(key) < 0) {
      delete tagData[key];
    }

    // If the user passes an array, creates an object with defaults and puts the array in tags
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
      // If the key is not a valid config option, remove it
      if (!Object.keys(this.constructor.defaultTagConfig).includes(configKey)) {
        delete this.tagData[key][configKey];
      }

      if (configKey === 'tags') {
        // If a tag doesn't have a label, throw an error
        this.tagData[key][configKey].forEach(tag => {
          if (!tag.label) {
            throw new Error(
              `barnyardjs: Each tag object must have a label property. Failing object is contained in '${key}' tags: ${JSON.stringify(
                tag
              )}`
            );
          }

          // If a tag has neither a value or key, throw an error
          if (tag.value === undefined && tag.key === undefined) {
            throw new Error(
              `barnyardjs: Each tag object must have a unique 'key' or 'value' property. Failing object is contained in '${key}' tags: ${JSON.stringify(
                tag
              )}`
            );
          }

          // Make sure each tag has a stringified 'key' property for efficient DOM updates
          tag.key = tag.key?.toString() || tag.value?.toString();
          tag.value = tag.value?.toString() || undefined;
        });
      }
    }
  }
}
