import EventHandlerTemplates from './handler-templates';

export function getTemplateKey(t) {
  return t.get('key');
}

export function getTemplate(key) {
  return EventHandlerTemplates[key];
}

export function getActionsForEvent(data) {
  const { event } = data;
  return getTemplate(event).get('generateActions')(data);
}
