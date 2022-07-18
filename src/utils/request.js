import axios from 'axios';
// import hybird from './hybird';

const service = axios.create({
  baseURL: '',
  timeout: 30000,
  withCredentials: false,
  transformResponse: [
    function (data) {
      return JSON.parse(data);
    }
  ]
});

service.interceptors.request.use(
  (config) => {
    config.params = Object.assign({ v: Date.now() }, config.params);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // 101-系统出错，102-系统维护中，107-参数错误，108-登录失效，109-用户没有权限访问
    // if (response.data.code == 401) {
    //   // 发送登录消息
    //   hybird.postMessage({
    //     msg: 'GAME_ACTION',
    //     data: {
    //       key: 'GAME_ACTION_LOGIN'
    //     },
    //     key: 'CCLIVE'
    //   });
    // }
    return response.data;
  },
  (error) => {
    if (error == 'Error: 网络错误') {
      return Promise.reject(error.message);
    } else {
      return Promise.resolve({ code: 0, msg: error });
    }
  }
);

export default service;
