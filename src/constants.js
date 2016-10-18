/**
 * This file contains constants that are used throughout the site.
 */
import d3 from 'd3';
import moment from 'moment';

// TODO: change defaults to more recent time period when data is up-to-date
export const defaultStartDate = moment('2015-07-01');
export const defaultEndDate = moment('2016-07-01');

export const timeAggregations = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export const metrics = [
  {
    value: 'download',
    label: 'Download Speed',
    unit: 'Mbps',
    dataKey: 'download_speed_mbps_median',
    countBinKey: 'download_speed_mbps_bins',
    percentBinKey: 'download_speed_mbps_percent_bins',
    formatter: d3.format('.1f'),
  },
  {
    value: 'upload',
    label: 'Upload Speed',
    unit: 'Mbps',
    dataKey: 'upload_speed_mbps_median',
    countBinKey: 'upload_speed_mbps_bins',
    percentBinKey: 'upload_speed_mbps_percent_bins',
    formatter: d3.format('.1f'),
  },
  {
    value: 'rtt',
    label: 'Round-trip Time',
    unit: 'ms',
    dataKey: 'rtt_avg',
    formatter: d3.format('.1f'),
  },
  {
    value: 'retransmission',
    label: 'Retransmission Rate',
    unit: '%',
    dataKey: 'retransmit_avg',
    formatter: d3.format('.1p'),
  },
];

export const facetTypes = [
  {
    value: 'location',
    label: 'Location',
    idKey: 'location_key',
    labelKey: 'client_location_label',
  },
  {
    value: 'clientIsp',
    label: 'Client ISP',
    idKey: 'client_asn_number',
    labelKey: 'client_asn_name',
  },
  {
    value: 'transitIsp',
    label: 'Transit ISP',
    idKey: 'server_asn_number',
    labelKey: 'server_asn_name',
  },
];

// Find and replace on ISP names.
export const ispLabelReplacements = [
  { find: /(d\/\s*b\s*\/a|)/, replace: '' }, // anywhere in the label
  { find: /\s+(LLC|INC|Inc\.|L\.L\.C\.|LTD)$/i, replace: '' }, // english suffixes
  { find: /(-AS|-ASN)$/, replace: '' }, // international suffixes
  { find: /^(http:\/\/)/, replace: '' }, // prefixes
  { find: /\s*(,|\.)\s*$/, replace: '' }, //ending punctuation
];
