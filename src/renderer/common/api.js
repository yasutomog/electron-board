import store from '../store'
import Vue from 'vue'

export function wait(ms) {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

}

export function get(path, qs) {

  const apiConfig = store.getters.apiConfig
  const authorization = apiConfig['Authorization']
  const apiKey = apiConfig['x-api-key']

  return Vue.http.get('https://api.the-board.jp/v1/' + path, {
    params: qs,
    headers: {
      'Authorization': authorization,
      'x-api-key': apiKey
    }
  })

}