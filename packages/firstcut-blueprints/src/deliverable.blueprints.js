
export const full = {
  label: 'Full Testimonial Video',
  defaults: {
	   estimatedDuration: 120, //in seconds
  },
  required_items: ['logo', 'cta', 'song'],
  description:  "This is a full testimonial video"
};

export const snippet = {
  label: 'Testimonial Snippet',
  defaults: {
	   estimatedDuration: 30, //in seconds
  },
  required_items: ['logo', 'cta', 'song'],
  description:  "This is a testimonial snippet"
};

export const not_a_template = Object.freeze({
  label: 'Not a Template',
  defaults: {
	   estimatedDuration: 120, //in seconds
  },
  required_items: ['cta'],
  description:  "This is not a tempate"
});
