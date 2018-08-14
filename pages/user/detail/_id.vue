<template>
  <section class="container">
    <div class="header">
      <div class="header-name">{{$t('用户管理.用户详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <div class="basic block">
      <el-alert class="basic-header alert" :title="$t('通用.基础信息')" type="success" :closable="false"></el-alert>
      <div class="basic-info">
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">ID:</div>
            <div class="value">{{detailInfo.id}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('用户管理.联系电话')}}:</div>
            <div class="value">{{detailInfo.phoneNumber}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('用户管理.账户名称')}}：</div>
            <div class="value">{{detailInfo.userName}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('用户管理.国家')}}：</div>
            <div class="value">{{detailInfo.countryId | formatCountry}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <el-alert class="logistics-header alert" :title="$t('用户管理.账号信息')" type="success" :closable="false"></el-alert>
      <div class="input-group">
        <div class="label">{{$t('用户管理.联系电话')}}：</div>
        <el-input
            style="width:10rem;"
            placeholder="账号"
            disabled
            v-model="accountForm.phone"
            >
        </el-input>
      </div>
      <div class="input-group">
        <div class="label">{{$t('通用.密码')}}：</div>
        <el-input
            style="width:10rem;"
            placeholder="密码"
            v-model="accountForm.password"
            clearable>
        </el-input>
      </div>
      <div class="footer">
        <el-button class="footer-btn" @click="submitForm" type="success">{{$t('通用.保存')}}</el-button>
      </div>
    </div>
    
  </section>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
export default {
  layout: 'withNav',
  data() {
    return {
      detailInfo: {},
      accountForm: {},
    }
  },
  computed: {
    uid() {
      return this.$route.params.id || 1
    },
    showCancelOrder() {
      return [1,2,3].includes(this.detailInfo.status)
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getDetailInfo()
    },
    async getDetailInfo() {
      let {data} = await axios.post(`/api/json/wrynn/admin/user/detail`,{uid: this.uid},{formData:true})
      if(data.success) {
        this.detailInfo = data.data
        this.accountForm.phone = this.detailInfo.phoneNumber
      } else {
        this.$message.error(data.errMsg)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
  
    async submitForm() {
      // ----------------------  校验  ---------------------
      let {phone,password} = this.accountForm
      if(!phone || !password) {
        return this.$message.error(this.$t('通用.请完善信息'))
      } else if(password.length < 8 || password.length > 16) {
        return this.$message.error(this.$t('通用.密码为8到16位'))
      }
      let param = {
        countryId: this.detailInfo.countryId,
        phoneNumber: phone,
        password: md5(password),
      }
      let {data} = await axios.post(`/api/json/wrynn/admin/user/updatePass`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.initPage()
        this.resetForm()
      } else {
        this.$message.error(data.errMsg)
      }
    },
    resetForm() {
      this.accountForm = {}
    },
    getProp(prop) {
      return Object.entries(prop).map(item => {
        return `${item[0]}:${item[1]}`
      }).reduce((cal,i,idx) => idx === 0 ? cal + i : cal + ',' + i,'')
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  .basic,.logistic{
    &-info{
      padding: 2rem 0;
      align-items: center;

      .edit-btn{
        height: 2rem;
      }
    }
  }
  .refund{
    .input-group {
      background-color: #eee;
      .label{
        min-width: 0;
      }
    }
  }
  .footer{
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    &-btn{
      margin-left: 1rem;
    }
  }
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
      height: 10rem;
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
  }
  .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 10rem;
      height: 10rem;
      line-height: 10rem;
      text-align: center;
  }
  .avatar {
      width: 10rem;
      height: 10rem;
      display: block;
  }
</style>