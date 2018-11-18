
const customerTestimonial = Object.freeze({
  label: 'Customer Testimonial',
  defaults: {},
  default_children: {
    SHOOT: { blueprint: 'CORPORATE_INTERVIEWS' },
  },
});

const notATemplate = Object.freeze({
  label: 'Not a Template',
  defaults: {},
  default_children: {
    SHOOT: { blueprint: 'CORPORATE_INTERVIEWS' },
  },
});

const PROJECT_BLUEPRINTS = Object.freeze({
  CUSTOMER_TESTIMONIAL: customerTestimonial,
  NOT_A_TEMPLATE: notATemplate,
});

export default PROJECT_BLUEPRINTS;
