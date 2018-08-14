<template>
  <section class="container db" v-loading="loading">
    <el-row :gutter="24" type="flex" class="condition-wrap">
      <el-col :span="6" class="condition-item">
        <div class="action-wrap">
          <el-input
            v-model="filterType">
          </el-input>
          <div class="actions">
            <div @click="requestAllTypeList"><i class="el-icon-refresh"></i></div>
            <div @click="showTypeSetting"><i class="el-icon-setting"></i></div>
          </div>
        </div>
        <el-tree
          :data="typeList"
          :props="typeProps"
          :filter-node-method="filterTypeNode"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="onTypeNodeClick"
          ref="typeTree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <span @click.stop="() => settingType(node, data)"><i class="el-icon-setting"></i></span>
              <span @click.stop="() => removeType(node, data)"><i class="el-icon-remove-outline"></i></span>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18" v-show="isTypeSetting" class="typeForm">
        <div class="type-form-item" v-show="selectedType && selectedType.id">
          <div class="label">{{$t('报表.标题')}}</div>
          <el-input class="input" v-model="typeForm.title"></el-input>
          <el-button type="success" size="small" :disabled="!typeForm.title" @click="saveType">{{$t('通用.保存')}}</el-button>
        </div>
        <div class="type-form-item">
          <div class="label">{{$t('报表.子项目')}}</div>
          <el-input class="input" v-model="typeForm.childTitle"></el-input>
          <el-button type="success" size="small" :disabled="!typeForm.childTitle" @click="addChildType">{{$t('通用.新增')}}</el-button>
        </div>
        <div class="type-form-item">
          <el-button type="danger" size="small" @click="cancelSettingType">{{$t('通用.返回')}}</el-button>
        </div>
      </el-col>
      <el-col :span="6" v-show="!isTypeSetting" class="condition-item">
        <div class="action-wrap">
          <el-input
            v-model="filterSql">
          </el-input>
          <div class="actions">
            <div @click="refreshSqlList"><i class="el-icon-refresh"></i></div>
          </div>
        </div>
        <el-tree
          :data="sqlList"
          :props="sqlProps"
          :filter-node-method="filterSqlNode"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="onSqlNodeClick"
          ref="sqlTree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <span @click.stop="() => removeSql(node, data)"><i class="el-icon-remove-outline"></i></span>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="12" v-show="!isTypeSetting" class="condition-item">
        <div class="sql-form-item">
          {{$t('报表[\'由{0}创建\']', [sqlCreatedBy])}}
        </div>
        <div class="sql-form-item">
          <div class="label">{{$t('报表.标题')}}: </div>
          <el-input v-model="form.title"></el-input>
          <el-select class="func" v-model="form.func">
            <el-option
              v-for="item in funcOptions"
              :key="item.value"
              :label="item.value | formatDBQueryFunc"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sql-form-item">
          <el-input type="textarea" v-model="form.sqlStr"></el-input>
        </div>
        <no-ssr>
          <div class="errMsg" v-show="errMsg"><b>{{$t('报表.错误')}}:</b>{{errMsg}}</div>
        </no-ssr>
        <div v-show="selectedType && selectedType.id" class="sql-actions">
          <el-button type="primary" size="small" :disabled="!canAddSql" @click="addSql">{{$t('通用.新增')}}</el-button>
          <el-button v-show="selectedSql && selectedSql.id" type="success" size="small" @click="saveSql">{{$t('通用.保存')}}</el-button>
          <el-button v-show="selectedSql && selectedSql.id" type="danger" size="small" @click="deleteSql">{{$t('通用.删除')}}</el-button>
          <el-button v-show="isShowRevertSqlBtn" type="warning" size="small" @click="revertSql">{{$t('报表.还原')}}</el-button>
        </div>
        <div class="roles-box" v-show="selectedSql && selectedSql.id">
          <el-tag
            :key="role.id"
            v-for="role in form.roles"
            closable
            :disable-transitions="false"
            @close="removeRole(role)">
            {{$t(`报表.${role.roleName}`)}}
          </el-tag>
          <span class="role-form" v-if="roleFormVisible">
            <el-select
              size="small"
              v-show="Array.isArray(countryList)&&countryList.length>1"
              v-model="roleForm.country">
              <el-option
                v-for="country in countryList"
                :key="country.id"
                :label="country.id | formatCountry"
                :value="country.code"
                >
              </el-option>
            </el-select>
            <el-select
              size="small"
              v-model="roleForm.role">
              <el-option
                v-for="role in countryRoleList"
                :key="role.id"
                :label="$t(`报表.${role.roleName}`)"
                :disabled="form.roles.some(v=>v.id===role.id)"
                :value="role.id">
              </el-option>
            </el-select>
            <el-button
              size="small"
              type="success"
              :disabled="!roleForm.role"
              @click="addRole">
              {{$t('通用.确定')}}
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="cancelRoleForm">
              {{$t('通用.取消')}}
            </el-button>
          </span>
          <el-button
            v-else
            class="button-new-role"
            size="small"
            @click="showRoleForm">
            + {{$t('报表.新增角色')}}
          </el-button>
        </div>
        <div class="filters-box">
          <div class="filter" v-show="isFilterShow('beginTime')">
            <span class="label">{{$t('报表.从')}}: </span><el-date-picker v-model="filters.beginTime"></el-date-picker>
          </div>
          <div class="filter" v-show="isFilterShow('endTime')">
            <span class="label">{{$t('报表.至')}}: </span><el-date-picker v-model="filters.endTime"></el-date-picker>
          </div>
          <div class="filter" v-show="isFilterShow('beginTimeUTC')">
            <span class="label">{{$t('报表[\'从(UTC)\']')}}: </span><el-date-picker v-model="filters.beginTimeUTC"></el-date-picker>
          </div>
          <div class="filter" v-show="isFilterShow('endTimeUTC')">
            <span class="label">{{$t('报表[\'至(UTC)\']')}}: </span><el-date-picker v-model="filters.endTimeUTC"></el-date-picker>
          </div>
          <div class="filter" v-show="isFilterShow('userPhone')">
            <span class="label">{{$t('报表.用户电话')}}: </span><el-input class="input" v-model="filters.userPhone"></el-input>
          </div>
          <div class="filter" v-show="isFilterShow('name')">
            <span class="label">{{$t('报表.名称')}}: </span><el-input class="input" v-model="filters.name"></el-input>
          </div>
          <div class="filter" v-show="isListFilterShow('uidList')">
            <span class="label">UIDs: </span><el-input class="input" placeholder="UID1 UID2 ..." v-model="filters.uidList"></el-input>
          </div>
          <div class="filter" v-show="isListFilterShow('oprList')">
            <span class="label">CS&nbsp;&nbsp;IDs: </span><el-input class="input" placeholder="OPR1 OPR2 ..." v-model="filters.oprList"></el-input>
          </div>
          <div class="filter" v-show="isListFilterShow('stringList')">
            <span class="label">stringList: </span><el-input class="input" v-model="filters.stringList"></el-input>
          </div>
          <div class="go">
            <el-button size="small" :disabled="!canRunSql" @click="sqlExe">{{$t('报表.执行')}}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="report-info" v-if="report">
      <span v-if="!report.finishedTime&&report.beginTime">{{$t('报表.开始于')}}: {{report.beginTime | formatDate}}</span>
      <span v-if="!report.finishedTime">
        {{$t('报表.下载中')}}...
        {{$t('报表[\'记录从{0}到{1}\']', [report.offset + 1, report.offset + report.count])}}
      </span>
      <span v-if="report.finishedTime">{{$t('报表.结束于')}}: {{report.finishedTime | formatDate}}</span>
      <span v-if="report.finishedTime">
        <a v-if="report.url" class="report-url" target="_blank" :href="report.url">{{$t('报表.下载')}}</a>
        {{$t('报表[\'记录从{0}到{1}\']', [report.offset + 1, report.offset + report.count])}}
      </span>
      <!-- <span><i class="el-icon-refresh"></i></span> -->
    </el-row>
    <el-row class="pageline" v-show="!isTypeSetting">
      <div class="pagination">
        <el-pagination
          background
          :disabled="!canRunSql"
          :current-page="currentPage"
          :page-size="count"
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
          :prev-text="$t('报表.上一页')"
          :next-text="$t('报表.下一页')"
          layout="jumper, slot, prev, next">
          <el-button :disabled="!canRunSql" class="btn-first" @click="handleFirstClick">
            {{$t('报表.第一页')}}
          </el-button>
        </el-pagination>
        <el-button size="mini" :disabled="!canRunSql" type="info" @click="sqlExe">
          {{$t('报表.执行')}}
        </el-button>
      </div>
      <div class="download-pagination">
        <el-pagination
          background
          :disabled="!canRunSql || downloading"
          :current-page.sync="downloadPage"
          :page-size="count"
          layout="prev, slot, next">
          <span class="download-records">
            {{$t('报表[\'记录从{0}到{1}\']',[(downloadPage-1) * downloadCount + 1, downloadPage * downloadCount])}}
          </span>
        </el-pagination>
        <el-button size="mini" type="success" :disabled="!canRunSql || downloading" @click="download">
          {{$t('报表.下载')}}
        </el-button>
      </div>
    </el-row>
    <el-row class="db-query-results" v-if="!isTypeSetting && form.func===1 && Array.isArray(resultList)">
      <el-row class="emptyText" v-show="resultList.length===0">
        <span>{{$t('el.table.emptyText')}}</span>
      </el-row>
      <el-row class="result-line" v-show="resultList.length>0" :key="i" v-for="(res, i) in resultList">
        <el-row class="result-sub-line" :key="j" v-for="(entry, j) in res" v-if="j%4===0">
          <el-col :span="6" :key="k" v-for="(k) in [j, j+1, j+2, j+3]">
            <el-row v-if="k < res.length">
              <el-col :span="8" class="data-field-title">
                <b>{{res[k].key}}: </b>
              </el-col>
              <el-col :span="16" class="data-field-value">
                <span>{{res[k].value}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </section>
</template>
<script>
import axios from 'axios';
import dayjs from 'dayjs';
export default {
  layout: 'withNav',
  data: function(){
    return {
      loading: false,
      isTypeSetting: false,
      filterType: '',
      typeProps: {
        children: 'children',
        label: 'title'
      },
      typeList: [],
      selectedType: null,
      typeForm: {

      },

      filterSql: '',
      sqlProps: {
        isLeaf: false,
        label: 'title'
      },
      sqlList: [],
      selectedSql: {

      },

      form: {
        func: 1,
      },
      funcOptions: [
        {
          value: 1,
        }
      ],

      errMsg: '',
      countryList: [],
      roleList: [],
      roleForm: {},
      roleFormVisible: false,

      filters: {},
      report: null,
      resultList: [],
      currentPage: 1,
      count: 20,
      downloadPage: 1,
      downloadCount: 100000,
      downloading: false,
    }
  },
  computed: {
    sqlCreatedBy: function(){
      let sql = this.selectedSql;
      if (!sql || !sql.createdBy){
        return '';
      }else{
        return `(${sql.createdBy}) ${sql.createdByFirstName ? sql.createdByFirstName : ''} ${sql.createdByLastName ? sql.createdByLastName : ''}`;
      }
    },
    isShowRevertSqlBtn: function(){
      let sql = this.selectedSql;
      let form = this.form;
      if (!sql || !sql.id){
        return false;
      }else{
        return sql.func !== form.func || sql.sqlStr !== form.sqlStr || sql.title !== form.title;
      }
    },
    countryRoleList: function(){
      let countryCode = this.roleForm.country;
      if(Array.isArray(this.roleList[countryCode])){
        return this.roleList[countryCode];
      }else {
        return [];
      }
    },
    canAddSql(){
      if(this.selectedType){
        return this.selectedType.id && this.form.func && this.form.sqlStr && this.form.title;
      }else{
        return false;
      }
    },
    canRunSql(){
      let form = this.form;
      let filters = this.filters;
      let filterInputKeys = ['beginTime', 'endTime', 'beginTimeUTC', 'endTimeUTC', 'userPhone', 'name'];
      let listFilterInputKeys = ['uidList', 'oprList', 'stringList'];
      for(let key of filterInputKeys){
        if(this.isFilterShow(key) && !filters[key]){
          return false;
        }
      }
      for(let key of listFilterInputKeys){
        if(this.isListFilterShow(key) && !filters[key]){
          return false;
        }
      }
      return !!form.sqlStr;
    }
  },
  watch: {
    filterType(val){
      this.$refs.typeTree.filter(val);
    },
    filterSql(val){
      this.$refs.sqlTree.filter(val);
    },
    'form.roles': function(val){
      this.$set(this.selectedSql, 'roles', val);
    },
    typeList(val, oldVal){
      if(this.selectedType && this.selectedType.id){
        setTimeout(()=>{
          this.$refs.typeTree.setCurrentKey(this.selectedType.id);
        }, 100)
      }
    },
    sqlList(val, oldVal){
      if(this.selectedSql && this.selectedSql.id){
        setTimeout(()=>{
          this.$refs.sqlTree.setCurrentKey(this.selectedSql.id);
        }, 100)
      }
    }
  },
  async created(){
    this.loading = true;
    await this.init();
    this.loading = false;
  },
  methods: {
    async init(){
      await this.requestAllTypeList();
      await this.requestRoleList();
    },
    async requestAllTypeList(){
      try{
        let {data} = await axios.get('/api/json/voljin/admin/db/alltypelist');
        if(data.success){
          this.typeList = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestAddType(params){
      try {
        let {data} = await axios.post('/api/json/voljin/admin/db/addtype', params, {formData: true});
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestSaveType(type, title){
      try{
        let {data} = await axios.post(`/api/json/voljin/admin/db/${type}`, {title}, {formData: true});
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestDeleteType(type){
      try{
        let {data} = await axios.delete(`/api/json/voljin/admin/db/${type}`);
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    filterTypeNode(value, data){
      if(!value){
        return true;
      }else{
        return data.title.indexOf(value) !== -1;
      }
    },
    settingType(node, data){
      this.isTypeSetting = true;
      this.selectedType = data;
      this.typeForm = {
        title: data.title
      }
    },
    cancelSettingType(){
      this.isTypeSetting = false;
      this.typeForm = {};
    },
    async saveType(){
      this.loading = true;
      let data = await this.requestSaveType(this.selectedType.id, this.typeForm.title);
      if(data.success){
        this.selectedType = Object.assign(this.selectedType, this.typeForm);
      }
      this.loading = false;
    },
    async addChildType(){
      let params = {
        prt: (this.selectedType&&this.selectedType.id)?this.selectedType.id:0,
        title: this.typeForm.childTitle
      }
      this.loading = true;
      let data = await this.requestAddType(params);
      if(data.success){
        await this.requestAllTypeList();
      }
      this.loading = false;
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
    removeType(node, data){
      this.confirmDelete(async ()=>{
        this.loading = true;
        let res = await this.requestDeleteType(data.id);
        if(res.success){
          this.$nextTick(function(){
            this.$refs.typeTree.remove(data.id);
          })
        }
        this.loading = false;
      })
    },
    async onTypeNodeClick(data, node, component){
      if(this.selectedType !== data){
        this.selectedType = data;
        this.loading = true;
        await this.requestSqlList(data.id);
        this.resetSelectedSql();
        this.loading = false;
        this.cancelSettingType();
      }else{
        this.cancelSettingType();
      }
    },
    showTypeSetting(){
      this.isTypeSetting = true;
      this.selectedType = null;
      this.typeForm = {};
      this.$refs.typeTree.setCurrentNode({});
    },
    resetSelectedType(){
      this.selectedType = null;
    },

    async requestSqlList(type){
      try{
        let {data} = await axios.get(`/api/json/voljin/admin/db/${type}/sqllist`);
        if(data.success){
          this.sqlList = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestAddSql(params){
      try{
        let {data} = await axios.post(`/api/json/voljin/admin/db/${params.type}/addsql`, params, {formData: true});
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestSaveSql(params){
      try{
        let {data} = await axios.post(`/api/json/voljin/admin/db/${params.type}/${params.id}`, params, {formData: true});
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestDeleteSql(type, id){
      try{
        let {data} = await axios.delete(`/api/json/voljin/admin/db/${type}/${id}`);
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    filterSqlNode(value, data){
      if(!value){
        return true;
      }else{
        return data.title.indexOf(value) !== -1;
      }
    },
    async refreshSqlList(){
      let {selectedType} = this;
      if(selectedType && typeof selectedType.id === 'number'){
        this.loading = true;
        await this.requestSqlList(selectedType.id);
        this.loading = false;
      }
    },
    onSqlNodeClick(data, node, component){
      this.selectedSql = data;
      this.resetForm();
      this.form = this.deepCopy(this.selectedSql);
    },
    removeSql(node, data){
      this.confirmDelete(async ()=>{
        this.loading = true;
        let res = await this.requestDeleteSql(this.selectedType.id, data.id);
        if(res.success){
           this.$nextTick(function(){
            this.$refs.sqlTree.remove(data.id);
            if(this.selectedSql.id === data.id){
              this.resetSelectedSql();
            }
            this.loading = false;
          })
        }else{
          this.loading = false;
        }
      })
    },
    async addSql(){
      let params = {
        type: this.selectedType.id,
        func: this.form.func,
        sqlStr: this.form.sqlStr,
        title: this.form.title,
        seq: 1,
      }
      this.loading = true;
      let data = await this.requestAddSql(params);
      if(data.success){
        await this.refreshSqlList();
        this.resetSelectedSql();
      }
      this.loading = false;
    },
    async saveSql(){
      let params = {
        type: this.selectedType.id,
        id: this.selectedSql.id,
        func: this.form.func,
        sqlStr: this.form.sqlStr,
        title: this.form.title,
      };
      this.loading = true;
      let data = await this.requestSaveSql(params);
      if(data.success){
        this.selectedSql = Object.assign(this.selectedSql, this.form);
      }
      this.loading = false;
    },
    deleteSql(){
      this.removeSql(null, this.selectedSql);
    },
    revertSql(){
      if(this.selectedSql){
        this.form = this.deepCopy(this.selectedSql);
      }
    },
    resetSelectedSql(){
      this.selectedSql = {};
    },
    resetForm(){
      this.form = {
        func: 1,
      },
      this.filters = {

      };
    },

    async requestRoleList(){
      try{
        let {data} = await axios.get('/api/json/voljin/admin/db/roleList');
        if(data.success){
          this.roleList = data.data;
          this.initCountryAndRole(data.data);
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(err){
        return err;
      }
    },
    async requestAddRole(params){
      try{
        let {data} = await axios.post(`/api/json/voljin/admin/db/${params.type}/sql/${params.sqlId}/role/${params.role}`);
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    async requestDeleteRole(params){
      try{
        let {data} = await axios.delete(`/api/json/voljin/admin/db/${params.type}/sql/${params.sqlId}/role/${params.role}`);
        if(data.success){
          this.$message.success(this.$t('通用.操作成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        return data;
      }catch(err){
        return err;
      }
    },
    initCountryAndRole(roleList){
      let countryList = this.countryList || [];
      for(let [countryCode, roleArray] of Object.entries(roleList)){
        if(Array.isArray(roleArray)){
          let role = roleArray.find(v=>v.countryCode===countryCode);
          if(role){
            let country = {
              id: Number(role.country_id),
              name: role.countryName,
              code: countryCode
            }
            countryList.push(country);
          }
        }
      }
      this.$set(this, 'countryList', countryList);
      if(countryList.length===1){
        this.roleForm.country = countryList[0].code;
      }
    },
    removeRole(role){
      let params = {
        type: this.selectedType.id,
        sqlId: this.selectedSql.id,
        role: role.id
      }
      this.confirmDelete(async ()=>{
        this.loading = true;
        let res = await this.requestDeleteRole(params);
        if(res.success){
          this.form.roles = this.form.roles.filter(v=>v.id!==role.id);
        }
        this.loading = false;
      })
    },
    async addRole(){
      let params = {
        type: this.selectedType.id,
        sqlId: this.selectedSql.id,
        role: this.roleForm.role
      }
      let role = this.countryRoleList.find(v=>v.id===params.role);
      this.loading = true;
      let data = await this.requestAddRole(params);
      if(data.success){
        this.form.roles.push({id: role.id, roleName: role.roleName});
        this.cancelRoleForm();
      }
      this.loading = false;
    },
    async showRoleForm(){
      if(Array.isArray(this.countryList) && this.countryList.length === 0){
        this.loading = true;
        await this.requestRoleList();
        this.loading = false;
      }
      this.roleFormVisible = true;
    },
    cancelRoleForm(){
      this.roleFormVisible = false;
      if(Array.isArray(this.countryList) && this.countryList.length===1){
        this.roleForm = {
          country: this.countryList[0].code,
        };
      }else{
        this.roleForm = {};
      }
    },

    isFilterShow(key){
      let sqlStr = this.form && this.form.sqlStr;
      let reg = new RegExp(`@${key}@`)
      if (typeof sqlStr === 'string' && reg.test(sqlStr)){
        return true;
      }else{
        return false;
      }
    },
    isListFilterShow(key){
      let sqlStr = this.form && this.form.sqlStr;
      let reg = new RegExp(`@@${key}@@`)
      if (typeof sqlStr === 'string' && reg.test(sqlStr)){
        return true;
      }else{
        return false;
      }
    },
    async handleCurrentChange(page){
      this.currentPage = page;
    },
    async handlePrevClick(page){
      this.currentPage = page;
      await this.sqlExe();
    },
    async handleNextClick(page){
      this.currentPage = page;
      await this.sqlExe();
    },
    async handleFirstClick(){
      this.currentPage = 1;
      await this.sqlExe();
    },
    patchSqlStr(){
      let filters = this.deepCopy(this.filters);
      let p = {};
      let sql = this.form.sqlStr;
      let timeZone = -Math.round((new Date()).getTimezoneOffset() / 15) * 15;
      if(this.selectedSql.func === 3 && this.map){
        filters.lat1 = this.map.getBounds().getSouthWest().lat();
        filters.lng1 = this.map.getBounds().getSouthWest().lng();
        filters.lat2 = this.map.getBounds().getNorthEast().lat();
        filters.lng2 = this.map.getBounds().getNorthEast().lng();
        filters.lngm1 = lng1 > lng2 ? 180 : (lng1 + lng2) / 2;
        filters.lngm2 = lng1 > lng2 ? -180 : (lng1 + lng2) / 2;
        filters.gap = Number(((lat2 - lat1) / 100).toFixed(3));
        filters.gap = Math.max(0.001, filters.gap);
      }

      filters.beginTime = dayjs(filters.beginTime).startOf('day').valueOf();
      filters.endTime = dayjs(filters.endTime).endOf('day').valueOf();
      filters.timeZone = timeZone;
      filters.beginTimeUTC = dayjs(filters.beginTimeUTC).startOf('day').add(timeZone, 'minutes').valueOf();
      filters.endTimeUTC = dayjs(filters.endTimeUTC).endOf('day').add(timeZone, 'minutes').valueOf();
      filters.userPhone = !filters.userPhone ? '0' : (!/^0/.test(filters.userPhone) ? `0${filters.userPhone}`: filters.userPhone);
      filters.name = !filters.name ? '' : "'" + filters.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"') + "'";
      filters.merchant = filters.merchantId;
      filters.openpayMerchant = filters.merchantId;

      filters.uidList = !filters.uidList ? '0' : filters.uidList.split(/[^0-9]/).filter(v=>v && !isNaN(v));
      filters.oprList = !filters.oprList ? '0' : filters.oprList.split(/[^0-9]/).filter(v=>v && !isNaN(v));
      filters.stringList = !filters.stringList ? 'undefined' : filters.stringList.split(',').map(v=>`'${v}'`);

      sql = sql.replace(/(@{1,2})(\w+)\1/g, function(match, p1, p2){
        let value = filters[p2];
        if(value){
          p[p2] = value;
          return Array.isArray(value)?value.join(','):value;
        }else{
          return match;
        }
      })

      if(p.name){
        p.name = this.filters.name;
      }

      return {sqlStr: sql, p: p};
    },
    filterResult(list){
      let resultList = list.filter(v=>typeof v === 'object' && !!v).map((item)=>{
        let keys = Object.keys(item);
        return keys.map(key=>{
          return {
            key: key,
            value: item[key]
          }
        })
      })
      return resultList;
    },
    async sqlExe(){
      let sql = this.form;
      this.errMsg = '';
      let {sqlStr, p} = this.patchSqlStr();
      let count = 1 < sql.func ? 10000 : this.count;
      let params = {
        sqlStr: sqlStr,
        offset: (this.currentPage - 1) * count,
        count: count
      }
      this.loading = true;
      try{
        let {data} = await axios.post(`/api/json/voljin/admin/db/run/any`, params, {formData: true});
        if(data.success){
          if(sql.func === 1){
            this.resultList = this.filterResult(data.data);
          }
        }else if(data.errCode !== '403'){
          if(data.errMsg){
            let errMsg = data.errMsg;
            if(typeof data.data === 'string'){
              errMsg += data.data;
            }
            this.errMsg = errMsg;
          }
        }
      }catch(err){
        this.errMsg = err.message;
      }
      this.loading = false;
    },
    download(){
      this.$confirm(this.$t('报表.确定下载'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(async ()=>{
        this.loading = true;
        this.downloading = true;
        let sql = this.form;
        let {sqlStr, p} = this.patchSqlStr();
        let params = {
          sqlStr: sqlStr,
          offset: (this.downloadPage - 1) * this.downloadCount,
          count: this.downloadCount
        };
        this.report = {
          beginTime: Date.now(),
          ...params
        }
        let {data} = await axios.post(`/api/json/voljin/admin/db/download/any`, params, {formData: true});
        if(data.success){
          this.report = Object.assign({}, this.report, {
            url: data.data,
            finishedTime: data.sysTime
          })
        }else{
          this.$message.error(data.errMsg);
          this.report = null;
        }
        this.loading = false;
        this.downloading = false;
      }).catch((err)=>{
        this.loading = false;
        this.downloading = false;
        this.report = null;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding-top: 0;
  .condition-wrap{
    min-height: 20rem;
    .condition-item{
      padding-top: 2rem;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 1rem;
      border-right: 1px solid #e5e5e5;
    }
    :last-child.condition-item{
      border-right-width: 0;
    }
  }
  .action-wrap{
    display: flex;
    margin-bottom: 1rem;

    .actions{
      margin-left: 7px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  i{
    color: #409eff;
  }
  i:hover{
    cursor: pointer;
    color: #a0cfff;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;

    .el-icon-setting{
      margin-right: 4px;
    }
  }

  .typeForm{
    padding-top: 2rem;
    border-bottom: 1px solid #e5e5e5;
    .type-form-item{
      display: flex;
      align-items: center;
      margin-left: 2rem;
      margin-bottom: 1rem;
      .label{
        min-width: 2rem;
      }
      .input{
        width: 50%;
        margin: 0 1rem;
      }
    }
  }
  .sql-form-item{
    & + .sql-form-item{
      margin-top: 1rem;
    }
    display: flex;
    align-items: center;
    .label{
      margin-right: 1rem;
      min-width: 2rem;
    }

    .func{
      margin-left: 1rem;
    }
  }

  .errMsg{
    margin: 1rem 0;
    color: #dd6161;
  }

  .sql-actions{
    margin-top: 1rem;
  }
  .roles-box{
    display: flex;
    margin-top: 1rem;
    .el-tag + .el-tag,
    .el-tag + .button-new-role,
    .el-tag + .role-form{
      margin-left: 0.5rem;
    }
    .role-form{
      display: flex;
      .el-select{
        margin-right: 0.5rem;
        width: 6.5rem;
      }
    }
  }
  .filters-box{
    margin-top: 1rem;

    .filter{
      display: flex;
      align-items: center;
      margin:1rem 0;
      .label{
        margin-right: 1rem;
      }
      .input{
        flex: 1,
      }
    }
  }
  .report-info{
    margin-top: 1rem;
    padding: 1rem;
    text-align: center;
	  background-color: #f4f4f5;

    .report-url{
      margin: 0 0.5rem;
    }
  }
  .btn-first{
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
    padding: 0;
    &:hover,&:active,&:focus{
      background-color: #f4f4f5;
      color: #606266;
    }
    &:disabled{
      color: #c0c4cc;
    }
    padding: 0 0.5rem;
  }
  .pageline{
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    .pagination, .download-pagination{
      display: flex;
      margin: 0 1rem;
    }
  }
  .db-query-results{
    .emptyText{
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-line{
      background-color: #f8f8f8;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
    }
    .result-sub-line {
      border-bottom: 1px solid #e7e7e7;
      min-height: 10px;
      padding: 0.5rem;
    }
    .data-field-title,.data-field-value{
      word-wrap:break-word;
    }
  }
}
</style>
<style lang="scss">
.db{
  .pageline{
    .pagination{
      .btn-prev,.btn-next{
        padding: 0 0.5rem;
      }
    }
  }
}
</style>


