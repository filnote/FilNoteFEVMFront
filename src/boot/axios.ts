import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { swalAlert } from 'src/common/tools';
declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}
const apiBaseUrl = process.env.API_BASE_URL;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: apiBaseUrl ?? '' });

export default defineBoot(({ app }) => {
  api.interceptors.response.use(
    function (response) {
      const data = response.data;
      if (data.status !== 0) {
        swalAlert.error(data.message);
        return Promise.reject(new Error(data.message));
      }
      return data;
    },
    function (error) {
      let errorMessage = 'Network error occurred';
      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message || `Request failed with status ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
      }
      swalAlert.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    },
  );
  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, apiBaseUrl };
