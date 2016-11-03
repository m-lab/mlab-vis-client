import React, { PureComponent, PropTypes } from 'react';

/**
 * A component that renders:
 *
 *<g>
 *  <rect width=<width-of-foo> height=<height-of-foo>>
 *  <text>foo</text>
 *</g>
 *
 */
export default class TextWithBackground extends PureComponent {
  static propTypes = {
    // The background color
    background: PropTypes.string,
    // What goes inside the <text>
    children: PropTypes.any,
    // the <g> class name
    className: PropTypes.string,
    // padding to add to the rect { top, bottom, left, right }
    padding: PropTypes.object,
    // the <text> class name
    textClassName: PropTypes.string,
    // the x coordinate
    x: PropTypes.number,
    // the y coordinate
    y: PropTypes.number,
  }

  static defaultProps = {
    background: '#fff',
    x: 0,
    y: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  }

  constructor(...args) {
    super(...args);
    this.state = {
      textWidth: 0,
      textHeight: 0,
      textX: 0,
      textY: 0,
    };
  }

  componentDidMount() {
    this.updateTextDimensions();
  }

  componentDidUpdate() {
    this.updateTextDimensions();
  }

  updateTextDimensions() {
    const bbox = this.text.getBBox();
    this.setState({
      textWidth: bbox.width,
      textHeight: bbox.height,
      textX: bbox.x,
      textY: bbox.y,
    });
  }

  render() {
    const { background, className, textClassName, x, y, children, padding, ...other } = this.props;
    const { textX, textY, textWidth, textHeight } = this.state;

    return (
      <g className={className} transform={`translate(${x} ${y})`}>
        <rect
          x={textX - padding.left}
          y={textY - padding.top}
          width={textWidth + padding.left + padding.right}
          height={textHeight + padding.bottom + padding.top}
          fill={background}
        />
        <text ref={node => { this.text = node; }} className={textClassName} {...other}>{children}</text>
      </g>
    );
  }
}
