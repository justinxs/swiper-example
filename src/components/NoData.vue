<template>
  <div class="no-data">
    <img src="~@images/img_zwsj.png" alt="" />
    <span class="w-fc">{{ text || $t('no_data') }}</span>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
};
</script>
