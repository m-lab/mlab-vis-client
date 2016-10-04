import React, { PureComponent, PropTypes } from 'react';
import { TacoTable, DataType, Formatters, Summarizers, TdClassNames } from 'react-taco-table';
import 'react-taco-table/dist/react-taco-table.css';
import './SummaryTable.scss';

const columns = [
  {
    id: 'label',
    type: DataType.String,
    header: 'Name',
  },
  {
    id: 'test_count',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Tests',
    renderer: Formatters.commaFormat,
  },
  {
    id: 'download_speed_mbps_median',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Median',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'download_speed_mbps_avg',
    type: DataType.Number,

    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Avg',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'download_speed_mbps_stddev',
    type: DataType.Number,

    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.minClassName,
    header: 'SD',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'download_speed_mbps_min',
    type: DataType.Number,

    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Min',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'download_speed_mbps_max',
    type: DataType.Number,

    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Max',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'upload_speed_mbps_median',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Median',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'upload_speed_mbps_avg',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Avg',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'upload_speed_mbps_stddev',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.minClassName,
    header: 'SD',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'upload_speed_mbps_min',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Min',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'upload_speed_mbps_max',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.maxClassName,
    header: 'Max',
    renderer: Formatters.decFormat(1),
  },
  {
    id: 'retransmit_avg',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.minClassName,
    header: 'Avg',
    renderer: Formatters.percentFormat(1),
  },
  {
    id: 'rtt_avg',
    type: DataType.Number,
    summarize: Summarizers.minMaxSummarizer,
    tdClassName: TdClassNames.minClassName,
    header: 'Avg',
    renderer: d => `${Formatters.decFormat(2, d)}ms`,
  },
];

const columnGroups = [
  {
    columns: [
      'label',
      'test_count',
    ],
  },
  {
    header: 'Download Speed (MBps)',
    columns: [
      'download_speed_mbps_median',
      'download_speed_mbps_avg',
      'download_speed_mbps_stddev',
      'download_speed_mbps_min',
      'download_speed_mbps_max',
    ],
  },
  {
    header: 'Upload Speed (MBps)',
    columns: [
      'upload_speed_mbps_median',
      'upload_speed_mbps_avg',
      'upload_speed_mbps_stddev',
      'upload_speed_mbps_min',
      'upload_speed_mbps_max',
    ],
  },
  {
    header: 'Retransmit',
    columns: [
      'retransmit_avg',
    ],
  },
  {
    header: 'RTT',
    className: 'rtt-group',
    columns: [
      'rtt_avg',
    ],
  },
];


/**
 * Table for showing summary data
 */
export default class SummaryData extends PureComponent {
  static propTypes = {
    bottomData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const { data, bottomData } = this.props;
    console.log('got data =', data);
    console.log('got bottomData =', bottomData);
    console.log({
      summarize: Summarizers.minMaxSummarizer,
      tdClassName: TdClassNames.maxClassName,
    });
    return (
      <div className="SummaryTable">
        <TacoTable
          columns={columns}
          data={data}
          bottomData={bottomData}
          columnGroups={columnGroups}
        />
      </div>
    );
  }
}
