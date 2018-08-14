<template>
  <section class="container">
    <div class="middle-wrap" v-loading="loading">
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
          prop="countryId"
          :label="$t('用户管理.国家')"
          >
          <template slot-scope="props">{{props.row.countryId | formatCountry}}</template> 
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          :label="$t('用户管理.账户名称')"
          >
        </el-table-column>
        <el-table-column
          prop="captcha"
          :label="$t('用户管理.验证码')"
          >
        </el-table-column>
        <el-table-column
          prop="captcha"
          :label="$t('用户管理.类型')"
          >
          <template slot-scope="props">{{props.row.type | formatCaptcha}}</template>
        </el-table-column>
        </el-table-column>
        <el-table-column
          :label="$t('用户管理.创建时间')"
        >
          <template slot-scope="props">{{props.row.createTime | formatDate}}</template>
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
export default {
  layout: 'withNav',
  data: function() {
    return {
      origTableData: [],
      tableData: [],
      showOrderState: 100,
      pageSize: 20,
      totalCnt: 0,
      currentPage: 1,
      loading: true
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
        let { data } = await axios.post(`/api/json/wrynn/admin/user/querySmsList`, param)
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
      this.$router.push(`/user/detail/${row.uid}`)
    },
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
