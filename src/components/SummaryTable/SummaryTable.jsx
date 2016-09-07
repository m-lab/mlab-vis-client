import React, { PureComponent, PropTypes } from 'react';
import { TacoTable, DataType, Formatters } from 'react-taco-table';
import 'react-taco-table/dist/react-taco-table.css';


const columns = [
  {
    id: 'label',
    type: DataType.String,
    header: 'Name',
  },
  {
    id: 'test_count',
    type: DataType.Number,
    header: '# Tests',
    renderer: Formatters.commaFormat,
  },
  {
    id: 'download_speed_mbps_median',
    type: DataType.Number,
    header: 'Download Speed (Median, Mbps)',
    renderer: Formatters.decFormat(2),
  },
  {
    id: 'upload_speed_mbps_median',
    type: DataType.Number,
    header: 'Upload Speed (Median, Mbps)',
    renderer: Formatters.decFormat(2),
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

  render() {
    const { data, bottomData } = this.props;

    return (
      <div className="SummaryTable">
        <TacoTable columns={columns} data={data} bottomData={bottomData} />
      </div>
    );
  }
}
