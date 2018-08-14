<template>
  <section class="container">
    <div class="header-wrap">
      <div class="input-group">
        <div class="laber">{{$t('订单管理.订单状态')}}：</div>
        <el-radio-group v-model="showOrderState" @change='changeShowState'>
          <el-radio :label="100">{{$t('通用.全部')}}</el-radio>
          <el-radio :label="state.id" v-for="(state,idx) in orderStateList" :key="idx">{{$t(`订单管理.${state.title}`)}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="middle-wrap" v-loading="loading">
      <search-bar @search="handleSearch" :placeholder="$t('订单管理.订单ID')"></search-bar>
      <el-table
      :data="tableData"
      border
      style="width: 100%">
        <el-table-column
          prop="id"
          :label="$t('订单管理.订单ID')"
          >
        </el-table-column>
        <el-table-column
          prop="uid"
          label="UID"
          >
        </el-table-column>
        <el-table-column
          prop="receiver"
          :label="$t('订单管理.收货人')"
          >
        </el-table-column>
        <el-table-column
          prop="receiverPhone"
          :label="$t('订单管理.联系电话')"
          >
        </el-table-column>
        <el-table-column
          prop="price"
          :label="$t('订单管理.实际支付')"
          >
          <template slot-scope="props">{{props.row.actualPrice | priceFormat}}</template> 
        </el-table-column>
        <el-table-column
          prop="address"
          :label="$t('订单管理.收货地址')"
          >
        </el-table-column>
        <el-table-column
          :label="$t('订单管理.订单状态')"
          >
          <template slot-scope="props">{{props.row.status | formatOrderState}}</template>
        </el-table-column>
        <el-table-column
          prop="merchantId"
          :label="$t('订单管理.商户ID')"
          >
        </el-table-column>
        <el-table-column
          :label="$t('订单管理.下单时间')"
        >
          <template slot-scope="props">{{props.row.createTime | formatDate}}</template>
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
        layout="prev, slot, next"
        background
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
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
      this.currentPage = this.$store.state.pagesCache.orderListPage || 1
      this.getOrderList()
    },
    async getOrderList(key) {
      try {
        let { data } = await axios.get(`/api/json/maiev/admin/order/list${key ? `?key=${key}` :  `?offset=${this.offset}&status=${this.showOrderState}`}`)
        if (data.success) {
          this.origTableData = data.data
          this.tableData = data.data
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
      this.$store.commit('setPage',{type:'orderListPage',page})
      this.getOrderList()
    },
    async toDetail(row) {
      this.$router.push(`/order/detail/${row.id}`)
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
