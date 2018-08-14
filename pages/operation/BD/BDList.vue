<template>
  <section class="container" v-loading="loading">
    <!-- <el-dialog
      :visible="dialogVisible"
      :title="$t('推荐码.新增推荐码')"
      @close="closeDialog">
      <el-form
        ref="form"
        label-width="100px"
        :model="recommendation"
        :rules="rules">
        <el-form-item prop="code" :label="$t('推荐码.推荐码')">
          <span>{{recommendation.code}}</span>
        </el-form-item>
        <el-form-item prop="BDName" :label="$t('推荐码.BD_name')">
          <el-input v-model="recommendation.BDName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t('通用.取消')}}</el-button>
        <el-button type="primary" @click="addRecommendation">{{$t('通用.确定')}}</el-button>
      </div>
    </el-dialog> -->
    <div class="header-wrap">

        <div class="month-wrap">
          <span class="label">{{$t('推荐码.周期')}}</span>
          <el-date-picker
            v-model="month"
            type="month"
            value-format="yyyy-MM"
            :clearable="false"
            :editable="false"
            @change="changeMonth">
          </el-date-picker>
        </div>
        <search-bar @search="handleSearch"></search-bar>
      <!-- <div class="month-wrap">
        <span class="label">{{$t('推荐码.周期')}}</span>
        <el-date-picker
          v-model="month"
          type="month"
          value-format="yyyy-MM"
          :clearable="false"
          :editable="false"
          @change="changeMonth">
        </el-date-picker>
      </div> -->
      <!-- <el-row class="action-wrap">
        <el-col :span="18">
          <el-button @click="showDialog">{{$t('推荐码.新增推荐码')}}</el-button>
        </el-col>
        <search-bar @search="handleSearch"></search-bar>
      </el-row> -->
    </div>
    <data-table :tableData="tableData" :tableHeader="tableHeader" class="table"></data-table>
    <div class="pagination">
      <el-pagination
        background
        :total="totalCount"
        :current-page.sync="currentPage"
        :page-size.sync="count"
        @current-change="handleCurrentChange"
        layout="prev, slot, next"
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
import SearchBar from '~/components/global/SearchBar';
import Vue from 'vue';
import axios from 'axios';
const tableHeader = [
  {prop: 'code', label: '推荐码.推荐码'},
  {prop: 'BDName', label: '推荐码.BD'},
  {prop: 'userCount', label: '推荐码.注册用户数'},
  {prop: 'totalAmount', label: '推荐码.注册用户交易总额'},
  {prop: 'brokerage', label: '推荐码.本月佣金'}
];
export default {
  components: {
    DataTable,
    SearchBar
  },
  layout: 'withNav',
  data: function(){
    return {
      loading: false,
      dialogVisible: false,
      totalCount: 0,
      currentPage: 1,
      count: 20,
      recommendation: {
        code: '',
        BDName: ''
      },
      rules: {
        BDName: [
          {required: true, message: this.$t('推荐码.请输入BD_name'), trigger: 'blur'}
        ]
      },
      month: Vue.options.filters.formatDate(Date.now(), 'yyyy-MM'),
      BDList: []
    }
  },
  computed: {
    tableData: function(){
      return this.BDList;
    },
    tableHeader: function(){
      return tableHeader;
    }
  },
  async created(){
    await this.requestBDList();
  },
  methods: {
    async requestBDList(){
      this.loading = true;
      let params = {
        month: this.month,
        offset: this.currentPage,
        count: this.count,
      }
      if(this.BDName){
        params.BDName = this.BDName;
      }
      let {data} = await axios.post('/api/json/putress/admin/BDList', params, {formData: true});
      if(data.success){
        this.BDList = data.data.list;
        this.totalCount = data.data.totalCount;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    async handleSearch(keyword){
      this.BDName = keyword;
      this.reset();
      await this.requestBDList();
    },
    async changeMonth(month){
      this.reset();
      await this.requestBDList();
    },
    reset(){
      this.BDList = [];
      this.currentPage = 1;
    },
    handleCurrentChange(){
      this.requestBDList();
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
  .header-wrap{
    display: flex;
    justify-content: space-between;
    .month-wrap{
      margin-bottom: 0.5rem;
      .label{
        margin-right: 1rem;
      }
    }

    .action-wrap{
      display: flex;
      align-items: center;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>


