import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiURL: 'https://192.168.0.100:7096/api',
  },
  getters: {
    apiURL(state) {
      return state.apiURL;
    },
  },
});
