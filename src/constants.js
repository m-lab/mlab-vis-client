/**
 * This file contains constants that are used throughout the site.
 */
import d3 from 'd3';

export const timeAggregations = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export const metrics = [
  {
    value: 'download',
    label: 'Download Speed',
    dataKey: 'download_speed_mbps_median',
    formatter: d3.format('.1f'),
  },
  {
    value: 'upload',
    label: 'Upload Speed',
    dataKey: 'upload_speed_mbps_median',
    formatter: d3.format('.1f'),
  },
  {
    value: 'rtt',
    label: 'Round-trip Time',
    dataKey: 'rtt_avg',
    formatter: d3.format('.1f'),
  },
  {
    value: 'retransmission',
    label: 'Retransmission Rate',
    dataKey: 'retransmit_avg',
    formatter: d3.format('.1f'),
  },
];
