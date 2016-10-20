import React, { PureComponent, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

import { Icon } from '../../components';

import './HelpTip.scss';

/**
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
    const { id, style, content, place } = this.props;
    const offset = { top: -5, left: -8 };

    return (
      <span className="HelpTip">
        <a data-tip data-for={id}><Icon name="question-circle" id={id} /></a>
        <ReactTooltip
          id={id}
          place={place}
          type={style}
          effect="solid"
          offset={offset}
        >
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </ReactTooltip>
      </span>
    );
  }
}
