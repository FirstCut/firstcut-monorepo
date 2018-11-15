
const Analytics = {
  init(options) {
    if (options.development) {
      analytics = {
        load() { console.log('Analytics load'); },
        page() { console.log('Analytics page'); },
        track() { console.log('Analytics track'); },
        identify() { console.log('Analytics identify'); },
        group() { console.log('Analytics group'); },
      };
    }
    analytics.load('q7fljn00pJH2VTzpOAv08t2AH5d2tfFy');
  },

  trackError(data) {
    this.track('Error', data);
  },

  trackFormSubmission(data) {
    const { projectName, ...rest } = data;
    const eventName = `Submitted form for project ${projectTitle}`;
    this.track(eventName, rest);
  },

  trackClickEvent(data) {
    const { name, ...rest } = data;
    const eventName = `Clicked ${name}`;
    this.track(eventName, rest);
  },

  trackNavigationEvent(name) {
    analytics.page(name);
  },
};

export default Analytics;
