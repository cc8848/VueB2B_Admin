<template>
  <section class="container" v-loading="loading">
    <!-- <div class="title">{{$t('物流管理.已分配列表')}}</div> -->
    <el-row class="order-options">
      <el-col :span="18" class="radio-wrap">
        <span class="label">{{$t('物流管理.类型')}}</span>
        <el-radio-group v-model="type" @change="handleTypeChange">
          <el-radio :label="0">{{$t('通用.全部')}}</el-radio>
          <el-radio :label="2">{{$t('物流管理.COD订单')}}</el-radio>
          <el-radio :label="1">{{$t('物流管理.普通订单')}}</el-radio>
        </el-radio-group>
      </el-col>
      <search-bar :placeholder="$t('物流管理.请输入订单ID')" @search="handleSearch"></search-bar>
    </el-row>
    <el-row class="courier-options">
      <el-col :span="18" class="area-wrap">
        <span class="label">{{$t('物流管理.配送地区')}}</span>
        <address-area v-model="area" class="area" type="city" size="small" @change="handleAreaChange" clearable></address-area>
      </el-col>
      <search-bar :placeholder="$t('物流管理.请输入快递员')" @search="handleSearchCourier"></search-bar>
    </el-row>
    <data-table :tableData="tableData" :tableHeader="tableHeader" class="table"></data-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size.sync="count"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        >
      </el-pagination>
    </div>
  </section>
</template>
<script>
import AddressArea from '~/components/pages/logistics/AddressArea';
import DataTable from '~/components/global/DataTable';
import SearchBar from '~/components/global/SearchBar';
import axios from 'axios';
const tableHeader = [
  {prop: 'id', label: '物流管理.订单ID'},
  {prop: 'uid', label: '物流管理.UID'},
  {prop: 'receiver', label: '物流管理.收货人'},
  {prop: 'phone', label: '物流管理.联系电话'},
  {prop: 'address', label: '物流管理.收货地址'},
  {prop: 'payPrice', label: '物流管理.订单金额',},
  {prop: 'courierName', label: '物流管理.快递员'},
  {prop: 'status', label: '物流管理.订单状态', vueFilter: 'formatOrderState'},
  {prop: 'type', label: '物流管理.类型', vueFilter: 'formatAssignedOrderType'}
];

export default {
  layout: 'withNav',
  components: {
    AddressArea,
    DataTable,
    SearchBar
  },
  data(){
    return {
      type: 0,
      currentPage: 1,
      count: 20,
      condition: '',
      area: {},
      tableHeader: [...tableHeader],
      assignedList: [],
      loading: true,
    }
  },
  computed: {
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    tableData: function(){
      return this.assignedList;
    }
  },
  created(){
    this.requestList();
  },
  methods: {
    async requestList(){
      let params = {
        status: 3,
        count: this.count,
        offset: this.offset
      };
      if(this.type){
        params.type = this.type;
      }
      if(this.condition){
        params.oidNo = this.condition;
      }
      if(this.courierName){
        params.courierName = this.courierName;
      }
      if(this.area && this.area.id){
        params.sysAddrId = this.area.id;
      }
      this.loading = true;
      let {data} = await axios.get(`/api/json/maiev/admin/order/collect/list`,{params: params});
      if(data.success){
        this.assignedList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    reset(){
      this.currentPage = 1;
      this.assignedList = [];
    },
    handleCurrentChange(){
      this.requestList();
    },
    handleTypeChange(){
      this.reset();
      this.requestList();
    },
    handleAreaChange(){
      if(this.area.area === '' || this.area.city === '' || typeof this.area.id === 'number' ){
        this.reset();
        this.requestList();
      }
    },
    handleSearch(key){
      this.condition = key;
      this.reset();
      this.requestList();
    },
    handleSearchCourier(key){
      this.courierName = key;
      this.reset();
      this.requestList();
    }
  }
}
</script>
<style lang="scss" scoped>
  .container{
    // padding: 0 8px;
    .title{
      padding: 0  0 16px 0;
    }
    .order-options{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 7px;
    }
    .courier-options{
      display: flex;
      align-items: center;
      padding-top: 7px;
    }
    .radio-wrap,.area-wrap{
      .label{
        margin-right: 16px;
      }
      // padding: 12px 0;
    }
    .area-wrap{
      .area{
        display: inline-block;
      }
    }
    .search-condition{
      float: right;
      width: 60%;
    }
    .table{
      padding: 16px 0;
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>


