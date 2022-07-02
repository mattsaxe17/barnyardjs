// Will get the button element from either itself or its child
function getButtonWrapper(element) {
  return element.tagName === 'I' ? element.parentElement.parentElement : element.parentElement;
}

// Gets button regardless of the target element
function getButton(element) {
  return ['I', 'SUB', 'SUP'].includes(element.tagName) ? element.parentElement : element;
}

function getAdjacentButtons(button) {
  return Array.from(button.parentElement.children);
}

// Toggles the buttons selected status regardless of the target element
export function toggleButtonSelected(element) {
  let button = getButton(element);
  button.classList.toggle('selected');
}

// Deselects all buttons in the same control group
export function deselectAdjacentButtons(element) {
  let button = getButton(element);

  getAdjacentButtons(button).forEach(child => {
    if (child.innerHTML !== button.innerHTML) {
      child.classList.remove('selected');
    }
  });
}

export function noneSelectedInGroup(element) {
  let button = getButton(element),
      anySelected = false;

  getAdjacentButtons(button).forEach(child => {
    if (child.classList.contains('selected')) {
      anySelected = true;
    }
  });

  return !anySelected;
}

// Gets anscestors of an element
export function getAncestors(element) {
  let elements = [];
  let currentElement = element;

  while (currentElement.parentElement) {
    currentElement = currentElement.parentElement;
    elements.push(currentElement);
  }

  return elements;
}

// Hides all button extenders except the button clicked
export function hideOtherButtonExteders(element) {
  if (element.tagName === 'INPUT' && element.getAttribute('type') === 'color') {
    return;
  }

  let clickedButtonWrapper = getButtonWrapper(element);

  document.querySelectorAll('.button-extender').forEach(extender => {
    let wrapper = getButtonWrapper(extender);

    if (wrapper !== clickedButtonWrapper) {
      extender.classList.add('hidden');
    }
  });
}
