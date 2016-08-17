/**
 * Actions for locationPage
 */
export const RESET_SELECTED_LOCATIONS = 'locationPage/RESET_SELECTED_LOCATIONS';
export const RESET_SELECTED_CLIENT_ISPS = 'locationPage/RESET_SELECTED_CLIENT_ISPS';

/**
 * Action for resetting selected locations
 */
export function resetSelectedLocations() {
  return {
    type: RESET_SELECTED_LOCATIONS,
  };
}

/**
 * Action for resetting selected client ISPs
 */
export function resetSelectedClientIsps() {
  return {
    type: RESET_SELECTED_CLIENT_ISPS,
  };
}

