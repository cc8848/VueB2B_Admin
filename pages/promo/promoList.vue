<template>
  <section class="container">
    <div class="header-wrap">
      <div class="radio-wrap">
        <span class="label">{{$t('活动管理.状态')}}</span>
        <el-radio-group v-model="status" @change="changeStatus">
          <el-radio :label="1">{{$t('活动管理.未开始')}}</el-radio>
          <el-radio :label="2">{{$t('活动管理.已开始')}}</el-radio>
          <el-radio :label="3">{{$t('活动管理.已结束')}}</el-radio>
        </el-radio-group>
      </div>
      <div class="actions">
        <el-button @click="addPromo">{{$t('活动管理.新增活动')}}</el-button>
      </div>
    </div>
    <div class="middle-wrap" v-loading="loading">
      <data-table
        :tableData="tableData"
        :tableHeader="tableHeader"
        :dragSortableOption="dragSortableOption"
        row-key="promoId"
        @onDragSortEnd="onDragSortEnd"
        >
      </data-table>
    </div>
    <div class="footer-wrap">
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :currentPage.sync="currentPage"
        :page-size.sync="count"
        @current-change="changePage">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import DataTable from '~/components/global/DataTable';
import axios from 'axios';
const tableHeader = [
  {prop: 'promoId', label: '活动管理.活动ID'},
  {prop: 'promoName', label: '活动管理.活动名称'},
  // {label: '活动管理.活动类型'},
  // {label: '活动管理.活动对象'},
  {prop: 'startTime', label: '活动管理.开始时间', vueFilter: 'formatDate'},
  // {label: '活动管理.状态'},
];
export default {
  layout: 'withNav',
  components: {
    DataTable
  },
  data: function() {
    return {
      status: 1,
      count: 20,
      currentPage: 1,
      promoList: [],
      loading: true
    }
  },
  computed: {
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    tableData: function(){
      return this.promoList;
    },
    tableHeader: function(){
      let operate = {
          prop: 'operate',
          isOperate: true,
          label: '通用.操作',
          operate: [
            {
              text: '活动管理.详情',
              onClick: (row)=>{
                this.toDetail(row);
              }
            },
            {
              text: '活动管理.停止',
              onClick: (row)=>{
                this.confirmDelete(
                  this.stopPromo.bind(this, row)
                );
              }
            }
          ]
      };
      if(this.status === 3){
        operate.operate.pop();
      }
      return [
        ...tableHeader,
        operate
      ];
    },
    dragSortableOption: function(){
      let option = { disabled: true};
      if(this.status === 2){
        option.disabled = false;
      }
      return option
    }
  },
  async created() {
    this.requestPromoList()
  },
  methods: {
    async requestPromoList() {
      this.loading = true;
      try {
        let { data } = await axios.get(`/api/json/guldan/admin/promo/list?status=${this.status}&count=${this.count}&offset=${this.offset}`)
        if (data.success) {
          this.promoList = data.data;
          this.$store.commit('promo/mergeList', {list: data.data, status: this.status});
        } else {
          this.$message.error(data.errMsg)
        }
      } catch (e) {
        console.log(e.message)
      }
      this.loading = false
    },
    async changePage(page) {
      // this.reset();
      this.requestPromoList();
    },
    changeStatus(status){
      this.reset();
      this.requestPromoList();
    },
    reset(){
      this.currentPage = 1;
    },
    addPromo() {
      this.$router.push(`/promo/newPromo`) 
    },
    async toDetail(row) {
      this.$router.push({ name: `promo-id`, params: {id: row.promoId, promoInfo: row}});
    },
    async stopPromo(row){
      let {data} = await axios.post(`/api/json/guldan/admin/promo/stop?promoId=${row.promoId}`);
      if(data.success){
        this.$message.success(this.$t('通用.删除成功'));
        this.requestPromoList();
      }else{
        this.$message.error(data.errMsg);
      }
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
    async onDragSortEnd(event){
      let {newIndex, oldIndex} = event;
      let newRow = this.promoList[newIndex];
      if(newIndex !== oldIndex){
        await this.requestPromoSort(newRow.promoId, newIndex + 1);
        await this.requestPromoList();
      }
    },
    async requestPromoSort(promoId, toIndex){
      this.loading = true;
      let {data} = await axios.post(`/api/json/guldan/admin/promo/sort?promoId=${promoId}&toIndex=${toIndex}`);
      if(data.success){
        this.$message.success(this.$t('通用.操作成功'));
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 2rem 1rem;
  .header-wrap{
    .radio-wrap{
      margin-bottom: 1rem;
      .label{
        margin-right: 1rem;
      }
    }
    .actions{
      display: flex;
      justify-content: space-between;
    }
  }

  .footer-wrap{
    // padding: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
