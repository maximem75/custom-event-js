/*** Global variables ***/

const config = {
  id: 0,
  handlers: [],
  showEventsOnMutation: false,
  observeBody: false
};

/*** Public functions ***/

/**
 * Add a DOM event or a Custom event according to the item instance (Element, Object)
 * ex: on(element, 'click', () => console.log('click'))
 *     on(object, 'test', () => console.log('test'))
 *
 * @param item
 * @param event
 * @param callback
 * @param useCapture
 * @returns {number}
 */
export function on(item, event, callback, useCapture = false) {
  if (!config.observeBody)
    observeNode(document.body);

  if (!item || (item && (item && item instanceof Element === false && (item instanceof Object === false || item instanceof Array))))
    throw new Error('Bad item');

  if (!event || (event && !typeofText(event)))
    throw new Error('Bad event');

  if (item instanceof Element) {
    item.addEventListener(event, callback, useCapture);
    config.handlers.push({ id: getNewEventId(), item, event, callback, useCapture });
  } else if (item instanceof Object && item instanceof Array === false) {
    if (!item.handlers)
      item.handlers = {};

    if (!item.handlers[event])
      item.handlers[event] = [];

    item.handlers[event].push({id: getNewEventId(), item, callback, useCapture });
  }

  return config.id;
}

/**
 * Execute callback(s) for an events inside an object
 * ex: fire(object, 'test', arg1, arg2)
 *
 * @param object
 * @param event
 * @param params
 */
export function fire(object, event, ...params) {
  if (!object || (object && object instanceof Object === false || object instanceof Array))
    throw new Error('Bad object');

  if (!event || (event && !typeofText(event)))
    throw new Error('Bad event');

  const items = !object || !object.handlers ? null : object.handlers[event];
  if (items)
    items.forEach(item => params.length ? item.callback(...params) : item.callback());
}

/**
 * Remove all events from an Element or an Object
 * ex: clear(element, 'click')
 *     clear(object, 'test')
 *
 * @param item
 * @param event
 */
export function clear(item, event) {
  if (item instanceof Element === false && item instanceof Object === false || item instanceof Array)
    throw new Error('Bad item (required Element or Object)');

  if (!typeofText(event))
    throw new Error('Bad event');

  if (item instanceof Element) {
    let index = 0;
    const length = config.handlers.length;
    for (let i = 0; i < length; i += 1) {
      const handler = config.handlers[index];
      if (handler.item === item && handler.event === event) {
        removeEvent(handler, index);
        index--;
      }
      index++;
    }
  } else if (item instanceof Object && item instanceof Array === false)
    delete item.handlers[event];
}

/**
 * Remove an event by is ID
 *
 * Remove dom element event example : clear(1);
 * Remove custom event example : clear(1, object);
 *
 * @param id
 * @param object
 */
export function clearId(id, object) {
  if (typeof id !== 'number')
    throw new Error('Bad id');

  if (!object || (object && object instanceof Object === false)) {
    const index = config.handlers.findIndex(handler => handler.id === id);
    if (index === -1)
      throw new Error('bad id');

    removeEvent(config.handlers[index], index);
  } else {
    const keys = Object.keys(object.handlers);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const handler = object.handlers[key];
      const index = handler.findIndex(event => event.id === id);

      if (index !== -1) {
        object.handlers[key].splice(index, 1);
        break;
      }
    }
  }
}

/**
 * Allow the developper to watch the event list
 */
export function showEvents() {
  console.log(config.handlers);
}

/**
 * Show event list after a removed node
 * @param value
 */
export function setMutationConfig(value) {
  if (typeof value === 'boolean')
    config.showEventsOnMutation = true;
}
/*** Private functions ***/

function removeEvent(handler, index) {
  if (handler.item instanceof Element)
    handler.item.removeEventListener(handler.event, handler.callback, handler.useCapture);

  config.handlers.splice(index, 1);
}

function observeNode(targetNode) {
  config.observeBody = true;

  const attributes = { attributes: false, childList: true, subtree: true };
  const callback = function(mutationsList) {
    for (let i = 0; i < mutationsList.length; i += 1) {
      if (mutationsList[i].type == 'childList' && mutationsList[i].removedNodes.length > 0) {
        cleanHandlers();
        break;
      }
    }

    if (config.showEventsOnMutation)
      showEvents();
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, attributes);
}

function cleanHandlers() {
  config.handlers = config.handlers.filter(handler => handler.item.isConnected);
}

function getNewEventId() {
  return config.id += 1;
}

function typeofText(item) {
  return typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean';
}