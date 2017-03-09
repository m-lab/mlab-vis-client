import ReactGA from 'react-ga';
ReactGA.initialize('UA-56251309-3');

export function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}