import { on, fire, clear, clearId, setMutationConfig } from '../src/index';
import { createNode, removeNode } from 'dom-js';

window.onload = () => {
  setMutationConfig(true);
  const frag = document.createDocumentFragment();
  const div = createNode('div', { style: 'width: 100px; height: 100px; background-color: blue;' });

  const id = on(div, 'click', () => showMessage('On click event1'));
  on(div, 'mousedown', () => showMessage('On click event2'));
  on(div, 'mouseup', () => showMessage('On click event3'));
  on(div, 'click', () => showMessage('On click event4'));
  on(div, 'click', () => showMessage('On click event5'));

  document.body.appendChild(div);

  let divDyn = null;
  for (let i = 0; i < 10; i += 1) {
    divDyn = createNode('div', { id: i, style: 'display:inline-block; width: 25px; height: 25px; background-color:black;' });
    on(divDyn, 'click', () => showMessage('On click event dynamic'));
    frag.appendChild(divDyn);
  }

  div.appendChild(frag);

  const object = {};

  const id1 = on(object, 'show.message', showMessage);
  const id2 = on(object, 'show.message', showMessage);
  const id3 = on(object, 'show.message', showMessage);
  const id4 = on(object, 'show.message', showMessage);
  const id5 = on(object, 'show.message2', showMessage);
  const id6 = on(object, 'show.message3', showMessage);
  clearId(id);
  fire(object, 'show.message', 'show message');


  /*while (div.childElementCount > 0) {
   div.removeChild(div.childNodes[0]);
   }*/

  clear(div, 'click');
  clear(object, 'show.message');
  console.log(object);
};

function showMessage(value) {
  console.log(value);
}
