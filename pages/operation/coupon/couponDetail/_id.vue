<template>
  <section class="container coupon">
    <div class="header">
      <div class="header-name">{{$t('优惠券.优惠券详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <form ref="form" v-loading="loading">
      <el-card :header="$t('优惠券.基本信息')" class="basicInfo">
        <div class="input-group">
          <div class="label">{{$t('优惠券.优惠券类型')}}</div>
          <el-select
            v-model="couponForm.type"
            :disabled="disabled">
            <el-option
              v-for="item in typeList"
              :key="item.type"
              :label="item.type | formatCouponType"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <div class="label">{{$t('优惠券.优惠券名称')}}</div>
          <el-input
            class="name"
            v-model="couponForm.name"
            :disabled="disabled"
            :maxlength="30"
          >
          </el-input>
        </div>
        <div class="input-group">
          <div class="label">{{$t('优惠券.发送时间')}}</div>
          <el-date-picker
            class="time"
            v-model="couponTime"
            :disabled="disabled"
            value-format="timestamp"
            type="datetimerange"
            range-separator="-">
          </el-date-picker>
        </div>
      </el-card>
      <el-card :header="$t('优惠券.优惠券限制条件')" class="limitation">
        <div class="input-group">
          <div class="label">{{couponForm.type | formatCouponType}}</div>
          <span>{{$t('优惠券.满')}}</span>
          <input-integer
            class="number"
            :value="couponForm.useCondition.amount"
            @input="(value)=>{couponForm.useCondition.amount=value}"
            :disabled="disabled"
            size="small"
            :controls="false"
            :step="1000"
            integer="floor"
            >
          </input-integer>
          <span>{{couponForm.type===1?$t('优惠券.减'):$t('优惠券.折')}}</span>
          <input-integer
            v-if="couponForm.type===1"
            class="number"
            :value="couponForm.useCondition.discount"
            @input="(value)=>{couponForm.useCondition.discount=value}"
            :disabled="disabled"
            size="small"
            :controls="false"
            :min="100"
            :step="100"
            integer="floor"
            >
          </input-integer>
          <el-input-number
            v-if="couponForm.type===2"
            class="number"
            v-model="couponForm.useCondition.discount"
            :disabled="disabled"
            size="small"
            :controls="false"
            :max="0.99"
            :min="0.01"
            :step="0.1"
            >
          </el-input-number>
        </div>
        <div class="input-group">
          <div class="label">{{$t('优惠券.使用范围')}}</div>
          <el-radio-group
            v-model="couponForm.useCondition.scope"
            :disabled="disabled">
            <el-radio :label="1">{{$t('优惠券.全场商品')}}</el-radio>
            <el-radio :label="2">{{$t('优惠券.指定品类')}}</el-radio>
            <el-radio :label="3">{{$t('优惠券.指定商品')}}</el-radio>
          </el-radio-group>
        </div>
        <div class="template-upload-wrap" v-show="showUseConditionScopeUpload">
          <el-button
            size="small"
            :disabled="disabled"
            @click.native.prevent="downloadUseTargetUrl">
            {{$t('优惠券.下载模板')}}
          </el-button>
          <el-upload
            class="upload"
            v-show="showCatalogUpload"
            :disabled="disabled"
            action=""
            :limit="1"
            :file-list="useTargetFileList"
            :auto-upload="false"
            :onChange="changeUseTarget">
            <el-button size="small" :disabled="disabled">{{$t('优惠券.上传品类ID')}}</el-button>
          </el-upload>
          <el-upload
            class="upload"
            v-show="showSpuUpload"
            :disabled="disabled"
            action=""
            :limit="1"
            :file-list="useTargetFileList"
            :auto-upload="false"
            :onChange="changeUseTarget">
            <el-button size="small" :disabled="disabled">{{$t('优惠券.上传商品ID')}}</el-button>
          </el-upload>
        </div>
        <div class="input-group" v-show="showCatalog">
          <div class="label">{{$t('优惠券.品类ID')}}</div>
          <div>
            {{''+couponForm.useCondition.targetList}}
          </div>
        </div>
        <div class="input-group" v-show="showSpu">
          <div class="label">{{$t('优惠券.商品ID')}}</div>
          <div>
            {{''+couponForm.useCondition.targetList}}
          </div>
        </div>
        <div class="input-group" v-for="(limitation, index) in useLimitationList" :key="index">
          <div class="label">{{limitation.item | formatCouponLimitation}}</div>
          <el-radio-group
            v-model="couponForm.useCondition.limitation[index]"
            :disabled="disabled">
            <el-radio
              v-for="option in limitation.option"
              :key="option.limit"
              :label="option.limit"
            >
              {{option.limit | formatCouponLimitationOption}}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="input-group">
          <div class="label">{{$t('优惠券.有效期')}}</div>
          <div>
            <span>{{$t('优惠券.领券后')}}</span>
            <input-integer
              class="number"
              :value="couponForm.useCondition.validDay"
              @input="(value)=>{couponForm.useCondition.validDay=value}"
              :disabled="disabled"
              size="small"
              :controls="false"
              :min="1"
              integer="floor"
              >
            </input-integer>
            <span>{{$t('优惠券.天可用')}}</span>
          </div>
        </div>
        <!-- <div class="input-group">
          <div class="label">{{$t('优惠券.可用时间')}}</div>
          <el-date-picker
            value-format="timestamp"
            type="datetimerange"
            range-separator="-">
          </el-date-picker>
        </div> -->
      </el-card>
      <el-card :header="$t('优惠券.优惠券发放条件')" class="distribute">
        <div class="input-group">
          <div class="label">{{$t('优惠券.发送对象')}}</div>
          <el-radio-group
            v-model="couponForm.offerCondition.scope"
            :disabled="disabled">
            <el-radio
              v-for="item in offerScopeList"
              :key="item.scope"
              :label="item.scope"
            >
              {{
                 item.scope | formatCouponOfferScope
              }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="template-upload-wrap" v-show="showOfferConditionUpload">
          <el-button
            size="small"
            :disabled="disabled"
            @click.native.prevent="downloadOfferTargetUrl">
            {{$t('优惠券.下载模板')}}
          </el-button>
          <el-upload
            class="upload"
            :disabled="disabled"
            action=""
            :limit="1"
            :file-list="offerTargetFileList"
            :auto-upload="false"
            :onChange="changeOfferTargetFile">
            <el-button size="small" :disabled="disabled">{{$t('优惠券.上传UID')}}</el-button>
          </el-upload>
        </div>
        <div class="input-group" v-show="showOffer">
          <div class="label">UID</div>
          <div>
            {{''+couponForm.offerCondition.targetList}}
          </div>
        </div>
        <!-- <div class="input-group">
          <div class="label">发送总量</div>
          <el-input></el-input>
          <div class="label ml">单用户领取上限</div>
          <el-input></el-input>
        </div> -->
        <div class="input-group">
          <div class="label">{{$t('优惠券.领取方式')}}</div>
          <el-radio-group
            v-model="couponForm.offerCondition.method"
            :disabled="disabled">
            <el-radio :label="1">{{$t('优惠券.系统自动发放')}}</el-radio>
            <!-- <el-radio label="2">{{$t('优惠券.用户手动领取')}}</el-radio> -->
          </el-radio-group>
        </div>
      </el-card>

      <div class="input-group footer-wrap" v-if="couponForm.status===1">
        <el-button v-if="!isEditing" class="mr" type="success" @click="edit">{{$t('通用.编辑')}}</el-button>
        <el-button v-if="isEditing" class="mr" type="info" @click="cancel">{{$t('通用.取消')}}</el-button>
        <el-button v-if="isEditing" class="ml" type="success" @click="savePage">{{$t('通用.保存')}}</el-button>
      </div>
    </form>
  </section>
</template>
<script>
import InputInteger from '~/components/global/InputInteger'
import axios from 'axios';
import qs from 'qs';
export default {
  layout: 'withNav',
  components: {
    InputInteger
  },
  data: function(){
    return {
      loading: false,
      isEditing: false,
      typeList: [],
      offerScopeList: [],
      useLimitationList: [],
      couponForm: {
        type: 1,
        offerCondition: {
          method: 1
        },
        useCondition: {
          limitation: [],
          scope: 1,
          amount: 0,
          discount: 0,
        }
      },
      couponTime: [],
      useTargetFileList: [],
      offerTargetFileList: [],

      offerTargetUrl: 'https://akulaku.s3.amazonaws.com/akugrosir/public/coupon/coupon_offer_target.xlsx',
      useTargetUrl: 'https://akulaku.s3.amazonaws.com/akugrosir/public/coupon/coupon_use_target.xlsx'
    }
  },
  computed: {
    showUseConditionScopeUpload: function(){
      return this.couponForm.useCondition.scope === 2 || this.couponForm.useCondition.scope === 3;
    },
    showCatalogUpload: function(){
      return this.couponForm.useCondition.scope === 2;
    },
    showSpuUpload: function(){
      return this.couponForm.useCondition.scope === 3;
    },
    showOfferConditionUpload: function(){
      return this.couponForm.offerCondition.scope === 2;
    },
    couponId: function(){
      return this.$route.params.id;
    },
    disabled: function(){
      return !this.isEditing
    },
    showOffer(){
      let offerCondition = this.couponForm.offerCondition;
      return offerCondition.targetList && offerCondition.scope === 2;
    },
    showCatalog(){
      let useCondition = this.couponForm.useCondition;
      return useCondition.targetList && useCondition.scope === 2;
    },
    showSpu(){
      let useCondition = this.couponForm.useCondition;
      return useCondition.targetList && useCondition.scope === 3;
    }
  },
  watch: {
    couponTime: function(newVal, oldVal){
      if(Array.isArray(newVal)){
        let [startTime, endTime] = newVal;
        this.couponForm.startTime = startTime;
        this.couponForm.endTime = endTime;
      }else{
        this.couponForm.startTime = undefined;
        this.couponForm.endTime = undefined;
      }
    }
  },
  async created(){
    this.loading = true;
    await this.initRadio();
    await this.requestCouponDetail();
    this.loading = false;
  },
  methods: {
    async requestCouponDetail(){
      let {data} = await axios.get(`/api/json/thrall/admin/coupon/detail?couponId=${this.couponId}`)
      if(data.success){
        this.updateCouponForm(data.data);
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestCouponTypeList(){
      let {data} = await axios.get('/api/json/thrall/admin/coupon/type/list');
      if(data.success){
        this.typeList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestCouponOfferScopeList(){
      let {data} = await axios.get('/api/json/thrall/admin/coupon/offer/scope/list');
      if(data.success){
        this.offerScopeList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestCouponUseLimitationList(){
      let {data} = await axios.get('/api/json/thrall/admin/coupon/use/limitation/list');
      if(data.success){
        this.useLimitationList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async initRadio(){
      await this.requestCouponTypeList();
      await this.requestCouponOfferScopeList();
      await this.requestCouponUseLimitationList();

      if(this.offerScopeList && this.offerScopeList[0]){
        this.couponForm.offerCondition = Object.assign({}, this.couponForm.offerCondition, {scope: this.offerScopeList[0].scope});
      }
      if(Array.isArray(this.useLimitationList)){
        this.couponForm.useCondition.limitation = this.useLimitationList.map(function(value){
          return value && value.option && value.option[0] && value.option[0].limit;
        })
      }
    },
    updateCouponForm(data){
      let limitation = this.couponForm.useCondition.limitation;
      this.couponForm = Object.assign({}, this.couponForm, data);
      if(data.useCondition && typeof data.useCondition.paymentLimitation !== 'undefined'){
        limitation[0] = data.useCondition.paymentLimitation;
      }
      this.$set(this.couponForm.useCondition, 'limitation', [...limitation]);
      this.couponTime = [data.startTime, data.endTime];
    },
    downloadUseTargetUrl(){
      location.href = this.useTargetUrl;
    },
    changeUseTarget(file, fileList){
      this.useTargetFileList = fileList;
      this.couponForm.useTargetFile = file.raw;
    },
    downloadOfferTargetUrl(){
      location.href = this.offerTargetUrl;
    },
    changeOfferTargetFile(file, fileList){
      this.offerTargetFileList = fileList;
      this.couponForm.offerTargetFle = file.raw;
    },
    edit(){
      this.isEditing = true;
    },
    cancel(){
      this.isEditing = false;
    },
    goBack(){
      this.$router.go(-1);
    },
    async savePage() {
      const minStartTime = Date.now() + 3 * 60 * 1000;
      const {couponForm, showUseConditionScopeUpload, showCatalogUpload, showOfferConditionUpload} = this;
      let params = {
        ...couponForm
      };
      if(!params.type){
        return this.$message.error(this.$t('优惠券.请输入优惠券类型'));
      }else if(!params.name){
        return this.$message.error(this.$t('优惠券.请输入优惠券名称'));
      }else if(!params.startTime || !params.endTime){
        return this.$message.error(this.$t('优惠券.请输入发放时间'));
      }else if(params.startTime < minStartTime){
        return this.$message.error(this.$t('优惠券.开始时间必须在当前3min之后'))
      }else if(typeof params.useCondition.amount !== 'number' || typeof params.useCondition.discount!=='number'){
        if(params.type === 1){
          return this.$message.error(this.$t('优惠券.请输入满减'));
        }else{
          return this.$message.error(this.$t('优惠券.请输入满折'));
        }
      }else if(!params.useCondition.scope){
        return this.$message.error(this.$t('优惠券.请输入使用范围'));
      }else if(!params.useCondition.validDay){
        return this.$message.error(this.$t('优惠券.请输入有效期'));
      }else if(!params.offerCondition.scope){
        return this.$message.error(this.$t('优惠券.请输入发送对象'));
      }else if(!params.offerCondition.method){
        return this.$message.error(this.$t('优惠券.请输入领取方式'));
      }else if(showUseConditionScopeUpload
        &&!(params.useTargetFile instanceof File)
        &&!params.useCondition.targetList){
        if(showCatalogUpload){
          return this.$message.error(this.$t('优惠券.请上传品类ID'));
        }else{
          return this.$message.error(this.$t('优惠券.请上传商品ID'));
        }
      }else if(showOfferConditionUpload
        && !(params.offerTargetFle instanceof File)
        && !params.offerCondition.targetList){
          return this.$message.error(this.$t('优惠券.请上传UID'));
      }
      if(!showUseConditionScopeUpload){
        delete params.useTargetFile;
      }
      if(!showOfferConditionUpload){
        delete params.offerTargetFle;
      }
      let formData = this.objectToFormData(params, {indices: true});
      this.loading = true;
      let {data} = await axios.post(`/api/json/thrall/admin/coupon/edit?id=${this.couponId}`, formData);
      if(data.success){
        this.$message.success(this.$t('通用.修改成功'));
        this.isEditing = false;
        await this.requestCouponDetail();
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  .basicInfo,.limitation,.distribute{
    margin-bottom: 1rem;
  }
  .number{
    width: 100px;
  }
  .name{
    width: 400px;
  }
  .input-group{
    .el-input-number{
      padding: 0 7px;
    }
  }
  .template-upload-wrap{
    display: flex;
    align-items: flex-start;
    margin-left: 11rem;
    .upload{
      margin-left: 1rem;
      display: inline-flex;
    }
  }

  .footer-wrap{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style>
.coupon .template-upload-wrap .el-upload-list__item:first-child{
  margin-top: 5px;
  margin-left: 0.8rem;
}
</style>


