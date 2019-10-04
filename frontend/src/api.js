import axios from 'axios';

const base_url = 'http://localhost:8000/';

export const fetchDevices = () => {
    return axios.get(base_url + 'api/devices');
}

export const fetchAlexaDevices = offset => {

  return axios.get(base_url + 'api/alexa/devices/?offset=' + offset);
}

export const fetchGoogleDevices = offset => {
  return axios.get(base_url + 'api/google/devices/?offset=' + offset);
}

export const fetchCategores = () => {
    return axios.get(base_url + 'api/categories');
}

export const fetchAlexaSkills = () => {
    return axios.get(base_url + 'api/alexa/skills');
}

export const fetchApps = (limit, offset, device, category, searchText) => {
  if (searchText === '')
    return axios.get(base_url + 'api/apps?limit=' + limit + '&offset=' + offset + '&device=' + device + '&category=' + category);
  else
    return axios.get(base_url + 'api/apps?limit=' + limit + '&offset=' + offset + '&device=' + device + '&category=' + category + '&searchText=' + searchText);
}

export const fetchAuthors = () => {
    return axios.get(base_url + 'api/authors');
}

export const fetchReviews = () => {
    return axios.get(base_url + 'api/alexa/reviews');
}

export const submitNewApp = (alexa_url, google_url, email) => {
  return axios.post(base_url + 'api/addNewApp', {'alexa': alexa_url, 'google': google_url, 'email': email});
}
