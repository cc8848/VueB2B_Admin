<template>
  <section class="container">
    <div class="header-wrap">
      <el-button @click="$router.push('/operation/push/newPush')">{{$t('菜单.新增推送')}}</el-button>
    </div>
    <div class="middle-wrap" v-loading="loading">
      <!-- <search-bar @search="handleSearch" :placeholder="$t('运营管理.订单ID')"></search-bar> -->
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
          prop="title"
          :label="$t('运营管理.标题')"
          >
        </el-table-column>
        <el-table-column
          prop="uid"
          label="UID"
          >
          <template slot-scope="props">
            <span v-if="(props.row.push_type === 1 && props.row.uid === '-1') || (props.row.push_type === 2 && props.row.phone === '-1')">{{$t('运营管理.全部用户')}}</span>
            <span v-else>{{$t('运营管理.指定用户')}}</span>
          </template> 
        </el-table-column>
        <el-table-column
          prop="type"
          :formatter="formatType"
          :label="$t('运营管理.推送类型')"
          >
        </el-table-column>
        <el-table-column
          prop="push_type"
          :formatter="formatPushType"
          :label="$t('运营管理.推送方式')"
          >
        </el-table-column>
        <el-table-column
          prop="push_time"
          :label="$t('运营管理.发送时间')"
          >
          <template slot-scope="props">
            <span v-if="props.row.push_time === -1">{{$t('运营管理.立即发送')}}</span>
            <span v-if="props.row.push_time !== -1">{{props.row.push_time | formatDate}}</span>
          </template> 
        </el-table-column>
        <el-table-column
          :label="$t('通用.状态')"
          prop="status"
          :formatter="formatStatus"
          >
        </el-table-column>
        <el-table-column
          :label="$t('通用.创建时间')"
        >
          <template slot-scope="props">{{props.row.create_time | formatDate}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('通用.操作')"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="small">{{$t('通用.详情')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer-wrap">
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        background
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="totalCount"
        @current-change="changePage"
      >
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
      currentPage: 1,
      totalCount: 0,
      loading: true,
    }
  },
  async created() {
    this.initPage()
  },
  computed: {
    pageTableData: {
      get: function() {
        let startIdx = (this.currentPage - 1) * this.pageSize
        return this.tableData.slice( startIdx, startIdx + this.pageSize)
      },
      set: function(val) {
        return val
      } 
    },
    offset: function() {
      return this.pageSize * (this.currentPage - 1);
    },
    ...mapState({
      token: state => state.token
    })
  },
  methods: {
    async initPage() {
      this.getOrderList()
    },
    async getOrderList(key) {
      try {
        let { data } = await axios.get(`/api/json/brann/admin/push/history${key ? `?key=${key}` :  `?offset=${this.currentPage}`}`)
        if (data.success) {
          this.origTableData = data.data.list
          this.tableData = data.data.list
          this.totalCount = data.data.totalCount
          // this.filterTableData(this.showOrderState,data.data)
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
      this.changePage(1)
    },
    changePage(page) {
      this.currentPage = page
      this.getOrderList()
    },
    formatType(row,column,cellValue,index) {
      let stateMap = {
        1: this.$t('运营管理.文本'),
        2: this.$t('运营管理.图片'),
        3: this.$t('运营管理.链接')
      }
      return stateMap[cellValue]
    },
    formatPushType(row,column,cellValue,index) {
      let stateMap = {
        1: this.$t('运营管理.横幅'),
        2: this.$t('运营管理.短信')
      }
      return stateMap[cellValue]
    },
    formatStatus(row,column,cellValue,index) {
      let stateMap = {
        1: this.$t('运营管理.未生效'),
        2: this.$t('运营管理.已生效')
      }
      return stateMap[cellValue || 1]
    },
    async toDetail(row) {
      this.$store.commit('setPushDetail',row)
      this.$router.push(`/operation/push/detail`)
    },
    async handleSearch(key) {
      this.getOrderList(key)
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 2rem 1rem;
  .header-wrap{
    padding: 1rem 0;  
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
