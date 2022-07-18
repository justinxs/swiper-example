import Vue from 'vue';
import Vuex from 'vuex';
import member from './modules/member';

Vue.use(Vuex);

export default function createStore(options) {
  return new Vuex.Store({
    state: {
      langCode: 'zh-TW',
      curSeo: {},
      loading: false,
      transitionName: '',
      backAction: '',
      nextGo: 0,
      CDN: '',
      firstLoadPath: ''
    },
    actions: {
      back({ commit }) {
        return commit('changeRouteAnimation', 'slide-right');
      },
      foraward({ commit }) {
        return commit('changeRouteAnimation', 'slide-left');
      }
    },
    mutations: {
      loading(state, val) {
        state.loading = val;
      },
      setCurSeo(state, data) {
        state.curSeo = data;
      },
      setLangCode(state, langCode) {
        state.langCode = langCode;
      },
      setCDN(state, CDN) {
        state.CDN = CDN;
      },
      changeRouteAnimation(state, name) {
        state.transitionName = name;
      },
      changeBackAction(state, backAction) {
        state.backAction = backAction;
      },
      setFirstLoadPath(state, val) {
        state.firstLoadPath = val;
      },
      // 1 => forward -1 => back 0 => auto
      setNextGo(state, num) {
        state.nextGo = num;
      }
    },
    modules: {
      member
    }
  });
}
