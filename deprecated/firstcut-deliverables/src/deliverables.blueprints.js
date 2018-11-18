
export const full = {
  label: 'Full Testimonial Video',
  required_items: ['logo', 'cta', 'song'],
  defaults: {
  },
  description: 'This is a full testimonial video',
};

export const snippet = {
  label: 'Testimonial Snippet',
  required_items: ['logo', 'cta', 'song'],
  defaults: {
  },
  description: 'This is a testimonial snippet',
};

export const notATemplate = Object.freeze({
  label: 'Not a Template',
  defaults: {
  },
  required_items: ['cta'],
  description: 'This is not a tempate',
});

const DELIVERABLE_BLUEPRINTS = Object.freeze({
  FULL_TESTIMONIAL: full,
  TESTIMONIAL_SNIPPET: snippet,
  NOT_A_TEMPLATE: notATemplate,
});

export default DELIVERABLE_BLUEPRINTS;
