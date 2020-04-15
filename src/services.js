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
  return setParams("http://127.0.0.1:8000/diagnose/symptoms")
}

export function getConditionForSymptom(params) {
return setParams("http://127.0.0.1:8000/diagnose/condition", params)
}

export function getReportForCondition(params) {
  return setParams("http://127.0.0.1:8000/diagnose/report", params)
}

export function getConditionsForSymptom(params) {
  return setParams("http://127.0.0.1:8000/diagnose/conditions", params)
}
