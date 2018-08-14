<template>
    <section class="container add">
        <div class="input-group">
            <div class="label">{{$t('商户管理.商家名称')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="vendorName"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.搜索')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="condition"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.是否自营')}}</div>
            <el-select class="ml" v-model="selfSupport" filterable clearable placeholder="请选择">
                <el-option :label="$t('商户管理.是')" :value="'0'"></el-option>
                <el-option :label="$t('商户管理.否')" :value="'1'"></el-option>
            </el-select>
            <div class="label ml">{{$t('商户管理.是否支持货到付款')}}</div>
            <el-select class="ml" v-model="selfLoan" filterable clearable placeholder="请选择">
                <el-option :label="$t('商户管理.支持')" :value="'0'"></el-option>
                <el-option :label="$t('商户管理.不支持')" :value="'1'"></el-option>
            </el-select>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.选择地址')}}</div>
            <el-select class="" v-model="country" @change="changeCountry" filterable clearable :placeholder="$t('商户管理.请选择国家')">
                <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.countryName"
                :value="item.id">
                </el-option>
            </el-select>
            <el-select class="ml" v-model="province" @change="changeProvince" filterable clearable :placeholder="$t('商户管理.请选择省份')">
                <el-option
                v-for="(item,idx) in provinceList"
                :key="idx"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
            <el-select class="ml" v-model="city" @change="changeCity" filterable clearable :placeholder="$t('商户管理.请选择城市')">
                <el-option
                v-for="(item,idx) in cityList"
                :key="idx"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.详细地址')}}</div>
            <el-input
                style="width:25rem;"
                placeholder="请输入内容"
                v-model="street"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
          <div class="label">{{$t('物流管理.配送地区')}}</div>
          <el-radio-group class="ml" v-model="expressArea">
            <el-radio :label="String(area.id)" v-for="(area,idx) in expressAreaList" :key="idx">{{area.name}}</el-radio>
          </el-radio-group>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.商户照片')}}</div>
            <!-- 取消店铺图片上传多张，改为上传一张 -->
            <!-- <el-upload
                action="/api/img/upload"
                :on-success="handleCarouselSuccess"
                list-type="picture-card"
                :limit="8"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleCarouselRemove">
                <i class="el-icon-plus"></i>
            </el-upload> -->
            <el-upload
              class="avatar-uploader"
              action="/api/img/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess.bind(this,'shopImg')"
              :before-upload="beforeAvatarUpload.bind(null,'shopImg')"
              :on-preview="handlePictureCardPreview">
              <img v-if="shopImg.src" :src="shopImg.src" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.联系人姓名')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="contactName"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.联系电话')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="contactPhone"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.账户名称')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="email"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.密码')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="password"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.银行')}}</div>
            <el-select class="" v-model="bank" filterable clearable :placeholder="$t('商户管理.银行')">
                <el-option
                v-for="(item,idx) in bankList"
                :key="idx"
                :label="item.bankName"
                :value="item.id">
                </el-option>
            </el-select>
            <div class="label ml">{{$t('商户管理.银行账号')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="bankAccountNo"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.SWIFT代码')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="swiftCode"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.受益人')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="benefName"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.纳税账号')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="taxNumber"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.NPWP持卡人姓名')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="taxName"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
          <div class="label">{{$t('商户管理.NPWP卡照片')}}</div>
          <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(this,'taxImage')"
            :before-upload="beforeAvatarUpload.bind(null,'taxImage')"
            :on-preview="handlePictureCardPreview">
            <img v-if="taxImage.src" :src="taxImage.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="input-group add-commit">
        <!-- <el-button class="mr" type="info" @click="resetPage">重置</el-button> -->
        <el-button class="ml" type="success" @click="savePage">{{$t('商户管理.保存')}}</el-button>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import {countryList,province as provinceMap,city as cityMap,district as districtMap,bank as bankMap,area as areaMap,midtransBank} from '../../commen/basicInfo'
axios.defaults.headers.common['Content-Type'] = 'application/json'
export default {
  layout: 'withNav',
  data:function() {
    return {
      vendorName: '',//商户名称
      condition: '',//商户编号
      selfSupport: '0', //是否自营
      selfLoan: '0', //是否货到付款
      countryList,
      country: null,//选中国家
      provinceList: [],
      province: null,//选中省份
      cityList: [],
      city: null,//选中城市
      districtList: [],
      district: null, //区域，印尼才有
      areaList: [],
      areaId: null, // 地区
      street: '', //街道地址
      expressArea: '1',
      // carouselImgs: [], //店铺图片
      shopImg: {
        key: '',
        src: ''
      },
      dialogImageUrl: '',
      bankList: [],
      contactName: '',  //联系人姓名
      contactPhone: '', //联系人电话
      email: '', //账号名
      password: '', // 账号密码
      bank: null, // 银行
      bankAccountNo: '', // 银行账号
      swiftCode: '', // swiftCode
      benefName: '', // 受益人姓名
      taxNumber: '', // 税号
      taxName: '', // 纳税人
      taxImage: {
        key: '',
        src: ''
      }, // 纳税图片
      dialogVisible: false,
      expressAreaList: [
        {
          "name": "DKI Jakarta",
          "id": 1
        },
        {
          "name": "Jawa Timur",
          "id": 67
        }
      ]
    }
  },
  async created() {
    // ----------------------  目前只有印尼  ---------------------
    this.countryList = countryList.filter(i => i.id === 1)
  },
  methods: {
    async changeCountry(id) {
      // ----------------------  获取银行列表  ---------------------
      let bankRes = await axios.post(`/api/json/gruul/admin/merchant/queryBankList`,{countryId:id})
      if(bankRes.data.success) {
        this.bankList = bankRes.data.data
      }
      // ----------------------  对应国家码  ---------------------
      let countryCode = (countryList.find(item => item.id === id) || countryList[0]).countryCode
      // ----------------------  更改国家需要重置  ---------------------

      this.province = null
      this.city = null
      this.bank = null
      this.district = null

      this.provinceList = provinceMap[countryCode];
      // this.bankList = bankMap[countryCode];
      this.areaList = areaMap[id];
      this.areaId = 1;
    },
    changeProvince(v) {
      this.city = null
      this.cityList = cityMap[v]
    },
    changeCity(v) {
      this.districtList = districtMap[v]
    },
    async beforeAvatarUpload(type,file) {
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
    handleCarouselSuccess({data},file,fileList) {
      this.carouselImgs.push({name:file.name,url:data.url})
    },
    handleCarouselRemove(file, fileList,aa) {
      this.carouselImgs = this.carouselImgs.filter(item => item.name !== file.name)
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
    async savePage() {
      const {vendorName,condition,selfSupport,selfLoan,country,province,city,district,areaId,street,expressArea,carouselImgs,shopImg,
      contactName,contactPhone,email,password,bank,bankAccountNo,swiftCode,benefName,taxName,taxNumber,taxImage} = this
      // ----------------------  校验  ---------------------
      if(!vendorName || !condition) {
        return this.$message.error(this.$t('商户管理.请填写商户名'))
      } else if(!country || !province || !city) {
        return this.$message.error(this.$t('商户管理.请选择地址'))
      } else if(!street) {
        return this.$message.error(this.$t('商户管理.请填写详细地址'))
      } else if(!shopImg.key) {
        return this.$message.error(this.$t('商户管理.请添加商铺图片'))
      } else if(!contactName || !contactPhone) {
        return this.$message.error(this.$t('商户管理.请填写联系人姓名和电话'))
      } else if(!email || !password) {
        return this.$message.error(this.$t('商户管理.请填写账户名和密码'))
      } else if(!bank || !bankAccountNo) {
        return this.$message.error(this.$t('商户管理.请填写银行和账号'))
      } else if(!swiftCode || !benefName) {
        return this.$message.error(this.$t('商户管理.请填写受益人信息'))
      } else if(!taxName || !taxNumber) {
        return this.$message.error(this.$t('商户管理.请填写纳税信息'))
      } else if(!taxImage.key) {
        return this.$message.error(this.$t('商户管理.请添加纳税图片'))
      }
      
      let param = {
        shopName:vendorName,
        condition,
        selfSupport,
        selfLoan,
        countryId: country+'',
        provinceId: province,
        cityId: city,
        address: street,
        expressArea,
        accountName: email,
        loginPwd: md5(password),
        shopImg:shopImg.key,
        contacts:contactName,
        contactNumber:contactPhone,
        bankId:bank+'',
        bankAccount: bankAccountNo,
        swiftCode,
        payee: benefName,
        tin: taxNumber,
        npwpCardHolderName: taxName,
        npwpCardImg: taxImage.key
      }
      , testparam = {
        shopName:'vendorName',
        condition:'vendor',
        countryId: '1',
        provinceId: 'Jawa Tengah',
        cityId: 'Kabupaten',
        address: 'akulaku',
        expressArea: '1',
        accountName: 'test@test.com',
        loginPwd: md5(1234),
        shopImg:'https://drxf4sxe82fjt.cloudfront.net/catalog/img/Ap8tHy2RC7dHhIWVb-AobPdj5AKGoAXkBgyFofVU9lI.jpg',
        contacts:'kevin',
        contactNumber:'13243554',
        bankId:'BNI',
        bankAccount: '534523525252',
        swiftCode:'swift-324',
        payee: 'kevin',
        tin: 'tax-4323',
        npwpCardHolderName: 'kevin',
        npwpCardImg: 'https://drxf4sxe82fjt.cloudfront.net/catalog/img/n9ytIJaJ-egipKTg6mDqfh3EYN1CsVvPha9EsoHU2W8.jpg'
      }
      let {data} = await axios.post('/api/json/gruul/admin/merchant/add',param)
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.$router.push('/merchant/merchantList')
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
    background-color: #eee;

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
    justify-content: center;
  }
}
</style>

