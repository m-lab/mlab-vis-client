const regions = [
  // { continent: 'AF', country: 'KE', region: '01', label: 'Baringo (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '02', label: 'Bomet (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '03', label: 'Bungoma (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '04', label: 'Busia (Kenya)' },
  // {
  //   continent: 'AF',
  //   country: 'KE',
  //   region: '05',
  //   label: 'Elgeyo/Marakwet (Kenya)',
  // },
  // { continent: 'AF', country: 'KE', region: '06', label: 'Embu (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '07', label: 'Garissa (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '08', label: 'Homa Bay (Kenya)' },
  // { continent: 'AF', country: 'KE', region: '30', label: 'Niarobi (Kenya)' },

  { continent: 'NA', country: 'CA', region: 'AB', label: 'Alberta (Canada)' },
  {
    continent: 'NA',
    country: 'CA',
    region: 'BC',
    label: 'British Columbia (Canada)',
  },
  { continent: 'NA', country: 'CA', region: 'MB', label: 'Manitoba (Canada)' },
  {
    continent: 'NA',
    country: 'CA',
    region: 'NB',
    label: 'New Brunswick (Canada)',
  },
  {
    continent: 'NA',
    country: 'CA',
    region: 'NL',
    label: 'Newfoundland (Canada)',
  },
  {
    continent: 'NA',
    country: 'CA',
    region: 'NS',
    label: 'Nova Scotia (Canada)',
  },
  { continent: 'NA', country: 'CA', region: 'ON', label: 'Ontario (Canada)' },
  {
    continent: 'NA',
    country: 'CA',
    region: 'PE',
    label: 'Prince Edward Island (Canada)',
  },
  { continent: 'NA', country: 'CA', region: 'QC', label: 'Quebec (Canada)' },
  {
    continent: 'NA',
    country: 'CA',
    region: 'SK',
    label: 'Saskatchewan (Canada)',
  },
  {
    continent: 'NA',
    country: 'CA',
    region: 'NT',
    label: 'Northwest Territories (Canada)',
  },
  { continent: 'NA', country: 'CA', region: 'NU', label: 'Nunavut (Canada)' },
  { continent: 'NA', country: 'CA', region: 'YT', label: 'Yukon (Canada)' },

  { continent: 'NA', country: 'US', region: null, label: 'the United States' },
  { continent: 'NA', country: 'US', region: 'AL', label: 'Alabama' },
  { continent: 'NA', country: 'US', region: 'AK', label: 'Alaska' },
  { continent: 'NA', country: 'US', region: 'AZ', label: 'Arizona' },
  { continent: 'NA', country: 'US', region: 'AR', label: 'Arkansas' },
  { continent: 'NA', country: 'US', region: 'CA', label: 'California' },
  { continent: 'NA', country: 'US', region: 'CO', label: 'Colorado' },
  { continent: 'NA', country: 'US', region: 'CT', label: 'Connecticut' },
  { continent: 'NA', country: 'US', region: 'DE', label: 'Delaware' },
  { continent: 'NA', country: 'US', region: 'FL', label: 'Florida' },
  { continent: 'NA', country: 'US', region: 'GA', label: 'Georgia' },
  { continent: 'NA', country: 'US', region: 'HI', label: 'Hawaii' },
  { continent: 'NA', country: 'US', region: 'ID', label: 'Idaho' },
  { continent: 'NA', country: 'US', region: 'IL', label: 'Illinois' },
  { continent: 'NA', country: 'US', region: 'IN', label: 'Indiana' },
  { continent: 'NA', country: 'US', region: 'IA', label: 'Iowa' },
  { continent: 'NA', country: 'US', region: 'KS', label: 'Kansas' },
  { continent: 'NA', country: 'US', region: 'KY', label: 'Kentucky' },
  { continent: 'NA', country: 'US', region: 'LA', label: 'Louisiana' },
  { continent: 'NA', country: 'US', region: 'ME', label: 'Maine' },
  { continent: 'NA', country: 'US', region: 'MD', label: 'Maryland' },
  { continent: 'NA', country: 'US', region: 'MA', label: 'Massachussets' },
  { continent: 'NA', country: 'US', region: 'MI', label: 'Michigan' },
  { continent: 'NA', country: 'US', region: 'MN', label: 'Minnesota' },
  { continent: 'NA', country: 'US', region: 'MS', label: 'Mississippi' },
  { continent: 'NA', country: 'US', region: 'MO', label: 'Missouri' },
  { continent: 'NA', country: 'US', region: 'MT', label: 'Montana' },
  { continent: 'NA', country: 'US', region: 'NE', label: 'Nebraska' },
  { continent: 'NA', country: 'US', region: 'NV', label: 'Nevada' },
  { continent: 'NA', country: 'US', region: 'NH', label: 'New Hampshire' },
  { continent: 'NA', country: 'US', region: 'NJ', label: 'New Jersey' },
  { continent: 'NA', country: 'US', region: 'NM', label: 'New Mexico' },
  { continent: 'NA', country: 'US', region: 'NY', label: 'New York' },
  { continent: 'NA', country: 'US', region: 'NC', label: 'North Carolina' },
  { continent: 'NA', country: 'US', region: 'ND', label: 'North Dakota' },
  { continent: 'NA', country: 'US', region: 'OH', label: 'Ohio' },
  { continent: 'NA', country: 'US', region: 'OK', label: 'Oklahoma' },
  { continent: 'NA', country: 'US', region: 'OR', label: 'Oregon' },
  { continent: 'NA', country: 'US', region: 'PA', label: 'Pennsylvania' },
  { continent: 'NA', country: 'US', region: 'RI', label: 'Rhode Island' },
  { continent: 'NA', country: 'US', region: 'SC', label: 'South Carolina' },
  { continent: 'NA', country: 'US', region: 'SD', label: 'South Dakota' },
  { continent: 'NA', country: 'US', region: 'TN', label: 'Tennessee' },
  { continent: 'NA', country: 'US', region: 'TX', label: 'Texas' },
  { continent: 'NA', country: 'US', region: 'UT', label: 'Utah' },
  { continent: 'NA', country: 'US', region: 'WA', label: 'Washington' },
  { continent: 'NA', country: 'US', region: 'WV', label: 'West Virginia' },
  { continent: 'NA', country: 'US', region: 'WI', label: 'Wisconsin' },
  { continent: 'NA', country: 'US', region: 'VT', label: 'Vermont' },
  { continent: 'NA', country: 'US', region: 'VA', label: 'Virginia' },
  { continent: 'NA', country: 'US', region: 'WY', label: 'Wyoming' },
];

export default regions.map((r) => {
  const { continent, country, region } = r;
  const id = region
    ? `${continent}/${country}/${region}`
    : `${continent}/${country}`;
  return {
    ...r,
    id,
  };
});
