<template>
  <section class="container">
    <div class="middle-wrap" v-loading="loading">
      <div class="table-header">
        <div class="btn-wrap">
          <el-button @click.native.prevent="addAdmindialogVisible = true" size="small">{{$t('权限管理.新增')}}</el-button>
        </div>
        <el-dialog :title="$t('权限管理.新增')" :visible.sync="addAdmindialogVisible">
          <el-form :model="newAdminForm">
            <el-form-item :label="$t('权限管理.账户名称')" :label-width="formLabelWidth">
              <el-input v-model="newAdminForm.account" auto-complete="off" style="width:15rem"></el-input>
            </el-form-item>
            <el-form-item :label="$t('权限管理.账户昵称')" :label-width="formLabelWidth">
              <el-input v-model="newAdminForm.accountName" auto-complete="off" style="width:15rem"></el-input>
            </el-form-item>
            <el-form-item :label="$t('通用.密码')" :label-width="formLabelWidth">
              <el-input v-model="newAdminForm.password" auto-complete="off" style="width:15rem"></el-input>
            </el-form-item>
            <el-form-item :label="$t('权限管理.性别')" :label-width="formLabelWidth">
              <el-select v-model="newAdminForm.sex" :placeholder="$t('权限管理.性别')">
                <el-option :label="$t('通用.男')" value="0"></el-option>
                <el-option :label="$t('通用.女')" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('权限管理.账号角色')" :label-width="formLabelWidth">
              <el-select v-model="newAdminForm.role" :placeholder="$t('权限管理.账号角色')">
                <el-option :label="$t('权限管理.超级管理员')" value="1"></el-option>
                <el-option :label="$t('权限管理.运营')" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAddAdmin">{{$t('通用.取消')}}</el-button>
            <el-button type="primary" @click="addAdmin">{{$t('通用.确定')}}</el-button>
          </div>
        </el-dialog>
      </div>
      <search-bar :type="'text'" @search="handleSearch"></search-bar>
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
          prop="account"
          :label="$t('权限管理.账户名称')"
          >
        </el-table-column>
        <el-table-column
          prop="sex"
          :label="$t('权限管理.性别')"
          >
          <template slot-scope="props">{{props.row.sex | formatSex}}</template> 
        </el-table-column>
        <el-table-column
          prop="role"
          :label="$t('权限管理.账号角色')"
          >
          <template slot-scope="props">{{props.row.role | formatAdminRole}}</template> 
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('权限管理.账号状态')"
          >
          <template slot-scope="props">{{props.row.status | formatAdminStatus}}</template> 
        </el-table-column>
        <el-table-column
          :label="$t('权限管理.添加时间')"
        >
          <template slot-scope="props">{{props.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('权限管理.操作')"
          width="100">
          <template slot-scope="scope">
            <el-popover
              class="ml"
              placement="top"
              width="160"
              trigger="click">
              <el-input size="small" :placeholder="$t('权限管理.重置密码')" v-model="scope.row.newPassword"></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button type="primary" size="mini" @click="resetPassword(scope.row)">{{$t('通用.确定')}}</el-button>
              </div>
              <el-button :ref="`popover-${scope.row.oidNo}`" slot="reference" type="text" size="small">{{$t('权限管理.重置密码')}}</el-button>
            </el-popover>
            <el-button class="ml" @click="deleteAdmin(scope.row)" type="text" size="small">{{$t('权限管理.删除')}}</el-button>
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
import md5 from 'md5'
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
      addAdmindialogVisible: false,
      formLabelWidth: '10rem',
      newAdminForm: {
        sex: '0',
        role: '2'
      }
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
      token: state => state.token,
      uid: state => state.userInfo.uid
    })
  },
  methods: {
    async initPage() {
      this.getTableData()
    },
    async getTableData({condition = ''} = {}) {
      try {
        this.loading = true
        let param = {
          condition,
          count: this.pageSize,
          offset: this.currentPage
        }
        let { data } = await axios.get(`/api/json/windrunner/admin/queryAdminList`, {params:param})
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
    async resetPassword(row) {
      let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
      if(!row.newPassword) {
        return this.$message.error(this.$t('权限管理.请填写新密码'))
      } else if(!pwdReg.test(row.newPassword)) {
        return this.$message.error(this.$t('权限管理.密码为8到16位数字和字母'))
      }
      let param = {
        adminId: this.uid,
        account: row.account,
        password: md5(row.newPassword)
      }
      let {data} = await axios.post(`/api/json/windrunner/admin/updatePasswordElse`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.getTableData()
      } else {
        this.$message.error(data.errMsg);
      }
    },
    async deleteAdmin(row) {
      this.$confirm(this.$t(`此操作不可恢复,确认删除吗`), '', {
          confirmButtonText: this.$t('通用.确定'),
          cancelButtonText: this.$t('通用.取消'),
          type: 'warning',
          center: true
      }).then(async() => {
          let param = {
            uid: row.id
          }
          let {data} = await axios.post(`/api/json/windrunner/admin/delAdmin`,param,{formData:true})
          if(data.success) {
            this.$message.success(this.$t('通用.操作成功'))
            this.getTableData()
          } else {
            this.$message.error(data.errMsg);
          } 
      }).catch((e) => {
          console.log(e)
          return
      });
    },
    async addAdmin() {
      let {account, accountName, password, role, sex} = this.newAdminForm
      , pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
      if(!account || !password) {
        return this.$message.error(this.$t('权限管理.请填写账号密码'))
      } else if(!pwdReg.test(password)) {
        return this.$message.error(this.$t('权限管理.密码为8到16位数字和字母'))
      }
      let param = {
        account,
        password: md5(password),
        sex,
        role
      }
      accountName ? param.accountName = accountName : null
      let {data} = await axios.post(`/api/json/windrunner/admin/addAdmin`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.addAdmindialogVisible = false
        this.newAdminForm = {
          sex: '0',
          role: '2'
        }
        this.getTableData()
      } else {
        this.$message.error(data.errMsg);
      }
    },
    cancelAddAdmin() {
      this.addAdmindialogVisible = false
      this.newAdminForm = {
        sex: '0',
        role: '2'
      }
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
