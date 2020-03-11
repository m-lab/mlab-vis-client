import React, { PureComponent, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import dompurify from 'dompurify';

import { Icon } from '../../components';

import { helpTipContent } from '../../constants';

import '../HelpTip/HelpTip.scss';

/**
 * Component for (?) tooltips seen around the site.
 * Uses font awesome's question-circle to render the (?)
 */
export default class HelpTip extends PureComponent {
  static propTypes = {
    content: PropTypes.string,
    id: PropTypes.string,
    place: PropTypes.string,
    style: PropTypes.string,
  }

  static defaultProps = {
    place: 'top',
    style: 'dark',
  }

  render() {
    const { id, style, place } = this.props;
    let { content } = this.props;
    if (!content) {
      content = helpTipContent[id];
    }
    const offset = { top: -5, left: -8 };

    return (
      <span className="HelpTip">
        <a data-tip data-for={id}><Icon name="exclamation-circle" id={id} /></a>
        <ReactTooltip
          id={id}
          place={place}
          type={style}
          effect="solid"
          offset={offset}
        >
          <span dangerouslySetInnerHTML={{ __html: dompurify.sanitize(content) }} />
        </ReactTooltip>
      </span>
    );
  }
}
