import axios from 'axios';
import store from '@/store/index.js';

export function saveObject(obj) {
  const url = store.getters.apiURL + '/v1/Visitors';

  const headers = { headers: { 'Content-Type': 'application/json' } };
  return axios.post(url, JSON.stringify(obj), headers);
}
