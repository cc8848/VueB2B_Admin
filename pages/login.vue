<template>
    <section class="login-container">
        <el-form 
            class="login-form-container" 
            label-width="80px" 
            size="small" 
        >
            <div class="login-header">b2b console login</div>
            <div class="login-self-input">
                <label for="username">{{$t('通用.账号名称')}}：</label>
                <el-input 
                    name="username"
                    :placeholder="$t('通用.请输入')" 
                    v-model="loginForm.username"
                ></el-input>
            </div>
            <div class="login-self-input">
                <label for="password">{{$t('通用.密码')}}：</label>
                <el-input 
                    name="password"
                    :placeholder="$t('通用.请输入')" 
                    v-model="loginForm.password"
                    type="password"    
                ></el-input>
            </div>
            <!-- <el-row class="login-form-pswBtn">
                <el-col :span="6">
                    <el-checkbox v-model="loginForm.remember">记住用户</el-checkbox>
                </el-col>
                <el-col :span="6" :offset="12">
                    <router-link 
                        class="login-form-forgetPsw"
                        to="/resetPsw"
                    >忘记密码</router-link>
                </el-col>
            </el-row> -->
            <div class="login-form-optBtns">
                <span class="login-form-loginBtn" @click="login">{{$t('通用.登录')}}</span>
            </div>
        </el-form>
    </section>
</template>

<script>
import md5 from 'md5'
export default {
    layout: "default"
    , asyncData(context) {
        console.log('');
    }
    , data() {
        return {
        loginForm: {
            remember: false
        },
        rules: {}
        };
    }
    , methods: {
        async login() {
            let {username,password} = this.loginForm
            if(!username || !password) {
                return this.$message.error(this.$t('权限管理.用户名和密码不能为空'))
            }
            let param = {
                // countryId: 1,
                account: this.loginForm.username,
                // password: this.loginForm.password,
                password: md5(this.loginForm.password),
                // type: '1',
                // source: '1'
            }
            let loginRes = await this.$store.dispatch('login',param)   
            , {data,success,errMsg} = loginRes
            if(success) {
                this.$router.push('/')
            } else {
                this.$message.error(errMsg)
            }
        },
        toReg() {
            this.$router.push('/register')
        }
    }
};
</script>

<style lang="scss">
.login-container {
    user-select: none;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
}

.login-form-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 430px;
    height: 470px;
    margin-top: 100px;
    padding: 30px 36px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px #d9d9d9;
}

.login-self-input {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 72px;
    margin-top: 14px;
}

.login-self-input label {
    user-select: none;
}

.login-self-input .el-input, .login-self-input .el-input__inner {
    position: relative;
    height: 48px;
    border-radius: 1px;
}

.login-self-input .el-input .el-input__inner {
    font-size: 16px;
    padding-left: 50px;
}

.login-self-input .el-input .el-input__inner:focus {
    border-color: rgb(255, 153, 52);
}

.login-form-logo {
  border-radius: 15px;
  overflow: hidden;
}

.login-form-container {
    .el-form-item, 
    .el-row, 
    .login-self-input {
        align-self: stretch;
    }
}

.login-form-pswBtn {
    margin-top: 22px;
}

.login-form-pswBtn .el-checkbox__label.el-checkbox__label, .login-form-pswBtn .el-button--text {
    color: #333;
}

.login-form-pswBtn .el-checkbox__label.el-checkbox__label:hover, .login-form-pswBtn .el-button--text:hover {
    color: rgb(255, 153, 52);
}

.login-form-pswBtn .el-checkbox .el-checkbox__inner:hover, .login-form-pswBtn .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: rgb(255, 153, 52);
}

.login-form-pswBtn .el-checkbox.is-checked .el-checkbox__inner {
    background-color: rgb(255, 153, 52);
    border-color: rgb(255, 153, 52);
}

.login-form-checkbox {
  text-align: left;
}

.login-form-forgetPsw.login-form-forgetPsw {
  float: right;
  padding: 2px 0 0;
  border: none;
  color: #333;

  &:hover {
    color: rgb(255, 153, 52);
  }
}

.login-form-optBtns {
    display: flex;
    align-self: stretch;
    justify-content: space-between;
    margin-top: 60px;
}

.login-form-loginBtn, .login-form-submitBtn {
    box-sizing: border-box;
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border: 1px solid rgb(255, 153, 52);
    border-radius: 3px;
}

.login-form-loginBtn:hover, .login-form-submitBtn:hover {
    cursor: pointer;
}

.login-form-loginBtn {
    color: #fff;
    background-color: rgb(255, 153, 52);
}

.login-form-submitBtn a {
    display: block;
    width: 100%;
    height: 100%;
    color: rgb(255, 153, 52);
}

</style>

