
const corporateInterviews = Object.freeze({
  label: 'Corporate Interview - 2hr Shoot',
  required_items: ['producer'],
  defaults: {
    duration: 2,
  },
  description: 'This is the corporate interviews description',
});

const SHOOT_BLUEPRINTS = Object.freeze({
  CORPORATE_INTERVIEWS: corporateInterviews,
});

export default SHOOT_BLUEPRINTS;
