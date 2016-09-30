/**
 * Selectors for top
 */

// -----------------------
// Top Locations
// -----------------------
export function getTopLocationsForClientIsps(state) {
  return state.top.locationsForClientIsps;
}

export function getTopLocationsForTransitIsps(state) {
  return state.top.locationsForTransitIsps;
}

// -----------------------
// Top Client ISPs
// -----------------------
export function getTopClientIspsForLocations(state) {
  return state.top.clientIspsForLocations;
}

export function getTopClientIspsForTransitIsps(state) {
  return state.top.clientIspsForTransitIsps;
}

// -----------------------
// Top Transit ISPs
// -----------------------
export function getTopTransitIspsForLocations(state) {
  return state.top.transitIspsForLocations;
}

export function getTopTransitIspsForClientIsps(state) {
  return state.top.transitIspsForClientIsps;
}
