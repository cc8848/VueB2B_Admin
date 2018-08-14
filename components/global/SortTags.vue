<template>
  <section class="sort">
    <draggable v-model="sortTagList" :options="{group:'tag'}" @start="drag=true" @end="handleDragEnd">
      <el-tag
        :key="idx"
        v-for="(tag,idx) in sortTagList"
        closable
        :disable-transitions="false"
        @close="handleClose(tag,idx)">
        {{tag}}
      </el-tag>  
    </draggable>
    <el-input
    class="input-new-tag ml"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="handleInputConfirm"
    @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag ml" size="small" @click="showInput">+ {{newTagName}}</el-button>
  </section>
</template>
<script>
import draggable from 'vuedraggable'
export default{
    components: {
        draggable
    },
    props: {
        sortList: { 
          required: true,
          type: Array
        },
        repeatable: { // 是否可重复,默认不可
            required: false,
            type: Boolean,
            default: false
        },
        newTagName: { // 新增标签名
            type: String,
            default: 'New Tag'
        }
    },
    data() {
        return {
            drag: false,
            inputVisible: false,
            inputValue: '',
            sortTagList: []
        }
    },
    created() {

    },
    computed: {

    },
    watch: {
        sortList(newVal,oldVal) {
            this.sortTagList = newVal
        }
    },
    methods: {
        handleDragEnd() {
            this.drag = false
            this.$emit('listChange',this.sortTagList)
        },
        handleClose(tag,idx) {
            this.sortTagList.splice(idx, 1);
            this.$emit('listChange',this.sortTagList)
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                if(!this.repeatable && this.sortTagList.indexOf(inputValue) >= 0) {
                    // ----------------------  处理重复，暂时不用提示  ---------------------
                } else {
                    this.sortTagList.push(inputValue);
                    this.$emit('listChange',this.sortTagList)
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
            
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
    }
}
</script>
<style scoped lang="scss">
.sort{
    display: flex;

    .ml{
        margin-left: 1rem;
    }
}

</style>
<style scoped>
  .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>