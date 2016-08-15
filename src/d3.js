/**
 * Our local d3 build. Since webpack has `src` configured as a module
 * directory, we can require the output of this in any file by doing
 *
 * import d3 from 'd3';
 *
 * Then we can use it as we expect: d3.scaleLinear, d3.line, etc.
 */
import * as array from 'd3-array';
import * as scale from 'd3-scale';
import * as selection from 'd3-selection';
import * as shape from 'd3-shape';

export default Object.assign({},
  array,
  scale,
  selection,
  shape);
