
const Analytics = {
  init(options = {}) {
    if (options.development) {
      window.analyics = {
        load() { console.log('Analytics load'); },
        page() { console.log('Analytics page'); },
        track() { console.log('Analytics track'); },
        identify() { console.log('Analytics identify'); },
        group() { console.log('Analytics group'); },
      };
    } else if (!window.analytics) {
      initMixpanel();
    }
    window.analytics.load('q7fljn00pJH2VTzpOAv08t2AH5d2tfFy');
  },

  trackError(data) {
    this.track('Error', data);
  },

  trackFormSubmission(data) {
    const { projectId, projectTitle, ...rest } = data;
    const eventName = `Submitted form for project ${projectTitle}`;
    this.track(eventName, rest);
  },

  trackClickEvent(data) {
    const { name, ...rest } = data;
    const eventName = `Clicked ${name}`;
    this.track(eventName, rest);
  },

  trackNavigationEvent(name) {
    window.analytics.page(name);
  },

  track(name, data) {
    window.analytics.track(name, data);
  },
};


export function initMixpanel() {
  const analytics = window.analytics = window.analytics || [];
  if (!analytics.initialize) {
    if (analytics.invoked)window.console && console.error && console.error('Segment snippet included twice.'); else {
      analytics.invoked = !0; analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on']; analytics.factory = function (t) { return function () { const e = Array.prototype.slice.call(arguments); e.unshift(t); analytics.push(e); return analytics; }; }; for (let t = 0; t < analytics.methods.length; t++) { const e = analytics.methods[t]; analytics[e] = analytics.factory(e); }analytics.load = function (t, e) { const n = document.createElement('script'); n.type = 'text/javascript'; n.async = !0; n.src = `https://cdn.segment.com/analytics.js/v1/${t}/analytics.min.js`; const a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(n, a); analytics._loadOptions = e; }; analytics.SNIPPET_VERSION = '4.1.0';
    }
  }
  return analytics;
}

export default Analytics;
