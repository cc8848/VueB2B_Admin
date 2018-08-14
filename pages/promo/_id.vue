<template>
  <section class="container promo-detail" v-loading="loading">
    <div class="header">
      <div class="header-name">{{$t('活动管理.活动详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <el-card class="base-info">
      <div slot="header" class="base-info-header">
          <span>{{$t('活动管理.活动信息')}}</span>
          <div class="operates">
            <el-button v-show="couldEditBaseInfo" @click="edit">{{$t('通用.编辑')}}</el-button>
            <el-button v-if="isEditing" @click="update">{{$t('通用.更新')}}</el-button>
            <el-button v-if="isEditing" @click="cancel">{{$t('通用.取消')}}</el-button>
          </div>
      </div>
      <div>
        <div class="input-group">
            <div class="label">{{$t('活动管理.活动类型')}}：</div>
            <el-select
              v-model="promoForm.type"
              :placeholder="$t('活动管理.请选择活动类型')"
              :disabled="disabled">
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
                :disabled="disabled">
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
            :end-placeholder="$t('活动管理.结束日期')"
            :disabled="disabled">
          </el-date-picker>
        </div>
        <div class="input-group">
            <div class="label">{{$t('活动管理.活动海报')}}：</div>
            <el-upload
              class="avatar-uploader"
              action="/api/img/upload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
              :disabled="disabled">
              <img v-if="banner" :src="banner" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="banner" alt="">
            </el-dialog>
        </div>
      </div>
    </el-card>
    <el-card :header="$t('活动管理.活动商品列表')" class="product-list">
      <div>
        <div class="actions" v-show="couldEditSku">
          <div>
            <el-button @click="addSku">{{$t('活动管理.添加商品')}}</el-button>
            <el-button @click="uniFiedPrice" v-show="couldEditPrice">{{$t('活动管理.统一定价')}}</el-button>
            <el-upload
              class="upload-sku"
              :before-upload="beforeSkuFileUpload"
              :show-file-list="false"
              action="/api/json/velen/merchant/spu/add/batch"
              multiple>
              <el-button @click.native.prevent>{{$t('活动管理.批量上传')}}</el-button>
            </el-upload>
            <el-button  @click.native.prevent="downloadTamplate">{{$t('活动管理.下载模板')}}</el-button>
          </div>
          <el-button @click="editSku" v-show="couldEditPrice">{{$t('活动管理.确定修改')}}</el-button>
        </div>
        <data-table :tableData="productListData" :tableHeader="productHeader"></data-table>
        <div class="pagination">
          <el-pagination
            background
            :current-page.sync="currentPage"
            :page-size.sync="count"
            @current-change="handleCurrentChange"
            layout="prev, pager, next">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import axios from 'axios';
import DataTable from '~/components/global/DataTable';
const productHeader = [
  {prop: 'skuId', label: '活动管理.商品ID'},
  {prop: 'skuName', label: '活动管理.商品名称'},
  // {label: '活动管理.类目'},
  {prop: 'price', label: '活动管理.供应价格'},
  {prop: 'promoPrice',label: '活动管理.活动价格', width: '150px'},
  {prop: 'settlementPrice',label: '活动管理.结算价格'},
];
export default {
  layout: 'withNav',
  data() {
    return {
      currentPage: 1,
      count: 20,
      loading: false,
      promoForm: {},
      dialogImageUrl: '',
      dialogVisible: false,
      typeList: [],
      productList: [],
      //正式环境使用的模板
      templateUrl: 'https://d12x8ezp3au6m3.cloudfront.net/akugrosir/public/promo/sku/template.xlsx',
      isEditing: false,
    }
  },
  computed: {
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    promoId() {
      return this.$route.params.id;
    },
    couldEditBaseInfo(){
      return this.promoInfo.status === 1 && !this.isEditing;
    },
    couldEditSku(){
      return this.promoInfo.status !== 3;
    },
    couldEditPrice(){
      return this.promoInfo.status === 1;
    },
    disabled: function(){
      return !this.isEditing;
    },
    banner(){
      if(this.promoForm.bannerSrc){
        return this.promoForm.bannerSrc;
      }else{
        return this.promoForm.banner;
      }
    },
    promoTime:{
      get(){
        let promoTime = [];
        if(this.promoForm.startTime){
          promoTime[0]=this.promoForm.startTime;
        }
        if(this.promoForm.endTime){
          promoTime[1]=this.promoForm.endTime;
        }
        return promoTime;
      },
      set(val){
        let [startTime, endTime]=val;
        if(startTime){
          this.promoForm.startTime = startTime;
        }
        if(endTime){
          this.promoForm.endTime = endTime;
        }
      }
    },
    productListData: function(){
        let step = 1;
        return this.productList.map(v=>({...v, promoPrice: Math.ceil(v.promoPrice), promoPriceMin: step, promoPriceMax: v.price - step}));
    },
    productHeader: function(){
      let operate = {
        isOperate: true,
        label: '通用.操作',
        operate: [
          {
            text: '通用.删除',
            onClick: (row)=>{
              this.confirmDelete(
                this.deleteSku.bind(this, row)
              );
            }
          }
        ]
      };
      let inputNumber = {controls: false, size: 'small', integer: 'ceil'};
      if(this.couldEditSku){
        let couldEditPrice = this.couldEditPrice;
        return [
          ...productHeader.map(function(value){
            if(value.prop==='promoPrice' && couldEditPrice){
              return {...value, inputNumber}
            }else{
              return {...value};
            }
          }),
          operate
        ];
      }else{
        return productHeader;
      }
    },
    promoInfo: function(){
      let promoInfo = { type: 11 };
      promoInfo = Object.assign({}, promoInfo, this.$store.state.promo.list[this.promoId], this.$route.params.promoInfo);
      promoInfo.title = promoInfo.promoName;
      return promoInfo;
    }
  },
  created() {
    this.initPage()
  },
  mounted(){
    //测试环境使用的模板
    if(location && (location.host.indexOf('test') >= 0 || location.host.indexOf('localhost') >= 0)) {
      this.templateUrl = 'https://drxf4sxe82fjt.cloudfront.net/akugrosir/public/promo/sku/template.xlsx';
    }
  },
  methods: {
    async initPage() {
      this.loading = true;
      try{
        await this.getPromoProduct();
        await this.getType();
        this.promoForm = Object.assign({}, this.promoForm, this.promoInfo);
      }catch(error){
        this.$message.error(error.message);
      }
      this.loading = false;
    },
    async beforeAvatarUpload(file) {
      let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=3&cnt=1`);
      if(data.success) {
          let url = data.data[0].url
          , key = data.data[0].key
          , src = data.data[0].src
          let res = await this.amazonUpload(url,file);
          if(res.success) {
              this.promoForm.banner = key
              this.promoForm.bannerSrc = src;
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
    async getType() {
      let { data } = await axios.get('/api/json/guldan/admin/promo/type/list')
      if (data.success) {
        this.typeList = data.data
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async getPromoProduct(){
      let params = {
        promoId: this.promoId,
        offset: this.offset,
        count: this.count
      }
      let {data} = await axios.get(`/api/json/guldan/admin/promo/product`,{params});
      if(data.success){
        this.productList = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async requestEditSku(params){
      this.loading = true;
      try{
        let {data} = await axios.post(`/api/json/guldan/admin/promo/sku/edit`, params);
        if(data.success){
          this.$message.success(this.$t('通用.修改成功'));
        }else{
          this.$message.error(data.errMsg);
        }
        this.loading = false;
        return data;
      }catch(error){
        this.$message.error(error.message);
        this.loading = false;
        return error;
      }
    },
    async editSku(){
      let params = {
        promoId: this.promoId,
        skuList: this.productListData.map(v=>{
          let {promoPriceMin, promoPriceMax, ...other} = v;
          return other; 
        })
      }
      await this.requestEditSku(params);
    },
    goBack() {
      this.$router.go(-1)
    },
    edit() {
      this.isEditing = true;
    },
    async update(){
      const minStartTime = Date.now() + 10 * 60 * 1000;
      let regex = /(?:http?s:\/\/.+?\/)(.+)/;
      let params = {
        // "banner": typeof this.banner === 'string'?this.banner.replace(regex,'$1'):this.banner,
        "endTime": this.promoForm.endTime,
        "promoId": this.promoId,
        "startTime": this.promoForm.startTime,
        "title": this.promoForm.title
      }
      if(this.promoForm.bannerSrc){
        params.banner = this.promoForm.banner;
      }
      if(!params.title) {
        return this.$message.error(this.$t('活动管理.请填写活动名称'));
      } else if(!params.startTime || !params.endTime){
        return this.$message.error(this.$t('活动管理.请选择活动时间'));
      } else if(params.startTime < minStartTime){
        return this.$message.error(this.$t('活动管理.活动开始时间必须在当前10min之后'));
      }if(this.promoForm.bannerSrc && !params.banner) {
        return this.$message.error(this.$t('活动管理.请选择活动海报'));
      }

      try{
        let {data} = await axios.post(`/api/json/guldan/admin/promo/edit`, params);
        if(data.success){
          this.$message.success(this.$t('通用.修改成功'));
          this.isEditing = false;
          this.$store.commit('promo/updateItem', {id: this.promoId, value: {
            "banner": this.banner,
            "endTime": this.promoForm.endTime,
            "promoId": this.promoId,
            "startTime": this.promoForm.startTime,
            "promoName": this.promoForm.title
          }});
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message)
      }
    },
    cancel(){
      this.isEditing = false;
      this.promoForm = Object.assign({}, this.promoInfo);
    },
    addSku(){
      this.$router.push(`/promo/addSku/${this.promoId}`);
    },
    async deleteSku(row){
      let skuIdsQuery = row.skuId;
      let {data} = await axios.post(`/api/json/guldan/admin/promo/sku/delete?promoId=${this.promoId}&skuIds=${skuIdsQuery}`);
      if(data.success){
        this.$message.success(this.$t('通用.删除成功'));
        this.getPromoProduct();
      }else{
        this.$message.error(data.errMsg);
      }
    },
    async uniFiedPrice(){
      try {
        let {value} = await this.$prompt(this.$t('活动管理.活动商品统一折扣')+': ', this.$t('活动管理.提示'), {
          confirmButtonText: this.$t('通用.确认'),
          cancelButtonText: this.$t('通用.取消'),
          inputPattern: /^[1-9][0-9]?%$/,
          inputErrorMessage: this.$t('活动管理[\'折扣格式不正确，正式格式如50%\']')
        });
        let discount = Number(value.replace('%','')) / 100;
        this.productList = this.productList.map((v=>({...v, promoPrice: Math.ceil(v.price * discount)})))
      }catch(err){
        console.log(err);
      }
    },
    handleCurrentChange: function(){
      this.getPromoProduct();
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
    async beforeSkuFileUpload(file) {
      // ----------------------  校验，必须为xlsx文件，大小不超过3M  ---------------------
      if(file.size > 3 * 1024 * 1024 || file.name.split('.').slice(-1)[0] !== 'xlsx') {
        this.$message.error('文件为xlsx格式且不得大于3M');
        return Promise.reject();
      }
      let formData = new FormData();
      formData.append('promoId', this.promoId);
      formData.append('file',file);
      let {data} = await axios.post(`/api/json/guldan/admin/promo/sku/add/batch`,formData);
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'));
        this.getPromoProduct();
      } else {
        this.$message.error(data.errMsg);
      }
      return Promise.reject();
    },
    downloadTamplate() {
      location.href = this.templateUrl;
    }
  },
  components: {
    DataTable
  }
}
</script>
<style lang="scss" scoped>
.promo-detail{
  .base-info{
    &-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .product-list{
    margin-top: 1rem;
    .actions{
      display: flex;
      justify-content: space-between;

      .upload-sku{
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
  .pagination {
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
</style>

