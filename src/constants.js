/**
 * This file contains constants that are used throughout the site.
 */

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
  },
  {
    value: 'upload',
    label: 'Upload Speed',
    dataKey: 'upload_speed_mbps_median',
  },
  {
    value: 'rtt',
    label: 'Round-trip Time',
    dataKey: 'rtt_avg',
  },
  {
    value: 'retransmission',
    label: 'Retransmission Rate',
    dataKey: 'packet_retransmit_rate_avg',
  },
];
