export default {
  methods: {
    commonBack(backAction) {
      if ((backAction || this.$store.state.backAction) == 'web') {
        this.$store.commit('setNextGo', -1);
        history.back();
      } else {
        this.$hybird.back();
      }
    }
  }
};
