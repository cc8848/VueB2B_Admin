<template>
  <section class="container">
    <el-form :model="newPassForm">
      <el-form-item :label="$t('通用.密码')" :label-width="formLabelWidth">
        <el-input type="password" v-model="newPassForm.password" auto-complete="off" style="width:15rem"></el-input>
      </el-form-item>
      <el-form-item :label="$t('权限管理.再次输入密码')" :label-width="formLabelWidth">
        <el-input type="password" v-model="newPassForm.repassword" auto-complete="off" style="width:15rem"></el-input>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import md5 from 'md5'
export default {
  layout: 'withNav',
  data: function() {
    return {
      formLabelWidth: '10rem',
      newPassForm: {}
    }
  },
  async created() {
  },
  computed: {
    ...mapState({
      token: state => state.token,
      uid: state => state.userInfo.uid,
      userName: state => state.userInfo.userName
    })
  },
  methods: {
    async updatePassword() {
      let {repassword, password} = this.newPassForm
      if(!repassword || !password) {
        return this.$message.error(this.$t('权限管理.请填写密码'))
      } else if(repassword !== password) {
        return this.$message.error(this.$t('权限管理.两次密码输入不一致'))
      }
      let param = {
        account: this.userName,
        password: md5(password)
      }
      let {data} = await axios.post(`/api/json/windrunner/admin/updatePassword`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
      } else {
        this.$message.error(data.errMsg);
      }
    },
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
