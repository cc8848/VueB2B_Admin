<template>
    <section class="container add">
        <div class="input-group">
            <div class="label">{{$t('商户管理.商家名称')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="shopName"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.是否自营')}}</div>
            <el-select disabled class="ml" v-model="selfSupport" filterable placeholder="请选择">
                <el-option :label="$t('商户管理.是')" :value="'0'"></el-option>
                <el-option :label="$t('商户管理.否')" :value="'1'"></el-option>
            </el-select>
            <div class="label ml">{{$t('商户管理.是否支持货到付款')}}</div>
            <el-select disabled class="ml" v-model="selfLoan" filterable placeholder="请选择">
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
                v-model="address"
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
                v-model="contacts"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.联系电话')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="contactNumber"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.账户名称')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="accountName"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.密码')}}</div>
            <el-input
                type="password"
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="loginPwd"
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
                v-model="bankAccount"
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
                v-model="payee"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
            <div class="label">{{$t('商户管理.纳税账号')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="tin"
                clearable>
            </el-input>
            <div class="label ml">{{$t('商户管理.NPWP持卡人姓名')}}</div>
            <el-input
                style="width:10rem;"
                placeholder="请输入内容"
                v-model="npwpCardHolderName"
                clearable>
            </el-input>
        </div>
        <div class="input-group">
          <div class="label">{{$t('商户管理.NPWP卡照片')}}</div>
          <el-upload
            class="avatar-uploader"
            action="/api/img/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(this,'npwpCardImg')"
            :before-upload="beforeAvatarUpload.bind(null,'npwpCardImg')"
            :on-preview="handlePictureCardPreview">
            <img v-if="npwpCardImg.src" :src="npwpCardImg.src" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="input-group add-commit">
          <el-button v-if="vendorInfo.status !== '0'" class="ml" type="success" @click="$router.go(-1)">{{$t('通用.返回')}}</el-button>
          <el-button class="ml" type="success" @click="savePage">{{$t('商户管理.保存')}}</el-button>
          <div v-if="vendorInfo.status === '0'">
            <el-button class="ml" type="info" @click="handleStatus(2)">{{$t('商户管理.审核驳回')}}</el-button>
            <el-button class="mr" type="success" @click="handleStatus(1)">{{$t('商户管理.审核通过')}}</el-button>
          </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import md5 from 'md5'
import {countryList,province as provinceMap,city as cityMap,district as districtMap,bank as bankMap,area as areaMap,midtransBank} from '../../../commen/basicInfo'
axios.defaults.headers.common['Content-Type'] = 'application/json'
export default {
  layout: 'withNav',
  data:function() {
    return {
      shopName: '',//商户名称
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
      address: '', //街道地址
      expressArea: '1',//配送地区
      // carouselImgs: [], //店铺图片
      shopImg: {
        key: '',
        src: ''
      },
      dialogImageUrl: '',
      bankList: [],
      contacts: '',  //联系人姓名
      contactNumber: '', //联系人电话
      accountName: '', //账号名
      origLoginPwd: '',//保存一份原始密码，用来判断用户是否修改密码
      loginPwd: '', // 账号密码
      bank: null, // 银行
      bankAccount: '', // 银行账号
      swiftCode: '', // swiftCode
      payee: '', // 受益人姓名
      tin: '', // 税号
      npwpCardHolderName: '', // 纳税人
      npwpCardImg: {
        key: '',
        src: ''
      }, // 纳税图片
      dialogVisible: false,

      vendorInfo: {}, //编辑的商户信息
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
  computed: {
    vid() {
      return this.$route.params.id
    }
  },
  async created() {
    // ----------------------  目前只有印尼  ---------------------
    this.countryList = countryList.filter(i => i.id === 1)
    this.initEditPage()
  },
  methods: {
    async initEditPage() {
      let {data} = await axios.post(`/api/json/gruul/admin/merchant/query`,{id: this.vid})
      if(data.success) {
        this.initEditInfo(data.data)
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async initEditInfo(info) {
      this.vendorInfo = info
      const {
        shopName, selfSupport, selfLoan, countryId, provinceId, cityId, address, expressArea, accountName, loginPwd, shopImg, contacts, contactNumber, bankId,
        bankAccount, swiftCode, payee, tin, npwpCardHolderName, npwpCardImg 
      } = info
      this.shopName = shopName,
      this.selfSupport = selfSupport,
      this.selfLoan = selfLoan,
      this.country = Number(countryId),
      await this.changeCountry(Number(countryId))
      this.province = provinceId,
      await this.changeProvince(provinceId)
      this.city = cityId,
      this.changeCity(cityId)
      this.address = address,
      this.expressArea = expressArea,
      this.accountName = accountName,
      this.loginPwd = loginPwd,
      this.origLoginPwd = loginPwd,
      this.shopImg = shopImg,
      this.contacts = contacts,
      this.contactNumber = contactNumber,
      this.bank = Number(bankId),
      this.bankAccount = bankAccount,
      this.swiftCode = swiftCode,
      this.payee = payee,
      this.tin = tin,
      this.npwpCardHolderName = npwpCardHolderName,
      this.npwpCardImg = npwpCardImg
    },
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
      Promise.resolve()
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
    async handleStatus(status) {
      let {data} = await axios.post(`/api/json/gruul/admin/merchant/updateStatus`,{id: this.vid, status: String(status)})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.$router.go(-1)
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async savePage() {
      const {shopName,condition,selfSupport,selfLoan,country,province,city,district,address,expressArea,carouselImgs,shopImg,
      contacts,contactNumber,accountName,loginPwd,origLoginPwd,bank,bankAccount,swiftCode,payee,npwpCardHolderName,tin,npwpCardImg} = this
      // ----------------------  校验  ---------------------
      if(!shopName) {
        return this.$message.error(this.$t('商户管理.请填写商户名'))
      } else if(!country || !province || !city ) {
        return this.$message.error(this.$t('商户管理.请选择地址'))
      } else if(!address) {
        return this.$message.error(this.$t('商户管理.请填写详细地址'))
      } else if(!shopImg.key) {
        return this.$message.error(this.$t('商户管理.请添加商铺图片'))
      } else if(!contacts || !contactNumber) {
        return this.$message.error(this.$t('商户管理.请填写联系人姓名和电话'))
      } else if(!accountName || !loginPwd) {
        return this.$message.error(this.$t('商户管理.请填写账户名和密码'))
      } else if(!bank || !bankAccount) {
        return this.$message.error(this.$t('商户管理.请填写银行和账号'))
      } else if(!swiftCode || !payee) {
        return this.$message.error(this.$t('商户管理.请填写受益人信息'))
      } else if(!npwpCardHolderName || !tin) {
        return this.$message.error(this.$t('商户管理.请填写纳税信息'))
      } else if(!npwpCardImg.key) {
        return this.$message.error(this.$t('商户管理.请添加纳税图片'))
      }
      
      let param = {
        shopName,
        condition,
        selfSupport,
        selfLoan,
        countryId: country+'',
        provinceId: province,
        cityId: city,
        address,
        expressArea,
        accountName,
        shopImg:shopImg.key,
        contacts,
        contactNumber,
        bankId:bank+'',
        bankAccount,
        swiftCode,
        payee,
        tin,
        npwpCardHolderName,
        npwpCardImg:npwpCardImg.key,
        status: this.vendorInfo.status,
        id: this.vid
      }
      // ----------------------  判断用户是否修改密码  ---------------------
      if(origLoginPwd !== loginPwd) { //修改了就做处理
        param.loginPwd = md5(loginPwd)
      }
      let {data} = await axios.post('/api/json/gruul/admin/merchant/update',param)
      if(data.success) {
        this.$message.success(this.$t('通用.保存成功'))
        this.initEditPage()
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
