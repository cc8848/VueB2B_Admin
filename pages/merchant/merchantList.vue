<template>
  <section class="container">
    <div class="header-wrap">
      <div class="input-group">
        <div class="laber">{{$t('商户管理.状态')}}：</div>
        <el-radio-group v-model="showOrderState" @change='changeShowState'>
          <el-radio :label="100">{{$t('商户管理.全部')}}</el-radio>
          <el-radio :label="state.id" v-for="(state,idx) in merchantStateList" :key="idx">{{$t(`商户管理.${state.title}`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="middle-wrap" v-loading="loading">
      <search-bar @search="handleSearch" :placeholder="$t('商户管理.商家名称')"></search-bar>
      <el-table
      :data="tableData"
      border
      style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          >
        </el-table-column>
        <el-table-column
          prop="shopName"
          :label="$t('商户管理.商家名称')"
          >
        </el-table-column>
        <el-table-column
          prop="contacts"
          :label="$t('商户管理.联系人')"
          >
        </el-table-column>
        <el-table-column
          prop="contactNumber"
          :label="$t('商户管理.联系电话')"
          >
        </el-table-column>
        <el-table-column
          prop="countryId"
          :label="$t('商户管理.国家')"
          >
          <template slot-scope="props">{{props.row.countryId | formatCountry}}</template> 
        </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('商户管理.状态')"
          >
          <template slot-scope="props">{{props.row.status | formatMerchantState}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('商户管理.创建时间')"
        >
          <template slot-scope="props">{{props.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('商户管理.操作')"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="small">{{$t('商户管理.详情')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer-wrap">
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="changePage"
        :total="totalCnt">
      </el-pagination>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import SearchBar from '~/components/global/SearchBar'
export default {
  layout: 'withNav',
  components: {
    SearchBar
  },
  data: function() {
    return {
      origTableData: [],
      tableData: [],
      showOrderState: 100,
      pageSize: 20,
      totalCnt: 0,
      currentPage: 1,
      loading: true,
      merchantStateList: [
        {
          title: '待审核',
          id: '0'
        },
        {
          title: '审核通过',
          id: '1'
        },
        {
          title: '审核驳回',
          id: '2'
        }
      ]
    }
  },
  async created() {
    this.initPage()
  },
  computed: {
    offset() {
      return (this.currentPage - 1) * this.pageSize || 0
    },
    ...mapState({
      token: state => state.token
    })
  },
  methods: {
    async initPage() {
      this.getTableData()
    },
    async getTableData({status = '',condition = ''} = {}) {
      try {
        this.loading = true
        let param = {
          countryId: 1,
          status,
          condition,
          count: this.pageSize,
          offset: this.currentPage
        }
        let { data } = await axios.post(`/api/json/gruul/admin/merchant/queryList`, param)
        if (data.success) {
          this.origTableData = data.data.list
          this.totalCnt = data.data.totalCount || 0
          this.filterTableData(this.showOrderState,this.origTableData)
        } else {
          this.$message.error(data.errMsg)
        }
        this.loading = false
      } catch (e) {
        console.log(e.message)
      }
    },
    filterTableData(showState = this.showOrderState,tableData = this.origTableData) {
      this.tableData = showState === 100 
        ? tableData
        : tableData.filter(data => data.status === showState)
    },
    changeShowState(showState) {
      this.filterTableData()
    },
    changePage(page) {
      this.currentPage = page
      this.getTableData()
    },
    async toDetail(row) {
      this.$router.push(`/merchant/merchantDetail/${row.id}`)
    },
    async handleSearch(key) {
      this.getTableData({condition: key})
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 2rem 1rem;
  .header-wrap{

    .input-group{
      display: flex;
    }
  }

  .footer-wrap{
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
