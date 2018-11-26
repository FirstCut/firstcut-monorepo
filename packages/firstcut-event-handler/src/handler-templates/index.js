import ProjectRequest from './project-request';

const templates = [
  ProjectRequest,
];

const EventHandlerTemplates = templates.reduce((r, template) => {
  const result = r;
  const key = template.get('key');
  result[key] = template;
  return result;
}, {});

export default EventHandlerTemplates;
