const ROOT_URL = "http://127.0.0.1:8000"

const setParams = (baseUrl, params = {}) => {
  const query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  let url = baseUrl
  if (query) {
    url = baseUrl + '?' + query;
  }
  return fetch(url)
}

export function getAllSymptoms() {
  return setParams(`${ROOT_URL}/diagnose/symptoms`)
}

export function getConditionForSymptom(params) {
return setParams(`${ROOT_URL}/diagnose/conditionForSymptom`, params)
}

export function getCondition(params) {
  return setParams(`${ROOT_URL}/diagnose/condition`, params)
  }

export function getReportForCondition(params) {
  return setParams(`${ROOT_URL}/diagnose/report`, params)
}

export function getConditionsForSymptom(params) {
  return setParams(`${ROOT_URL}/diagnose/conditions`, params)
}

export function saveDiagnosis(params) {
  return fetch(`${ROOT_URL}/diagnose/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
}
