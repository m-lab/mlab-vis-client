/**
 * Helper to create the standard line chunked definitions that we use
 * in various lines throughout the project.
 *
 * @param {Function|String} color the color of the the line (typical d3.. takes arg `d`)
 */
export function standardLineChunkedDefinitions() {
  return {
    gap: {
      styles: {
        'stroke-width': 0,
      },
    },
    'below-threshold': {
      styles: {
        'stroke-dasharray': '2, 2',
        'stroke-opacity': 0.35,
      },
    },
  };
}
