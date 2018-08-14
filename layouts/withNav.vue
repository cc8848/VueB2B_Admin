<template>
  <div>
    <app-header></app-header>
    <el-row>
        <el-col :span="4" class="app-menu-wrap">
            <app-menu></app-menu>
        </el-col>
        <el-col :span="20" class="wrap">
            <nuxt/>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import AppMenu from '~/components/singleton/AppMenu.vue'
import AppHeader from '~/components/singleton/AppHeader'
import {mapState} from 'vuex'
export default {
  layout: 'withNav',
  middleware: 'auth',
  created() {
    if(!this.token) {
      this.$router.push('/login')
    }
  },
  computed: {
    ...mapState({
        token: state => state.token,
    }),
  },
  components: {
    AppMenu,AppHeader
  }
}
</script>
<style lang="scss">
body{
  margin: 0;
}
.container{
  padding: 2rem 1rem;
  .block{
    background-color: #eee;
    padding: 1rem;
    margin-top: 2rem;
  }
  .alert{
    position: relative;
    margin-bottom: 1rem;
    .edit{
      position: absolute;
      right: 1rem;
      cursor: pointer;
    }
  }
  &>.header{
    display: flex;
    height: 2rem;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: space-between;
    border-left: 4px solid #67c23a;

    .header-name{
      margin-left: 1rem;
    }

    .header-back{
      margin-right: 1rem;
    }
  }
}
.flex-wrap{
  display: flex;
  flex-wrap: wrap;
}
.info-group{
  display: flex;
  align-items: center;
  height: 1.5rem;
  padding: 0.5rem 2rem;
  .key{

  }
  .value{
    margin-left: 1rem;
    word-break: break-all;
  }
}
.input-group{
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  // background-color: #f7ebeb;

  .label{
    min-width: 10rem;
  }
}
.ml{
  margin-left: 1rem;
}
.mr{
  margin-right: 1rem;
}
.mt{
  margin-top: 1rem;
}
.mb{
  margin-bottom: 1rem;
}
.app-menu-wrap{
  height: calc(100vh - 3rem);
  overflow: hidden;
}
.wrap{
  height: calc(100vh - 3rem);
  overflow: auto
}
</style>

<style>
/* 照片样式 */
.avatar-uploader .el-upload {
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>