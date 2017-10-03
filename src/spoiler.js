
const DEFAULT_OPTIONS = {
  maxLength: 140
};


module.exports = Spoiler;


function Spoiler (
  element,
  options
) {

  options = Object.assign({}, DEFAULT_OPTIONS, options || {});

  const collapsiblePaneElement = document.createElement('div');
  collapsiblePaneElement.classList.add('spoiler-collapsible-pane');
  element.appendChild(collapsiblePaneElement);

  const collapseButton = document.createElement('div');
  collapseButton.classList.add('spoiler-collapse-button');
  collapseButton.addEventListener('click', () => toggleDisplay());
  element.appendChild(collapseButton);

  let cutOffTextElement = null;

  let collapsed = false;

  let length = 0;
  let moving = false;
  let lastTextNode = null;

  const elementsToMove = [];

  for (let i = 0; i < element.childNodes.length; i++) {

    const childElement = element.childNodes[i];

    if (
      childElement === collapsiblePaneElement ||
      childElement === collapseButton
    ) {
      continue;
    }

    const text = childElement.innerText || '';

    if (moving) {
      elementsToMove.push(childElement);
    } else {
      if (length + text.length >= options.maxLength) {
        lastTextNode = childElement;
        moving = true;
      } else {
        length += text.length;
      }
    }

  }

  elementsToMove.map(element => collapsiblePaneElement.appendChild(element));

  handleLastTextNode();

  setTimeout(() => {

    collapsiblePaneElement.style.height = collapsiblePaneElement.clientHeight + 'px';

    toggleDisplay();

  });


  function toggleDisplay () {
    element.classList.toggle('spoiler-collapsed');
    collapsed = !collapsed;
  }

  function handleLastTextNode () {

    cutOffTextElement = lastTextNode.cloneNode(true);
    cutOffTextElement.classList.add('spoiler-cut-off-text');

    lastTextNode.classList.add('spoiler-last-text');

    element.insertBefore(cutOffTextElement, lastTextNode);

    const text = lastTextNode.innerText;
    const extraLength = (length + text.length) - options.maxLength;
    const cutOffOffset = text.length - extraLength;

    let cutOffText = text.substring(0, cutOffOffset);

    if (-1 === cutOffText.indexOf(' ')) {
      cutOffText = text.split(' ', 2)[0];
    } else {
      cutOffText = cutOffText.replace(/\s+\w*$/, '');
    }

    cutOffTextElement.innerText = cutOffText + '…';

  }

}
