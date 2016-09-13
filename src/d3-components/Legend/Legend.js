import d3 from 'd3';
import { findEqualSorted } from '../../utils/array';

/**
 * D3 Component for rendering a legend
 * Typically initialized in makeVisComponents() and then rendered with a passed in
 * root container node.
 */
export default class Legend {
  constructor({ data, colors, formatter, width, onHoverLegendEntry }) {
    this.data = data;
    this.colors = colors;
    this.formatter = formatter;
    this.width = width;
    this.onHoverLegendEntry = onHoverLegendEntry;

    const entryMarginRight = 14;
    const minEntryWidth = 180;
    const maxEntriesPerRow = 3;

    this.config = {
      entry: {
        height: 14,
        width: Math.max(Math.floor(this.width / maxEntriesPerRow) - entryMarginRight, minEntryWidth),
        margin: { bottom: 4, right: entryMarginRight },
      },
      colorBox: {
        width: 8,
        margin: 2,
      },
    };

    this.numEntriesPerRow = Math.floor(this.width / this.config.entry.width);
    this.numRows = Math.ceil(data.length / this.numEntriesPerRow);
    const legendPaddingBottom = 4;
    this.height = (this.numRows * (this.config.entry.height + this.config.entry.margin.bottom)) + legendPaddingBottom;
  }

  /**
   * Renders the legend to the `root` container
   *
   * @param {Object} root A d3 selection of a container to render the legend in
   * @return {void}
   */
  render(root) {
    const binding = root.selectAll('.legend-entry').data(this.data, d => d.meta.id);
    binding.exit().remove();

    const that = this;
    const { entry: entryConfig, colorBox: colorBoxConfig } = this.config;
    const colors = this.colors;

    const entering = binding.enter().append('g')
      .attr('class', 'legend-entry')
      .each(function legendEnter(d) {
        const entry = d3.select(this);

        const entryId = String(Math.random()).replace(/\./, '');
        const clipId = `legend-clip-${entryId}`;
        entry.attr('clip-path', `url(#${clipId})`);

        // add in the clipping rects
        entry.append('defs')
          .append('clipPath')
            .attr('id', clipId)
          .append('rect')
            .attr('width', entryConfig.width)
            .attr('height', entryConfig.height);


        entry.append('rect')
          .attr('class', 'legend-color-box')
          .attr('y', 3)
          .attr('width', colorBoxConfig.width)
          .attr('height', colorBoxConfig.width)
          .style('fill', colors[d.meta.id] || '#aaa');

        entry.append('text')
          .attr('class', 'legend-entry-label')
          .attr('x', colorBoxConfig.width + colorBoxConfig.margin)
          .attr('dy', 12)
          .text(d.meta.label);

        entry.append('rect')
          .attr('class', 'legend-entry-value-bg')
          .attr('x', entryConfig.width)
          .attr('width', 0)
          .attr('height', entryConfig.height)
          .style('fill', '#fff');

        entry.append('text')
          .attr('class', 'legend-entry-value')
          .attr('dy', 12)
          .attr('x', entryConfig.width)
          .attr('text-anchor', 'end')
          .style('fill', colors[d.meta.id] || '#aaa');

        // mouse listener rect
        entry.append('rect')
          .attr('width', entryConfig.width)
          .attr('height', entryConfig.height)
          .style('fill', '#f00')
          .style('stroke', 'none')
          .style('opacity', 0)
          .on('mouseenter', () => that.onHoverLegendEntry(d))
          .on('mouseleave', () => that.onHoverLegendEntry(null));
      });

    // UPDATE + ENTER -- mostly for hover behavior
    binding.merge(entering)
      .attr('transform', (d, i) => {
        const rowNum = Math.floor(i / this.numEntriesPerRow);
        const numInRow = i % this.numEntriesPerRow;

        const x = numInRow * (entryConfig.width + entryConfig.margin.right);
        const y = rowNum * (entryConfig.height + entryConfig.margin.bottom);
        return `translate(${x} ${y})`;
      })
      // .each(function legendUpdate(d) {
      //   const entry = d3.select(this);

      //   // TODO: get highlight values
      //   let highlightValue;
      //   if (highlightDate) {
      //     // find equal (TODO should use binary search)
      //     highlightValue = findEqualSorted(d.series.results, highlightDate.unix(), d => d[xKey].unix());
      //     if (highlightValue[yKey] != null) {
      //       highlightValue = yFormatter(highlightValue[yKey]);
      //     } else {
      //       highlightValue = '--';
      //     }
      //   }

      //   if (highlightValue != null) {
      //     const valueText = entry.select('.legend-entry-value')
      //       .style('display', '')
      //       .text(highlightValue);

      //     const valueTextBBox = valueText.node().getBBox();
      //     const valueTextMargin = 4;
      //     entry.select('.legend-entry-value-bg')
      //       .style('display', '')
      //       .attr('x', Math.floor(valueTextBBox.x) - valueTextMargin)
      //       .attr('width', (2 * valueTextMargin) + Math.ceil(valueTextBBox.width));
      //   } else {
      //     entry.select('.legend-entry-value').style('display', 'none');
      //     entry.select('.legend-entry-value-bg').style('display', 'none');
      //   }
      // });
  }
}
