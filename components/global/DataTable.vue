<template>
  <section class="data-table-wrap">
    <el-table
      ref="table"
      :data="tableData"
      :row-key="rowKey"
      :row-class-name="dragSortableOption.disabled?'':$style&&$style['dragbble-row']"
      border
      :height="height"
      style="width: 100%"
      @selection-change="selectionChange">
      <el-table-column
        v-if="selection"
        type="selection"
        :selectable="selectable">
      </el-table-column>
      <el-table-column
        v-for="(header,idx) in tableHeader"
        :key="idx"
        v-bind="$attrs.header"
        :label="$t(header.label)">
        <template slot-scope="scope">
          <div class="operate" v-if="header.isOperate">
            <el-button
              v-for="(operate,i) in (scope.row[operateKey] || header[operateKey])"
              :key="i"
              @click="operate.onClick(scope.row)"
              type="text"
              size="small"
              v-bind="operate"
              >
              {{$t(operate.text)}}
            </el-button>
          </div>
          <div v-else-if="header.input">
            <el-input v-model="scope.row[header.prop]">
            </el-input>
          </div>
          <div v-else-if="header.inputNumber">
            <input-integer
              :value="scope.row[header.prop]"
              @input="scope.row[header.prop]=$event"
              v-bind="header.inputNumber"
              :min="scope.row[header.prop+'Min'] || header.inputNumber.min"
              :max="scope.row[header.prop+'Max'] || header.inputNumber.max"
              >
            </input-integer>
          </div>
          <div class="content" v-else>
            {{format(scope, header)}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
  import InputInteger from '~/components/global/InputInteger.vue';
  import Vue from 'vue';
  import Sortable from 'sortablejs';
  export default{
    components: {
      InputInteger
    },
    props: {
      tableData: {
        type: Array,
        default: () => { return [] },
        required: true
      },
      tableHeader: {
        type: Array,
        default: () => { return [] },
        required: true
      },
      operateKey: {
        type: String,
        default: ()=>{return 'operate'}
      },
      height: {
        type: [String,Number]
      },
      selection: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Function,
        default: (row, index)=>true
      },
      vueFilters: {
        type: Object,
        default: ()=>Vue.options.filters
      },
      dragSortableOption: {
        type: Object,
        default: function(){
          return {
            disabled: true,
          }
        }
      },
      rowKey: {
        type: [Function, String],
        default: "id"
      }
    },
    watch: {
      dragSortableOption: function(newOption){
        this.setSorableOption(newOption);
      }
    },
    mounted(){
      this.initSortable();
    },
    unmounted(){
      if(this.sortable){
        this.sortable.destroy();
      }
    },
    methods: {
      selectionChange(...args){
        this.$emit('selection-change', ...args);
      },
      clearSelection(){
        if(this.selection){
          this.$refs.table.clearSelection();
        }
      },
      scrollToTop(){
        this.$nextTick(function() {
          let bodyWrapper = this.$refs.table.$el.querySelector('.el-table__body-wrapper')
          bodyWrapper.scrollTop = 0;
        });
      },
      format(scope, header){
        if(this.vueFilters[header.vueFilter]){
          let args = header.filterArgs || [];
          return this.vueFilters[header.vueFilter].call(null, scope.row[header.prop], ...args)
        }
        return scope.row[header.prop]
      },
      setSorableOption(option = {}){
        if(this.sortable){
          for(let [key, value] of Object.entries(option)){
            this.sortable.option(key, value);
          }
        }
      },
      initSortable(){
        const table = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody');
        this.sortable = Sortable.create(table, {
          onEnd: (event) =>{
            const { newIndex, oldIndex } = event;
            const targetRow = this.tableData.splice(oldIndex, 1)[0];
            this.tableData.splice(newIndex, 0, targetRow);
            this.$emit('onDragSortEnd', event);
          }
        })
        this.setSorableOption(this.dragSortableOption);
      }
    }
  }
</script>
<style lang="scss" scoped>
.data-table-wrap{
    padding: 1rem 0;
}
</style>
<style module>
  .dragbble-row{
    cursor: move
  }
</style>

