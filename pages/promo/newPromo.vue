<template>
    <section class="container add">
      <div class="header">
        <div class="header-name">{{$t('活动管理.新增活动')}}</div>
        <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
      </div>
      <!-- <div class="input-group">
          <div class="label">{{$t('活动管理.活动对象')}}：</div>
          <el-select class="" v-model="country" @change="changeCountry" filterable clearable :placeholder="$t('活动管理.请选择国家')">
              <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.countryName"
              :value="item.id">
              </el-option>
          </el-select>
      </div> -->
      <div class="input-group">
          <div class="label">{{$t('活动管理.活动类型')}}：</div>
          <el-select class="" v-model="promoForm.type" filterable clearable :placeholder="$t('活动管理.请选择活动类型')">
              <el-option
              v-for="item in typeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type">
              </el-option>
          </el-select>
      </div>
      <div class="input-group">
          <div class="label">{{$t('活动管理.活动名称')}}：</div>
          <el-input
              style="width:25rem;"
              :placeholder="$t('活动管理.请填写活动名称')"
              v-model="promoForm.title"
              clearable>
          </el-input>
      </div>
      <div class="input-group">
        <div class="label">{{$t('活动管理.活动时间')}}</div>
        <el-date-picker
          v-model="promoTime"
          value-format="timestamp"
          type="datetimerange"
          range-separator="-"
          :start-placeholder="$t('活动管理.开始日期')"
          :end-placeholder="$t('活动管理.结束日期')">
        </el-date-picker>
      </div>
      <div class="input-group">
          <div class="label">{{$t('活动管理.活动海报')}}：</div>
          <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(this,'banner')"
            :before-upload="beforeAvatarUpload.bind(null,'banner')"
            :on-preview="handlePictureCardPreview">
            <img v-if="banner.src" :src="banner.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="banner.src" alt="">
          </el-dialog>
      </div>
      <div class="input-group add-commit">
        <el-button class="mr" type="info" @click="goBack">{{$t('通用.取消')}}</el-button>
        <el-button class="ml" type="success" @click="savePage">{{$t('通用.保存')}}</el-button>
      </div>
    </section>
</template>

<script>
import axios from 'axios'
import {countryList,province as provinceMap,city as cityMap,district as districtMap,bank as bankMap,area as areaMap,midtransBank} from '../../commen/basicInfo'
axios.defaults.headers.common['Content-Type'] = 'application/json'
export default {
  layout: 'withNav',
  data:function() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      typeList: [],
      promoForm: {

      },
      banner: {
        key: '',
        src: ''
      },// 活动banner图
      promoTime: [],
    }
  },
  async created() {
    this.getType()
  },
  methods: {
    async getType() {
      let { data } = await axios.get('/api/json/guldan/admin/promo/type/list')
      if (data.success) {
        this.typeList = data.data
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async beforeAvatarUpload(type,file) {
      let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=3&cnt=1`,{headers:{loginType:1}})
      if(data.success) {
          let url = data.data[0].url
          , key = data.data[0].key
          , src = data.data[0].src
          let res = await this.amazonUpload(url,file)
          if(res.success) {
              this[type].key = key 
              this[type].src = src
          } else {
              this.$message.error(this.$t('通用.图片上传失败'))
          }
      } else {
          this.$message.error(this.$t('通用.图片上传失败'))
      }
      return Promise.reject()
    },
    handleAvatarSuccess(urlType,{data}, file) {
      this[urlType] = data.url
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    resetPage() {
      console.log('reset page')
    },
    goBack(){
      this.$router.go(-1);
    },
    async savePage() {
      const minStartTime = Date.now() + 10 * 60 * 1000;
      const {promoForm,banner,promoTime} = this
      , {type,title} = promoForm
      // ----------------------  校验  ---------------------
      if(!type) {
        return this.$message.error(this.$t('活动管理.请选择活动类型'))
      } else if(!title) {
        return this.$message.error(this.$t('活动管理.请填写活动名称'))
      } else if(!promoTime[0] || !promoTime[1]) {
        return this.$message.error(this.$t('活动管理.请选择活动时间'))
      } else if(promoTime[0] < minStartTime){
        return this.$message.error(this.$t('活动管理.活动开始时间必须在当前10min之后'));
      }else if(!banner.key) {
        return this.$message.error(this.$t('活动管理.请选择活动海报'))
      } 
      const param = {
        ...promoForm,
        banner: banner.key,
        startTime: promoTime[0],
        endTime: promoTime[1]
      }
      let {data} = await axios.post('/api/json/guldan/admin/promo/add',param)
      if(data.success) {
        this.$message.success(this.$t('通用.添加成功'))
        this.addPromoData = data.data;
        this.$router.push(`/promo/promoList`);
      } else {
        this.$message.error(data.errMsg)
      }
    },
  }
}
</script>
<style scoped lang="scss">
.add{
  margin-left: 2rem;
  .input-group{
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding: 1rem;
    // background-color: #eee;

    .label{
      min-width: 10rem;
    }
  }
  .dimention{
    .dimention-add{
      padding-bottom: 1rem;
      border-bottom: 2px solid #ccc;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      align-items: center;

      .el-tag{
        margin-left: 0.5rem;
      }

      .add-property-btn{
        margin-left: 3rem;
        border-left: 2px solid #ccc;
      }
    }
    .dimention-list{
      display: flex;
      flex-direction: column;

      &-item{
        display: flex;
        margin-top: 1rem;
        align-items: center;

        .delete-property-btn{
          margin-left: 3rem;
        }
        
      }
    }

  }
  &-commit{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style>
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
