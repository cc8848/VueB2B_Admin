<template>
  <section class="container" v-loading="loading">
    <div class="header-wrap">
      <div class="radio-wrap">
        <span class="label">{{$t('优惠券.状态')}}</span>
        <el-radio-group v-model="status" @change="changeStatus">
          <el-radio :label="0">{{$t('通用.全部')}}</el-radio>
          <el-radio :label="1">{{$t('优惠券.未生效')}}</el-radio>
          <el-radio :label="2">{{$t('优惠券.已生效')}}</el-radio>
          <el-radio :label="3">{{$t('优惠券.已过期')}}</el-radio>
          <el-radio :label="4">{{$t('优惠券.已删除')}}</el-radio>
        </el-radio-group>
      </div>
      <div class="actions">
        <el-button @click="addCoupon">{{$t('通用.新增')}}</el-button>
      </div>
    </div>
    <data-table :tableHeader="tableHeader" :tableData="tableData"></data-table>
    <div class="footer-wrap">
      <el-pagination
        class="pagination"
        background
        layout="prev, slot, next"
        :currentPage.sync="currentPage"
        :page-size.sync="count"
        @current-change="changePage"
        >
        <slot>
          <span style="text-align:center;">{{currentPage}}</span>
        </slot>
      </el-pagination>
    </div>
  </section>
</template>
<script>
import DataTable from '~/components/global/DataTable';
import axios from 'axios';
import qs from 'qs';
const tableHeader = [
  {prop: 'id', label: 'ID'},
  {prop: 'name', label: '优惠券.优惠券名称'},
  {prop: 'type', label: '优惠券.类型', vueFilter: 'formatCouponType'},
  {prop: 'useScope', label: '优惠券.使用范围', vueFilter: 'formatCouponUseScope'},
  {prop: 'offerScope', label: '优惠券.使用对象', vueFilter: 'formatCouponOfferScope'},
  {prop: 'status', label: '优惠券.状态', vueFilter: 'formatCouponStatus'},
  {prop: '', label: '通用.操作', isOperate: true}
]
export default {
  layout: 'withNav',
  components: {
    DataTable
  },
  data(){
    return {
      count: 20,
      currentPage: 1,
      status: 0,
      couponList: [],
      loading: false
    };
  },
  computed: {
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    tableHeader: function(){
      return [...tableHeader];
    },
    tableData: function(){
      return this.couponList.map((value, index)=>{
        let operate = [
          {
              text: '通用.详情',
              onClick: (row)=>{
                this.toDetail(row);
              }
            },
            {
              text: '通用.删除',
              onClick: (row)=>{
                this.confirmDelete(
                  this.delCoupon.bind(this, row)
                );
              }
            }
        ]
        if(value.status === 3 || value.status === 4){
          operate.pop();
        }
        return {
          ...value, 
          operate: operate
        }
      });
    }
  },
  async created(){
    this.currentPage = this.$store.state.pagesCache.couponListPage || 1;
    await this.requestCouponList();
  },
  methods: {
    async requestCouponList(){
      this.loading = true;
      let params = {
        offset: this.offset,
        count: this.count,
      }
      if(this.status){
        params.status = this.status;
      }
      let {data} = await axios.get(`/api/json/thrall/admin/coupon/list?${qs.stringify(params)}`);
      if(data.success){
        this.couponList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    async requestDeleteCoupon(couponIdList){
      let params = qs.stringify({couponIdList}, { arrayFormat: 'repeat' })
      let {data} = await axios.post('/api/json/thrall/admin/coupon/delete', params);
      if(data.success){
        this.$message.success(this.$t('通用.删除成功'));
        this.requestCouponList();
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async changePage(page){
      this.$store.commit('setPage',{type:'couponListPage',page});
      await this.requestCouponList();
    },
    async changeStatus(){
      this.reset();
      await this.requestCouponList();
    },
    reset(){
      this.currentPage = 1;
      this.$store.commit('setPage',{type:'couponListPage',page: this.currentPage});
    },
    delCoupon(row){
      this.requestDeleteCoupon([row.id]);
    },
    toDetail(row){
      this.$router.push(`couponDetail/${row.id}`)
    },
    addCoupon(){
      this.$router.push(`newCoupon`);
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
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
    display: flex;
    justify-content: flex-end;
  }
}
</style>

