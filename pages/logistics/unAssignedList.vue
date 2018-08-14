<template>
  <section class="container" v-loading="loading">
    <assign-courier
      :visible="assignCourierVisible"
      :orderData="assignOrderData"
      @close="closeAssignCourier"
      @submit="assignCourier">
    </assign-courier>
    <!-- <div class="title">待分配列表</div> -->
    <el-row class="actions">
      <el-col :span="12">
        <el-button @click="showAssginCourier">{{$t('物流管理.分配快递员')}}</el-button>
      </el-col>
      <el-col :span="12">
        <search-bar :placeholder="$t('物流管理.请输入订单ID')" @search="handleSearch"></search-bar>
      </el-col>
    </el-row>
    <data-table
      ref="table"
      :tableData="tableData"
      :tableHeader="tableHeader"
      :selection="true"
       @selection-change="handleSelection"
      class="table">
    </data-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size.sync="count"
        @current-change="handleCurrentChange"
        layout="prev, pager, next">
      </el-pagination>
    </div>
  </section>
</template>
<script>
import AssignCourier from '~/components/pages/logistics/AssignCourier';
import DataTable from '~/components/global/DataTable';
import SearchBar from '~/components/global/SearchBar';
import axios from 'axios';
const tableHeader = [
  {prop: 'id', label: '物流管理.订单ID'},
  {prop: 'receiver', label: '物流管理.收货人'},
  {prop: 'phone', label: '物流管理.联系电话'},
  {prop: 'address', label: '物流管理.收货地址'},
  {prop: 'shopName', label: '物流管理.商家名称'},
  {prop: 'shopAddr', label: '物流管理.商户地址'},
  {prop: 'createTime', label: '物流管理.下单时间', vueFilter: 'formatDate'}
]
export default {
  layout: 'withNav',
  components: {
    AssignCourier,
    DataTable,
    SearchBar
  },
  data: function(){
    return {
      currentPage: 1,
      count: 20,
      condition: '',
      tableHeader: [
        ...tableHeader,
        {
          prop: 'operate',
          label: '通用.操作',
          isOperate: true,
          operate: [
            {
              text: '物流管理.详情',
              onClick: (data) => {
                this.$router.push(`/order/detail/${data.id}?canEdit=false`)
              }
            },
            {
              text: '物流管理.分配快递员',
              onClick: (data) => {
                this.assignOrderData = [data];
                this.showAssginCourier();
              }
            }
          ]
        }
      ],
      unAssignedList: [],
      assignOrderData: [],
      assignCourierVisible: false,
      loading: true,
    }
  },
  computed: {
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    tableData: function(){
      return this.unAssignedList;
    }
  },
  created(){
    this.requestList();
  },
  methods: {
    async requestAsign(params){
      let {data} = await axios.post('/api/json/maiev/admin/order/collect/assign/batch', params);
      if(data.success){
        this.$message.success(this.$t('通用.操作成功'));
        this.requestList();
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestList(){
      let params = {
        status: 1,
        count: this.count,
        offset: this.offset
      }
      if(this.condition){
        params.oidNo = this.condition;
      }
      this.loading = true;
      let {data} = await axios.get(`/api/json/maiev/admin/order/collect/list`,{params: params});
      if(data.success){
        this.unAssignedList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    handleCurrentChange: function(){
      this.requestList();
    },
    reset(){
      this.currentPage = 1;
    },
    handleSearch(key){
      this.condition = key;
      this.reset();
      this.requestList();
    },
    handleSelection(selection){
      this.assignOrderData = selection;
    },
    showAssginCourier: function(){
      if(this.assignOrderData && this.assignOrderData.length > 0){
        this.assignCourierVisible = true;
      }
    },
    closeAssignCourier: function(){
      this.assignCourierVisible = false;
      this.$refs.table.clearSelection();
      this.assignOrderData = [];
    },
    async assignCourier(value){
      let oidNos = this.assignOrderData.map(v=>v.id);
      let courier = value.courier;
      let params = {
        oidNos: oidNos,
        courierId: courier.courierId,
        courierName: courier.courierName
      }
      await this.requestAsign(params);
      this.closeAssignCourier();
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    // padding: 0 8px;
    .title{
      padding: 0  0 16px 0;
    }
    .search-condition{
      float: right;
      width: 60%;
    }
    .table{
      padding: 16px 0;
    }
    >>> .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
