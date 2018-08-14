<template>
  <section class="container">
    <div class="header">
      <div class="header-name">{{$t('统计.数据统计')}}</div>
    </div>
    <div class="block">
      <el-alert class="alert" :title="$t('统计.订单数据')" type="success" :closable="false"><span @click="toggleChart('order')" class="edit">{{$t('通用.切换')}}</span></el-alert>
      <data-table v-if="!showState.order" :tableData="orderInfoList" :header="{headerAlign:'center',align:'center'}" :tableHeader="tableHeader" ></data-table>
      <mix-chart v-else id="order-chart" :title="$t('统计.订单数据')" width="100%" :xData="xData" :series="orderSeries"></mix-chart>
    </div>
    <div class="block">
      <el-alert class="alert" :title="$t('统计.用户数据')" type="success" :closable="false"></el-alert>
      <data-table :tableData="userInfoList" :header="{headerAlign:'center',align:'center'}" :tableHeader="tableHeader" ></data-table>
    </div>
  </section>
</template>

<script>
import DataTable from '~/components/global/DataTable'
import MixChart from '~/components/global/MixChart'
import axios from 'axios'
import Vue from 'vue';
export default {
  layout: 'withNav',
  components: {
    DataTable, MixChart
  },
  data() {
    return {
      statInfo: {},
      showState: {
        order: false
      },
      tableHeader: [
        {prop: 'name', label: '统计.指标',vueFilter: 'formatStatName'},
        {prop: 'today', label: '统计.今天'},
        {prop: 'yesterday', label: '统计.昨天'},
        {prop: 'lastWeek', label: '统计.上个星期'},
        {prop: 'lastMonth', label: '统计.上个月'},
        {prop: 'total', label: '统计.总计'},
      ],
      xData: [], //图表横坐标
      orderInfoList: [],//订单数据列表
      orderSeries: [],//订单图表数据
      userInfoList: [],//用户数据列表
    }
  },
  created() {
    this.getStatInfo()
  },
  methods: {
    async getStatInfo() {
      let {data} = await axios.get(`/api/json/voljin/admin/overview/stat`)
      if(data.success) {
        this.statInfo = data.data
        this.initTableData(data.data)
        this.initChartData(data.data)
      } else {
        this.$message.error(data.errMsg)
      }
    },
    initTableData(info) {
      const initList = obj => 
        Object.entries(obj).map(([key,value]) => ({
          name: key,
          ...value
        }))
      
      this.orderInfoList = initList(info.order)
      this.userInfoList = initList(info.user)
    },
    initChartData(info) {
      const initList = obj => 
        Object.entries(obj).map(([key,value]) => {
          return {
            origName: key,
            name: Vue.options.filters.formatStatName(key),
            type: key === 'totalCnt' ? 'line' : 'bar',
            data: Object.entries(value).map( ([i,val]) => val).slice(0,Object.keys(value).length - 1)
          }
        })
      this.xData = [this.$t('统计.今天'), this.$t('统计.昨天'), this.$t('统计.上个星期'), this.$t('统计.上个月')]
      this.orderSeries = initList(info.order)
    },
    toggleChart(type) {
      this.showState[type] = !this.showState[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  
  .block{
    width: 100%;
  }
}
</style>
