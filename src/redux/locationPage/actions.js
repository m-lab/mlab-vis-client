/**
 * Actions for locationPage
 */
export const HIGHLIGHT_HOURLY = 'locationPage/HIGHLIGHT_HOURLY';

/**
 * Action for highlighting the hourly chart
 */
export function highlightHourly(highlightPoint) {
  return {
    type: HIGHLIGHT_HOURLY,
    highlightPoint,
  };
}
