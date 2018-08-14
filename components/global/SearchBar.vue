<template>
  <div class="search">
    <div class="search-input">
      <el-input :type="type" clearable v-model="value" style="width:10rem;" :placeholder="placeholder" size="small" autofocus></el-input>
    </div>
    <div class="search-but">
      <el-button type="primary" @click.native.prevent="handleSearch" size="small">{{$t('通用.搜索')}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      value: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: 'input'
    }
  },
  methods: {
    handleSearch() {
      // if(!this.value)  return 
      this.$emit('search',this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem;

  &-input{
    margin-right: 1rem;
  }
}
</style>
