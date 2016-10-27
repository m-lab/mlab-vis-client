/**
 * This file contains constants that are used throughout the site.
 */
import d3 from 'd3';
import moment from 'moment';

export const defaultStartDate = moment().subtract(1, 'year');
export const defaultEndDate = moment();

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
    binWidth: 4,
    binStart: 0,
    formatter: d3.format('.1f'),
    description: 'Median download speed for provided time range at the selected time aggregation.',
  },
  {
    value: 'upload',
    label: 'Upload Speed',
    unit: 'Mbps',
    dataKey: 'upload_speed_mbps_median',
    countBinKey: 'upload_speed_mbps_bins',
    percentBinKey: 'upload_speed_mbps_percent_bins',
    binWidth: 4,
    binStart: 0,
    formatter: d3.format('.1f'),
    description: 'Median upload speed for provided time range at the selected time aggregation.',
  },
  {
    value: 'rtt',
    label: 'Round-trip Time',
    unit: 'ms',
    dataKey: 'rtt_avg',
    formatter: d3.format('.1f'),
    countBinKey: 'rtt_avg_bins',
    percentBinKey: 'rtt_avg_percent_bins',
    binWidth: 50,
    binStart: 50,
    description: 'Average round-trip time for the speed tests to complete.',
  },
  {
    value: 'retransmission',
    label: 'Retransmission Rate',
    unit: '%',
    dataKey: 'retransmit_avg',
    formatter: d3.format('.1%'),
    countBinKey: 'packet_retransmit_rate_bins',
    percentBinKey: 'packet_retransmit_rate_percent_bins',
    binWidth: 0.01,
    binStart: 0.01,
    description: 'Average Retransmission rate during the speed tests.',
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

export const testThreshold = 30;

// Find and replace on ISP names.
export const ispLabelReplacements = [
  { find: /(d\/\s*b\s*\/a|)/, replace: '' }, // anywhere in the label
  { find: /\s+(LLC|INC|Inc\.|L\.L\.C\.|LTD|Ltd\.)$/i, replace: '' }, // english suffixes
  { find: /(-AS|-ASN)$/, replace: '' }, // international suffixes
  { find: /^(http:\/\/)/, replace: '' }, // prefixes
  { find: /\s*(,|\.)\s*$/, replace: '' }, //ending punctuation
];

export const helpTipContent = {
  'transit-compare-tip': 'Transit ISPs serve to support the backbone of the Internet. Client ISPs send traffic to Transit ISPs to be routed worldwide. MLab servers are located within Transit ISP switching stations.',
  'client-isp-tip': 'Add or remove ISPs to compare. ISP names come from volunteer process of mapping ASNs to names and so are at times confusingly inconsistent with actual ISP names. Multiple ASNs can be owned by a single ISP and so near duplicate names can appear.',
  'metric-tip': 'Specify which metric to visualize.',
  'time-agg-tip': 'Specify how the data should be binned by time.',
  'regional-tip': 'Show or hide baseline value for the location you are viewing.',
  'compare-metrics-tip': 'Shows all metrics for each ISP selected along with location data for reference.',
  'hour-metric-tip': 'Aggregates metric for each hour over time range. Line indicates Average value for each hour.',
  'fixed-time-tip': 'Charts below are based on fixed time data instead of using the selected time from above.',
  'fixed-compare-metrics-tip': 'Compare one metric against another over a set of fixed time ranges.',
  'fixed-metric-tip': 'Shows a histogram of metric data broken up into evenly spaced bins. Each bar shows percent of total tests that fall into that bin.',
  'facet-tip': 'Toggle what to aggregate data by.',
};
