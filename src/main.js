import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import store from './store';
import { getToken } from './util';

Vue.config.productionTip = false
// eslint-disable-next-line no-undef
axios.defaults.baseURL = `${process.env.VUE_APP_API_ENDPOINT}/api`;

axios.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});
axios.interceptors.response.use(
  (response) => response,
  (error) => error.response || error,
);

const globalMixIn = {
  created() {
    const { title } = this.$options;
    if (title) {
      document.title = title;
    }
  },
};

Vue.mixin(globalMixIn);
Vue.use(VueAxios, axios)
const createApp = async () => {
  await store.dispatch('auth/currentUser');

  new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
};

createApp();
