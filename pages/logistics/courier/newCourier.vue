<template>
  <section class="container courier-add">
    <div class="header">
      <div class="header-name">{{$t('物流管理.新增快递员')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <div class="input-group">
        <div class="label">{{$t('物流管理.快递员姓名')}}:</div>
        <el-input
          class="couier-name-input"
          :placeholder="$t('物流管理.请输入内容')"
          v-model="courierName"
          clearable
        >
        </el-input>
        <div class="label ml">{{$t('物流管理.性别')}}:</div>
        <el-select v-model="courierSex" :placeholder="$t('物流管理.请选择性别')">
          <el-option
            :key="0"
            :label="$t('通用.男')"
            :value="0">
          </el-option>
          <el-option
            :key="1"
            :label="$t('通用.女')"
            :value="1">
          </el-option>
      </el-select>
    </div>
    <div class="input-group">
      <div class="label">{{$t('物流管理.住址')}}:</div>
      <el-input
        :placeholder="$t('物流管理.请输入内容')"
        v-model="courierLoca"
        clearable
      >
      </el-input>
      <div class="label ml">{{$t('物流管理.联系电话')}}:</div>
      <el-input
        :placeholder="$t('物流管理.请输入内容')"
        v-model="courierPhone"
        clearable
      >
      </el-input>
    </div>
    <div class="input-group">
      <div class="label">{{$t('物流管理.配送地区')}}:</div>
      <address-area v-model="courierArea" type="city"></address-area>
    </div>
    <div class="input-group">
      <div class="label">{{$t('物流管理.详细地址')}}:</div>
      <el-input
        type="textarea"
        autosize
        :placeholder="$t('物流管理.请输入内容')"
        v-model="courierAddr"
      >
      </el-input>
    </div>
    <div class="input-group">
        <div class="label">{{$t('物流管理.持证件照图片')}}:</div>
         <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload.bind(null, 'courierImg')"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="courierImg.src" :src="courierImg.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
    </div>
    <div class="input-group courier-add-commit">
      <el-button class="mr" type="info" @click="goBack">{{$t('通用.取消')}}</el-button>
      <el-button class="ml" type="success" @click="add">{{$t('物流管理.确认新增')}}</el-button>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import AddressArea from '~/components/pages/logistics/AddressArea'
export default {
  layout: 'withNav',
  components: {
    AddressArea
  },
  data: function() {
    return {
      courierName: '',
      courierSex: '',
      courierPhone: '',
      courierLoca: '',
      courierArea: {

      },
      courierAddr: '',
      courierImg: {
        key: '',
        src: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  methods: {
    async beforeAvatarUpload(type,file) {
      let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=8&cnt=1`)
      if(data.success) {
          let url = data.data[0].url
          , key = data.data[0].key
          , src = data.data[0].src
          let res = await this.amazonUpload(url,file);
          if(res.success) {
              this[type].key = key 
              this[type].src = src
          } else {
              this.$message.error(this.$t('通用.图片上传失败'));
          }
      } else {
          this.$message.error(this.$t('通用.图片上传失败'));
      }
      return Promise.reject()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async add(){
      const { courierName, courierSex, courierPhone, courierLoca, courierAddr, courierImg, courierArea} = this;
      // ----------------------  校验  ---------------------
      if(!courierName){
        return this.$message.error(this.$t('物流管理.请输入快递员姓名'));
      }else if(typeof courierSex !== 'number'){
        return this.$message.error(this.$t('物流管理.请选择性别'));
      }else if(!courierLoca){
        return this.$message.error(this.$t('物流管理.请填写住址'));
      }else if(!courierPhone){
        return this.$message.error(this.$t('物流管理.请填写联系电话'));
      }else if(!courierAddr){
        return this.$message.error(this.$t('物流管理.请填写详细地址'));
      }else if(!courierImg.key){
        return this.$message.error(this.$t('物流管理.请填写持证件照图片'));
      }else if(!courierArea.id){
        return this.$message.error(this.$t('物流管理.请选择配送地区'))
      }
      let param = {
        courierName: courierName,
        courierSex: courierSex, 
        courierPhone: courierPhone, 
        courierLoca: courierLoca, 
        courierAddr:courierAddr, 
        courierImg: courierImg.key, 
        courierArea: courierArea.area, 
        courierAreaId: courierArea.id
      };
      let response = await axios.post('/api/json/zuljin/admin/courier/add',param,{formData: true})
      if(response.data.success) {
        this.$message.success(this.$t('物流管理.添加成功'));
        this.$router.push(`/logistics/courier/courierList`);
      }else{
        this.$message.error(response.data.errMsg);
      }
    },
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>
<style lang="scss">
.courier-add {
  .couier-name-input{
    width: calc(50% - 10.5rem)
  }
  &-commit{
    float: right;
  }
  .label{
    width: 10rem;
    line-height: 1.5;
  }

}
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
</style>
