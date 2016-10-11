

/**
 * Converts a [lon, lat] point array to a
 * GeoJson Point feature
 * @param {String} id Id of feature
 * @param {Array} point [lon, lat] array
 * @return {Object} Point Feature object
 */
export function pointToFeature(id, point) {
  return {
    id,
    type: 'Feature',
    geometry: {
      coordinates: point,
      type: 'Point',
    },
  };
}

/**
 * Converts an array of [lon, lat] points to a
 * GeoJson LineString feature
 * @param {Array} points [[lon, lat], ...] array
 * @return {Object} PointLine Feature object
 */
export function pointsToLine(points) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points,
    },
  };
}
