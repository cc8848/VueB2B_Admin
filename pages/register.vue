<template>
  <section class="submit-container custom-form-style">
      <el-form :rules="rules" :model="submitForm" class="submit-form" label-width="120px" size="small">
        <el-form-item label="手机号码：">
          <el-row>
            <el-col :span="16">
              <el-input v-model="submitForm.phone" placeholder="请输入手机号码"></el-input>
            </el-col>
            <el-col :span="6" :offset="1">
              <a class="submit-getcode" @click="getCaptcha">发送验证码</a>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="输入验证码：">
          <el-row>
            <el-col :span="16">
              <el-input v-model="submitForm.captcha" placeholder="请输入您收到的验证码"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-row>
            <el-col :span="16">
              <el-input v-model="submitForm.password" placeholder="请输入您的密码"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-row>
            <el-col :span="16">
              <el-input v-model="submitForm.repeatPsw" placeholder="请再次输入您的密码"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item size="medium">
          <el-col :offset="0" :span="10">
            <a @click="onSubmit" class="submit-loginBtn">注册完成，立即登录</a>
          </el-col>
        </el-form-item>
      </el-form>
  </section>
</template>

<script>
import md5 from 'md5'
export default {
  layout: "login",  
  data(){
    return {
      submitForm: {
        phone: '',
        captcha: '',
        password: '',
        repeatPsw: ''
      },

      rules: {
        phone: [
          {required: true, message: '请输入正确的手机号码'}
        ]
      }
    }
  },
  methods: {
    async getCaptcha() {
      let param = {
        countryId: 1,
        phoneNumber: this.submitForm.phone,
        captchaType: '0',
      }
      let data = await this.$store.dispatch('getCaptcha',param)
      if(data.success) {
        this.$message.success('发送成功')
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async onSubmit(){
      let param = {
        countryId: 1,
        phoneNumber: this.submitForm.phone,
        password: md5(this.submitForm.password),
        captcha: this.submitForm.captcha,
        type: '1',
        source: '1'

      }
      let data = await this.$store.dispatch('userReg',param)
      if(data.success) {
        this.$router.push('/')
      } else {
        this.$message.error(data.errMsg)
      }
    }
  }
}
</script>

<style>
.submit-container {
  display: flex;
  justify-content: center;
  width: 1200px;
  margin: 0 auto;
  user-select: none;
}

.submit-form {
  margin-top: 100px;
  width: 600px;
  padding: 20px 20px 0;
  border-radius: 10px;
}

.submit-getcode {
  box-sizing: border-box;
  display: block;
  height: 50px;
  line-height: 48px;
  cursor: pointer;
  text-align: center;
  border: 1px solid rgb(255, 153, 52);
  background-color: rgb(255, 240, 233);
  color: rgb(255, 153, 52);
  border-radius: 3px;
}

.submit-getcode:hover {
  color: rgb(255, 153, 52);
}

.submit-form .submit-loginBtn {
  cursor: pointer;
  display: block;
  width: 190px;
  height: 44px;
  line-height: 42px;
  background-color: rgb(246, 105, 33);
  border: 1px solid rgb(246, 105, 33);
  text-align: center;
  color: #fff;
}
</style>
<style lang="scss">
.custom-form-style.custom-form-style {
    user-select: none;

    .is-required {
        .el-form-item__label {
            &:before {
                content: '';
            }
        }
    }

    .is-error.is-error {
        margin-bottom: 70px;
        transition: margin-bottom 0.3s;

        .el-form-item__error {
            top: 65px;
            height: 30px;
            line-height: 30px;
            padding: 0 20px 0 40px;
            background-color: rgb(255, 243, 243);
            font-size: 15px;
            // background: red;
        }
    }

    .el-input, 
    .el-input__inner, 
    .el-form-item__label {
      box-sizing: border-box;
      height: 50px;
      line-height: 48px;
      border-radius: 1px;
    }
    
    .el-input__inner:focus  {
        border-color: rgb(255, 153, 52);
    }

    .el-checkbox__label.el-checkbox__label, .el-button--text {
        color: #333;
    }
    
    .el-checkbox__label.el-checkbox__label:hover, .el-button--text:hover {
        color: rgb(255, 153, 52);
    }
    
    .el-checkbox .el-checkbox__inner {
        height: 20px;
        width: 20px;
    }
    
    .el-checkbox .el-checkbox__inner::after {
        top: 2px;
        left: 6px;
        width: 5px;
        height: 10px;
    }
    
    .el-checkbox .el-checkbox__inner:hover, .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: rgb(255, 153, 52);
    }
    
    .el-checkbox.is-checked .el-checkbox__inner {
        background-color: rgb(255, 153, 52);
        border-color: rgb(255, 153, 52);
    }
}

</style>
