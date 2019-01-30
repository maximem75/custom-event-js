import {on, fire, clear, clearId, showEvents, setMutationConfig} from '../src/index';

window.onload = () => {
  setMutationConfig(true);
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.style.cssText = 'width: 100px; height: 100px; background-color: blue;';

  const id = on(div, 'click', () => showMessage('On click event1'));
  on(div, 'mousedown', () => showMessage('On click event2'));
  on(div, 'mouseup', () => showMessage('On click event3'));
  on(div, 'click', () => showMessage('On click event4'));
  on(div, 'click', () => showMessage('On click event5'));

  const div2 = document.createElement('div');
  const div3 = document.createElement('div');

  div.appendChild(div2);
  div.appendChild(div3);

  document.body.appendChild(div);

  let divDyn = null;
  for (let i = 0; i < 1000; i+=1) {
    divDyn = document.createElement('div');
    divDyn.setAttribute('id', i);
    divDyn.setAttribute('style', 'display:inline-block; width: 25px; height: 25px; background-color:black;');
    frag.appendChild(divDyn);
    on(divDyn, 'click', () => showMessage('On click event dynamic'));
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

  //document.body.removeChild(div);
  clear(div, 'click');
  console.log(object);
 //clear(object, 'show.message');
 //console.log(object);
};

function showMessage(value) {
  console.log(value);
}
