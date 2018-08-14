<template>
  <el-input-number ref="inputNumber" v-bind="$attrs" :value="value" @change="handleChange" @input="handleInput"/>
</template>
<script>
export default{
  props: {
    integer: String,
  },
  inheritAttrs: false,
  data(){
    return {
      value: this.$attrs.value
    }
  },
  updated(){
    this.handleChange(this.$attrs.value, this.value);
  },
  methods: {
    setCurrentValue(newVal){
      let step = isNaN(Number(this.$attrs.step)) ? 1 : Number(this.$attrs.step);
      if(!isNaN(newVal)){
        switch (this.integer){
          case 'ceil':
            this.value = Math.ceil(newVal / step) * step;
            break;
          case 'floor':
            this.value = Math.floor(newVal / step) * step;
            break;
          case 'round':
            this.value = Math.round(newVal / step) * step;
            break;
          default:
            this.value = newVal;
        }
        this.$nextTick(function(){
          this.$refs.inputNumber.setCurrentValue(this.value);
        })
      }
      
    },
    handleChange(newVal, oldVal){
      this.setCurrentValue(newVal);
      this.$emit('input', this.value);
      this.$emit('change', this.value, oldVal);
    },
    handleInput(value){
      this.setCurrentValue(value);
      this.$emit('input', this.value);
    }
  }
}
</script>
