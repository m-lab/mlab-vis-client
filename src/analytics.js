import ReactGA from 'react-ga';
ReactGA.initialize('UA-43774300-1');

export function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}