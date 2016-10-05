

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

export function pointsToLine(points) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points,
    },
  };
}
