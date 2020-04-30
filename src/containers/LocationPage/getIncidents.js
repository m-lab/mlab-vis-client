// require modules
const moment = require('moment');
const axios = require('axios');

async function getIncidentWithPromiseAxios(responseText, index) {
  const items = responseText.items;
  const request = axios.get(items[index].mediaLink)
  return request
    .then(result => { return result.data; })
    .catch(error => { throw error; });
}

async function getDataWithPromiseAxios() {
  const request = axios.get('https://storage.googleapis.com/storage/v1/b/incidents-location-hierarchy/o')
  return request
    .then(result => { return result.data; })
    .catch(error => { throw error; });
}

/**
 * Takes in a startDate, endDate, and locationCode and returns a dictionary which has
 * asn values as keys and an array of incidents as values.
 * @param {Moment, Moment, string}
 * @return {dictionary}
 */
async function getDataAxios(startDate, endDate, locationCode) {
  try {
    const dict = {};
    let count = 0;

    let response = await getDataWithPromiseAxios();

    for (let i = 0; i < response.items.length; i++) {
      let incident = await getIncidentWithPromiseAxios(response, i);
      count += 1;
      for (let j = 0; j < incident.length; j++) {
        if (
          incident[j].location === locationCode &&
          moment(incident[j].goodPeriodStart).isAfter(startDate) &&
          moment(incident[j].badPeriodEnd).isBefore(endDate)
        ) {
          const asn = incident[j].aSN;
          if (asn in dict) {
            dict[asn] = dict[asn].push(incident[j]);
          } else {
            dict[asn] = [incident[j]];
          }
        }
      }
    }
    // // TODO: delete, just for debugging
    // console.log(count);
    // console.log(dict);
  } catch(error) {
    console.log(error);
  }


}

export default function useAsyncHook(startDate, endDate, locationId) {
  const [result, setResult] = React.useState({});

  React.useEffect(() => {
    async function fetchIncidentData() {
      try {
        const dict = {};

        const response = await getDataWithPromiseAxios();

        for (let i = 0; i < response.items.length; i++) {
          let incident = await getIncidentWithPromiseAxios(response, i);
          for (let j = 0; j < incident.length; j++) {
            if (
              incident[j].location === locationCode &&
              moment(incident[j].goodPeriodStart).isAfter(startDate) &&
              moment(incident[j].badPeriodEnd).isBefore(endDate)
            ) {
              const asn = incident[j].aSN;
              if (asn in dict) {
                dict[asn] = dict[asn].push(incident[j]);
              } else {
                dict[asn] = [incident[j]];
              }
            }
          }
        }

        setResult(dict);
      } catch (error){ console.log("error inside useAsyncHook: ", error);}
    }

    fetchIncidentData();
  }, [startDate, endDate, locationId]);

  return result;
}

// // TODO: delete, just a sample call
// let startDate = '2015-05-01T00:00:00Z';
// let endDate = '2018-08-02T00:00:00Z';
// let locationCode = 'na';
// getDataAxios(startDate, endDate, locationCode);

// const _getData = getDataAxios;
// export { _getData as getData };