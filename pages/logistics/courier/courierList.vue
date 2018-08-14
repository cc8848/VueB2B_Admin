<template>
  <section class="container" v-loading="loading">
    <el-row>
      <el-col :span="12">
        <el-button @click="newCourier">{{$t('物流管理.新增')}}</el-button>
      </el-col>
      <el-col :span="12">
        <search-bar :placeholder="$t('物流管理.请输入快递员')" @search="handleSearch"></search-bar>
      </el-col>
    </el-row>
    <data-table :tableData="tableData" :tableHeader="tableHeader" class="courier-table"></data-table>
    <div class="courier-pagination">
      <el-pagination
        background
        :current-page.sync="offset"
        :page-size.sync="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </div>
  </section>
</template>
<script>
import DataTable from '~/components/global/DataTable';
import SearchBar from '~/components/global/SearchBar';
import axios from 'axios';
const tableHeader = [
  {prop: 'courierId', label: '物流管理.快递员编号'},
  {prop: 'courierName', label: '物流管理.姓名'},
  {prop: 'courierSex', label: '物流管理.性别', vueFilter: 'formatSex'},
  {prop: 'courierPhone', label: '物流管理.联系电话'},
  {prop: 'courierAddress', label: '物流管理.地址'},
  {prop: 'count', label: '物流管理.物流量'},
  {prop: 'courierArea', label: '物流管理.配送地区'},
  {prop: 'createTime', label: '物流管理.注册日期', vueFilter: 'formatDate'}
]
export default {
  layout: 'withNav',
  components: {
    DataTable,
    SearchBar
  },
  data: function(){
    return {
      condition: '',
      total: 0,
      offset: 1,
      count: 20,
      courierList: [],
      tableHeader: [
        ...tableHeader,
        {
          prop: 'operate',
          label: '通用.操作',
          isOperate: true,
          operate: [
            {
              text: '通用.详情',
              onClick: (data) => {
                this.$router.push(`/logistics/courier/courierDetail/${data.courierId}`)
              }
            },
            {
              text: '物流管理.删除',
              onClick: (data) => {
                this.confirmDelete(
                  this.requestDelCourier.bind(this, data.courierId)
                );
              }
            }
          ]
        }
      ]
    }
  },
  computed: {
    tableData: function(){
      return this.courierList.map((value)=>{
        return {
          ...value,
          courierAddress: value.courierLoca + value.courierAddr,
        }
      })
    }
  },
  async created() {
    await this.requestCourierList();
  },
  methods: {
    newCourier(){
      this.$router.push('/logistics/courier/newCourier');
    },
    async requestCourierList(){
      this.loading = true;
      try{
        let { data } = await axios.post(`/api/json/zuljin/admin/courier/queryList?offset=${this.offset}&count=${this.count}&condition=${this.condition}`);
        if(data.success && data.data && Array.isArray(data.data.list)){
          this.courierList = data.data.list;
          this.total = data.data.totalCount;
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
      this.loading = false;
    },
    async requestDelCourier(courierId){
      try{
        let { data } = await axios.post(`/api/json/zuljin/admin/courier/del?courierId=${courierId}`);
        if(data.success){
          this.$message.success(this.$t('通用.删除成功'));
          await this.requestCourierList();
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
    },
    handleSizeChange(val) {
      this.count = val;
      this.requestCourierList();
    },
    handleCurrentChange(val) {
      this.requestCourierList();
    },
    async handleSearch(key){
      this.condition = key;
      await this.requestCourierList();
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    }
  }
}
</script>
<style scoped lang="scss">
  .container{
    .search-condition{
      width: 60%;
      float: right;
    }
    .courier-pagination{
      display: flex;
      justify-content: center;
    }
  }
</style>

