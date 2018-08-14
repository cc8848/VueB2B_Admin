<template>
  <section class="container" v-loading="loading">
    <el-dialog
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
    </el-dialog>
    <div class="header-wrap">
      <!-- <div class="month-wrap">
        <span class="label">{{$t('推荐码.周期')}}</span>
        <el-date-picker
          v-model="month"
          type="month"
          value-format="yyyy-MM"
          :clearable="false"
          :editable="false">
        </el-date-picker>
      </div> -->
      <el-row class="action-wrap">
        <el-col :span="18">
          <el-button @click="showDialog">{{$t('推荐码.新增推荐码')}}</el-button>
        </el-col>
        <search-bar @search="handleSearch"></search-bar>
      </el-row>
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
  {prop: 'recommendCode', label: '推荐码.推荐码'},
  {prop: 'BDName', label: '推荐码.BD'},
  {prop: 'createTimeStr', label: '推荐码.新增时间', /*vueFilter: 'formatDate'*/},
  {prop: 'status', label: '通用.状态', vueFilter: 'formatBDCodeStatus'},
  {prop: '', label: '通用.操作', isOperate: true}
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
      BDCodeList: []
    }
  },
  computed: {
    tableData: function(){
      return this.BDCodeList.map(value=>{
        let createTimeStr = '';
        let operate = [];
        if(value.status === 0){
          operate = [
            {
              text: '通用.编辑',
              onClick: (data) => {
                this.editBD(data);
              }
            },
            {
              text: '通用.删除',
              onClick: (data) => {
                this.confirmDelete(
                  this.requestDeleteCode.bind(this, data.recommendCode)
                );
              }
            }
          ];
        }
        if(value.createTime){
          createTimeStr =  Vue.options.filters.formatDate(value.createTime);
        }
        return {
          ...value,
          createTimeStr: createTimeStr,
          operate: operate
        }
      });
    },
    tableHeader: function(){
      return [
        ...tableHeader,
      ];
    }
  },
  async created(){
    // await this.requestAddCode();
    await this.requestBDCodeList();
  },
  methods: {
    async requestAddCode(){
      this.loading = true;
      let {data} = await axios.get('/api/json/putress/admin/addCode');
      if(data.success){
        this.recommendation.code = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    async requestRefCode(){
      let params = {
        code: this.recommendation.code,
        BDName: this.recommendation.BDName
      }
      let {data} = await axios.post(`/api/json/putress/admin/refCode`, params, {formData: true});
      if(data.success){
        this.$message.success(this.$t('通用.添加成功'));
      }else{
        this.$message.error(data.errMsg);
      }
      return data;
    },
    async requestBDCodeList(){
      this.loading = true;
      let params = {
        offset: this.currentPage,
        count: this.count,
      }
      if(this.BDName){
        params.BDName = this.BDName;
      }
      let {data} = await axios.post('/api/json/putress/admin/BDCodeList', params, {formData: true});
      if(data.success){
        this.BDCodeList = data.data.list;
        this.totalCount = data.data.totalCount;
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    async requestDeleteCode(code){
      let {data} = await axios.post('/api/json/putress/admin/deleteBD', {code}, {formData: true});
      if(data.success){
        this.$message.success(this.$t('通用.删除成功'));
        await this.requestBDCodeList();
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestEditBDName(code, name){
      let {data} = await axios.post('/api/json/putress/admin/editBDName', {code,name}, {formData: true});
      if(data.success){
        this.$message.success(this.$t('通用.修改成功'));
        await this.requestBDCodeList();
      }else{
        this.$message.error(data.errMsg);
      }
      return data;
    },
    async handleSearch(keyword){
      this.BDName = keyword;
      this.reset();
      await this.requestBDCodeList();
    },
    reset(){
      this.BDCodeList = [];
      this.currentPage = 1;
    },
    handleCurrentChange(){
      this.requestBDCodeList();
    },
    addRecommendation(){
      this.$refs.form.validate(async (valid)=>{
        if(valid){
          let data = {};
          if(this.isEditing){
            let {code, BDName} = this.recommendation;
            data = await this.requestEditBDName(code, BDName)
          }else{
            data = await this.requestRefCode();
          }
          if(data.success){
            this.closeDialog();
            this.reset();
            await this.requestBDCodeList();
          }
        }
      });
    },
    editBD(data){
      this.isEditing = true;
      this.recommendation.code = data.recommendCode;
      this.recommendation.BDName = data.BDName;
      this.showDialog();
    },
    resetRecommendation(){
      this.recommendation.code ='';
      this.recommendation.BDName = '';
    },
    async showDialog(){
      if(!this.recommendation.code){
        await this.requestAddCode();
      }
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
      this.$refs.form.clearValidate();
      this.recommendation.BDName = '';
      if(this.isEditing){
        this.resetRecommendation();
      }
      this.isEditing = false;
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
  .header-wrap{
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


