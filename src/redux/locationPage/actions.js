/**
 * Actions
 */
export const CHANGE_LOCATION = 'locationPage/CHANGE_LOCATION';

export function changeLocation(locationId) {
  return {
    type: CHANGE_LOCATION,
    locationId,
  };
}
