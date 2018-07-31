import { full, snippet, not_a_template as deliverable_no_template } from './deliverable.blueprints.js';
import { customer_testimonial, not_a_template as project_no_template } from './project.blueprints.js';
import { corporate_interviews } from './shoot.blueprints.js';
import BlueprintableSchema from './blueprintable.schema.js';

export const DELIVERABLE_BLUEPRINTS = Object.freeze({
  'FULL_TESTIMONIAL' : full,
  'TESTIMONIAL_SNIPPET' : snippet,
  'NOT_A_TEMPLATE': deliverable_no_template
});

export const SHOOT_BLUEPRINTS = Object.freeze({
	'CORPORATE_INTERVIEWS': corporate_interviews
});

export const PROJECT_BLUEPRINTS = Object.freeze({
  'CUSTOMER_TESTIMONIAL': customer_testimonial,
  'NOT_A_TEMPLATE': project_no_template
});

export { BlueprintableSchema };
