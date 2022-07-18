export default {
  namespaced: true,
  state: () => ({
    info: null
  }),
  actions: {},
  mutations: {
    setInfo(state, data) {
      state.info = data;
    }
  }
};
