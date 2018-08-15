<template>
  <div class="header">
    <div class="header-left">
      <img src="~assets/imgs/common/gitcat.png" class="header-logo">
      <div class="header-tip" @click="testAlert">{{$t('通用.欢迎来到VueB2B控制台')}} </div>
      <!-- {{$t('headerCommon.welcome')}} -->
    </div>
    <div class="header-right">
      <el-dropdown class="header-account" @command="handleCommand">
        <span class="el-dropdown-link">
          {{$store.state.userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">{{$t('权限管理.退出登录')}}</el-dropdown-item>
          <el-dropdown-item command="changePassword">{{$t('权限管理.重置密码')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="nav-spacer"></div>
      <el-dropdown @command="checkLang">
        <span class="el-dropdown-link">
          {{$store.state.locale}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="in">{{$t('通用.印尼语')}}</el-dropdown-item>
          <el-dropdown-item command="en">{{$t('通用.英语')}}</el-dropdown-item>
          <el-dropdown-item command="zh">{{$t('通用.中文')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      tipMsg: ''//'welcome to akugrosir console'
    }
  },
  methods: {
    testAlert() {
      this.$message.success(this.$t('通用.欢迎来到akugrosir控制台'))
    },
    logout() {
     console.log() 
    },
    handleCommand(command) {
      if(command === 'logout') {
        this.$store.commit('logout',this.$router)
      } else if(command === 'changePassword') {
        this.$router.push('/admin/updatePassword')
      }
    },
    checkLang(lang) {
      this.$store.commit('SET_LANG',lang)
      this.$i18n.locale = lang
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  padding: 0 2%;
  height: 3rem;
  background-color: #f0eff5;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-left{
    display: flex;
    align-items: center;
  }

  &-right{
    display: flex;
  }

  &-logo{
    width: 40px;
  }

  &-tip{
    margin-left: 2rem;
  }

  .nav-spacer {
    margin-left: 0.8rem;
    margin-right: 0.8rem;
    box-sizing: border-box;
    width: 1px;
    border-left: 1px solid #d0d0d0;
  }
}
</style>
