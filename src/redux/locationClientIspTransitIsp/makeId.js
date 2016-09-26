export default function makeId(locationId, clientIspId, transitIspId) {
  return `${locationId}_${clientIspId}_${transitIspId}`;
}
