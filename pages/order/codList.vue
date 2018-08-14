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
    <!-- <search-bar @search="handleSearch"></search-bar> -->
    <div class="middle-wrap" v-loading="loading">
      <search-bar @search="handleSearch" :placeholder="$t('订单管理.订单ID')"></search-bar>
      <el-table
      :data="tableData"
      border
      style="width: 100%">
        <el-table-column
          prop="oidNo"
          :label="$t('订单管理.订单ID')"
          >
        </el-table-column>
        <el-table-column
          prop="receiver"
          :label="$t('订单管理.收货人')"
          >
        </el-table-column>
        <el-table-column
          prop="phone"
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
          <template slot-scope="props">{{props.row.orderStatus | formatOrderState}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('订单管理.收款状态')"
          >
          <template slot-scope="props">{{props.row.status | formatCodState}}</template>
        </el-table-column>
        <el-table-column
          :label="$t('订单管理.下单时间')"
        >
          <template slot-scope="props">{{props.row.orderTime | formatDate}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('通用.操作')"
        >
          <template slot-scope="scope">
            <el-button class="mr" @click="toDetail(scope.row)" type="text" size="small">{{$t('通用.详情')}}</el-button>
            <el-popover
              placement="top"
              width="160"
              trigger="click">
              <el-input size="small" :placeholder="$t('订单管理.收款金额')" v-model="scope.row.collectionPrice"></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button type="primary" size="mini" @click="toCollection(scope.row)">{{$t('通用.保存')}}</el-button>
              </div>
              <el-button v-if="scope.row.status !== 2 && scope.row.orderStatus !== 4" :ref="`popover-${scope.row.oidNo}`" slot="reference" type="text" size="small">{{$t('订单管理.收款')}}</el-button>
            </el-popover>
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
      pageSize: 10,
      totalCnt: 0,
      currentPage: 1,
      loading: true,
    }
  },
  async created() {
    this.currentPage = this.$store.state.pagesCache.codListPage || 1
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
      this.currentPage = this.$store.state.pagesCache.codListPage || 1
      this.getTableData()
    },
    async getTableData(key) {
      try {
        this.loading = true
        let { data } = await axios.get(`/api/json/maiev/admin/order/cod/list${key ? `?oidNo=${key}` : `?offset=${this.offset}&status=${this.showOrderState}`}`)
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
        : tableData.filter(data => data.orderStatus === showState)
    },
    changeShowState(showState) {
      this.changePage(1)
    },
    changePage(page) {
      this.currentPage = page
      this.$store.commit('setPage',{type:'codListPage',page})
      this.getTableData()
    },
    async toDetail(row) {
      this.$router.push(`/order/codDetail/${row.oidNo}`)
    },
    async toCollection(row) {
      if(!row.collectionPrice) {
        return this.$message.error(this.$t('订单管理.请填写退款金额'))
      }
      let param = {
        price: Number(row.collectionPrice),
        oidNo: row.oidNo
      }
      let {data} = await axios.post(`/api/json/maiev/admin/order/cod/confirm`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.$refs[`popover-${row.oidNo}`].$el.click()
        this.initPage()
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async handleSearch(key) {
      this.getTableData(key)
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
