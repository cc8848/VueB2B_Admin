<template>
  <div class="push container">
    <div class="header">
      <div class="header-name">{{$t('通用.新增')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <div class="add-wrap">
      <div class="input-group">
        <div class="label">{{$t('运营管理.推送类型')}}:</div>
        <el-select class="ml" v-model="pushForm.type" filterable clearable :placeholder="$t('通用.请选择')">
            <el-option :label="$t('运营管理.文本')" :value="1"></el-option>
            <el-option :label="$t('运营管理.图片')" :value="2"></el-option>
            <el-option :label="$t('运营管理.链接')" :value="3"></el-option>
        </el-select>
      </div>
      <div class="input-group">
          <div class="label">{{$t('运营管理.标题')}}:</div>
          <el-input
            style="width:20rem;"
            :maxlength="50"
            :placeholder="$t('通用.请输入')"
            v-model="pushForm.title"
            clearable>
          </el-input>
      </div>
      <div class="input-group">
          <div class="label">{{$t('运营管理.内容')}}:</div>
          <el-input
            type="textarea"
            :maxlength="200"
            style="width:30rem;"
            :placeholder="$t('通用.请输入')"
            v-model="pushForm.msg"
            clearable>
          </el-input>
      </div>
      <!-- 链接推送 -->
      <div class="input-group" v-if="pushForm.type === 3">
          <div class="label">{{$t('运营管理.跳转链接')}}:</div>
          <el-input
            style="width:20rem;"
            :maxlength="50"
            :placeholder="$t('通用.请输入')"
            v-model="pushForm.h5url"
            clearable>
          </el-input>
      </div>
      <!-- 图片推送 -->
      <div class="add-img" v-if="pushForm.type === 2">
        <div class="input-group">
          <div class="label">{{$t('运营管理.封面图')}}:</div>
          <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(null,'coverImg')"
            :on-preview="handlePictureCardPreview">
            <img v-if="coverImg.src" :src="coverImg.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <div class="input-group">
          <div class="label">{{$t('运营管理.详情图')}}:</div>
          <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(null,'detailImg')"
            :on-preview="handlePictureCardPreview">
            <img v-if="detailImg.src" :src="detailImg.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div class="input-group">
          <div class="label">{{$t('运营管理.推送方式')}}:</div>
          <el-radio-group v-model="pushForm.pushType">>
            <el-radio :label="1">{{$t('运营管理.横幅')}}</el-radio>
            <el-radio :label="2" v-if="pushForm.type === 1">{{$t('运营管理.短信')}}</el-radio>
          </el-radio-group>
      </div>
      <div class="input-group">
          <div class="label">{{$t('运营管理.推送对象')}}:</div>
          <el-radio-group v-model="isPushAll">
            <el-radio :label="1">{{$t('运营管理.全部用户')}}</el-radio>
            <el-radio :label="2">{{$t('运营管理.指定用户')}}</el-radio>
          </el-radio-group>
          <el-button v-if="isPushAll === 2" class="ml" type="default" size="small" @click="downloadUidTamp">{{$t('运营管理.下载模板')}}</el-button>
          <el-upload
            v-if="isPushAll === 2"
            class="btn ml"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleChange"
            :show-file-list="true"
            action="/api/json"
            :limit="1"
            :multiple="false"
            >
            <el-button slot="trigger" size="small" type="primary">{{$t('运营管理.上传UID')}}</el-button>
          </el-upload>
      </div>
      <div class="input-group">
          <div class="label">{{$t('运营管理.发送时间')}}:</div>
          <el-radio-group v-model="isImmediate">
            <el-radio :label="1">{{$t('运营管理.立即发送')}}</el-radio>
            <el-radio :label="2">{{$t('运营管理.定时发送')}}</el-radio>
          </el-radio-group>
          <el-date-picker
            v-if="isImmediate === 2"
            class="ml"
            v-model="pushTime"
            type="datetime"
            :placeholder="$t('通用.请选择')"
            @change="changeTime"
            format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
      </div>
      <div class="input-group add-commit">
        <!-- <el-button class="mr" type="info" @click="resetPage">重置</el-button> -->
        <el-button class="ml" type="success" @click="savePage">{{$t('通用.保存')}}</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
export default {
  layout: 'withNav',
  data() {
    return {
      pushForm: {
        type: 1,
        title: '',
        msg: '',
        h5url: '',
        pushType: 1,
        pushTime: ''
      },
      coverImg: {
        src: '',
        key: ''
      },
      detailImg: {
        src: '',
        key: ''
      },
      fileList: [],
      uidExcel: null,
      isPushAll: 1,//是否推送全部用户
      isImmediate: 1,//是否立即推送
      pushTime: '',//推送时间
      dialogVisible: false,
      dialogImageUrl: '',
      coverImglimit: {//封面图限制宽高
        width: 580,
        height: 280
      },
    }
  },
  methods: {
    changeTime(time) {
      // ----------------------  时间精确到分钟  ---------------------
      this.pushForm.pushTime = this.preciseTime({time,type:'m'}) 
    },
    async savePage() {
      // ----------------------  校验  ---------------------
      let {type, pushType, title, pushTime, msg, h5url} = this.pushForm
      if(!title) {
        return this.$message.error('请填写推送标题')
      } else if(!msg) {
        return this.$message.error('请填写推送内容')
      } else if(this.isImmediate !== 1 && !pushTime) {
        return this.$message.error('请选择推送时间')
      } else if(type === 2 && (!this.coverImg.key || !this.detailImg.key)) {
        return this.$message.error('请完善推送图片')
      } else if(type === 3 && !h5url) {
        return this.$message.error('请填写推送链接')
      }
      let noticeJson = {
        type,
        pushType,
        title,
        msg,
        pushTime: this.isImmediate === 1 ? -1 : pushTime
      }
      // ----------------------  图片、链接 额外参数  ---------------------
      this.pushForm.type === 3 ? noticeJson.h5url = this.pushForm.h5url : null
      this.pushForm.type === 2 ? (_ => {
        noticeJson.coverImgUrl = this.coverImg.key
        noticeJson.detailImgUrl = this.detailImg.key
      })() : null
      // ----------------------  上传参数构造  ---------------------
      let fData = new FormData();
      fData.append("noticeJson", JSON.stringify(noticeJson))
      this.isPushAll === 2 && this.fileList[0]  ? fData.append("excel", this.fileList[0].raw) : null

      let {data} = await axios.post(`/api/json/brann/admin/push`,fData)
      if(data.success) {
        this.$message.success(this.$t('通用.保存成功'))
        this.$router.push('/operation/push/pushList')
      } else {
        this.$message.error(data.errMsg)
      }
    },
    downloadUidTamp() {
      location.href = 'https://drxf4sxe82fjt.cloudfront.net/akugrosir/public/product/uidTemplate.xlsx'
    },
    async beforeAvatarUpload(type,file) {
      if(type === 'coverImg') {
        let [width, height] = await this.getImgWidthHeight(file)
        // ----------------------  推送的封面图宽高限制  ---------------------
        if(width !== this.coverImglimit.width || height !== this.coverImglimit.height) {
          return this.$message.error(`封面图尺寸为${this.coverImglimit.width} * ${this.coverImglimit.height}`)
        }
      }
      let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=7&cnt=1`,{headers:{loginType:1}})
      if(data.success) {
          let url = data.data[0].url
          , key = data.data[0].key
          , src = data.data[0].src
          let res = await this.amazonUpload(url,file)
          if(res.success) {
              this[type].src = src 
              this[type].key = key
          } else {
              this.$message.error(this.$t('通用.图片上传失败'))
          }
      } else {
          this.$message.error(this.$t('通用.图片上传失败'))
      }
      return Promise.reject()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // async beforeUidFileUpload(file) {
    //   // ----------------------  校验，必须为xlsx文件，大小不超过3M  ---------------------
    //   if(file.size > 3 * 1024 * 1024 || file.name.split('.').slice(-1)[0] !== 'xlsx') {
    //     this.$message.error('文件为xlsx格式且不得大于3M')
    //     return Promise.reject()
    //   } else if(this.fileList.length) {
    //     return Promise.reject()
    //   }
    //   debugger
    //   this.fileList.push(file)
    //   return Promise.reject()
    // },
    handleChange(file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group{
  background-color: #eee;
}
.add-commit{
  justify-content: center;
}
.btn{
  display: flex;
  & /deep/ .el-upload-list__item:first-child{
    margin-top: 5px;
  }
}
</style>