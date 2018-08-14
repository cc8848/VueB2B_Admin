<template>
  <section class="container courier-detail">
    <div class="header">
      <div class="header-name">{{$t('物流管理.快递员详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <div>
      <el-card class="base-info">
        <div slot="header" class="base-info-header">
          <span>{{$t('物流管理.基本信息')}}</span>
          <div class="operates">
            <el-button v-if="!isEditing" @click="edit">{{$t('通用.编辑')}}</el-button>
            <el-button v-if="isEditing" @click="update">{{$t('通用.更新')}}</el-button>
            <el-button v-if="isEditing" @click="cancel">{{$t('通用.取消')}}</el-button>
          </div>
        </div>
        <div>
          <div class="input-group">
            <div class="label">{{$t('物流管理.快递员姓名')}}:</div>
            <el-input
              class="couier-name-input"
              :placeholder="$t('物流管理.请输入内容')"
              v-model="courier.courierName"
              :disabled="disabled"
            >
            </el-input>
            <div class="label ml">{{$t('物流管理.性别')}}:</div>
            <el-select
              v-model="courierSex"
              :disabled="disabled"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="input-group">
            <div class="label">{{$t('物流管理.住址')}}:</div>
            <el-input
              :placeholder="$t('物流管理.请输入内容')"
              v-model="courier.courierLoca"
              :disabled="disabled"
            >
            </el-input>
            <div class="label ml">{{$t('物流管理.联系电话')}}:</div>
            <el-input
              :placeholder="$t('物流管理.请输入内容')"
              v-model="courier.courierPhone"
              :disabled="disabled"
            >
            </el-input>
          </div>
          <div class="input-group">
            <div class="label">{{$t('物流管理.配送地区')}}:</div>
            <address-area
              v-model="courierArea"
              type="city"
              :disabled="disabled"
            >
            </address-area>
          </div>
          <div class="input-group">
            <div class="label">{{$t('物流管理.详细地址')}}:</div>
            <el-input
              type="textarea"
              autosize
              :placeholder="$t('物流管理.请输入内容')"
              v-model="courier.courierAddr"
              :disabled="disabled"
            >
            </el-input>
          </div>
          <div class="input-group">
              <div class="label">{{$t('物流管理.持证件照图片')}}:</div>
              <el-upload
                class="avatar-uploader"
                action="/api/img/upload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :disabled="disabled"
              >
                <img v-if="courier.courierImg.src" :src="courier.courierImg.src" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
          </div>
        </div>
      </el-card>
      <el-card class="delivery-record">
        <div slot="header" class="delivery-record-header">
          <span>{{$t('物流管理.交付记录')}}</span>
        </div>
        <div>
          <div>{{$t('物流管理.总交付')}}：{{cnt}}</div>
          <data-table :tableData="tableData" :tableHeader="tableHeader" class="table"></data-table>
          <div class="pagination">
            <el-pagination
              background
              :current-page.sync="currentPage"
              :page-size.sync="count"
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>
<script>
import axios from 'axios';
import DataTable from '~/components/global/DataTable';
import AddressArea from '~/components/pages/logistics/AddressArea';
const tableHeader = [
  {prop: 'id', label: '物流管理.订单ID'},
  {prop: 'receiver', label: '物流管理.收货人'},
  {prop: 'receiverPhone', label: '物流管理.联系电话'},
  {prop: 'address', label: '物流管理.收货地址'},
  {prop: 'status', label: '物流管理.订单状态', vueFilter: 'formatOrderState'},
  {prop: 'shopName', label: '物流管理.商家名称'},
  {prop: 'createTime', label: '物流管理.下单时间', vueFilter: 'formatDate'}
];
export default {
  layout: 'withNav',
  components: {
    AddressArea,
    DataTable
  },
  data: function(){
    return {
      courier: {
        courierImg: {
          src: '',
          key: ''
        },
      },
      sexOptions: [{
        value: 0,
        label: this.$t('通用.男')
      },{
        value: 1,
        label: this.$t('通用.女')
      }],

      currentPage: 1,
      count: 20,
      orderList: [],
      cnt: '',
      
      tableHeader: [...tableHeader],
      isEditing: false,
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },

  computed: {
    courierSex: {
      get: function(){
        if(this.sexOptions[this.courier.courierSex]){
          return this.sexOptions[this.courier.courierSex].label;
        }else{
          return this.courier.courierSex;
        }
      },
      set: function(val){
        this.courier.courierSex = val;
      }
    },
    courierArea: {
      get: function(){
        return {
          area: this.courier.courierArea,
          id: this.courier.courierAreaId,
        }
      },
      set: function(newVal){
        this.courier.courierArea = newVal.area;
        this.courier.courierAreaId = newVal.id;
      }
    },
    disabled: function(){
      return !this.isEditing;
    },
    courierId: function(){
      return this.$route.params.id
    },
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    tableData: function(){
      return this.orderList;
    }
  },

  async created(){
    await this.requestCourierDetail();
    await this.requestOrderCnt();
    await this.requestOrderList();
  },

  methods: {
    async beforeAvatarUpload(file) {
      let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=8&cnt=1`)
      if(data.success) {
          let url = data.data[0].url
          , key = data.data[0].key
          , src = data.data[0].src
          let res = await this.amazonUpload(url,file);
          if(res.success) {
              this.courier.courierImg = {key: key, src: src};
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

    async requestCourierDetail(params){
      try{
        let {data} = await axios.post(`/api/json/zuljin/admin/courier/query`,{courierId: this.courierId}, {formData: true});
        if(data.success){
          this.courier = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
    },

    async requestOrderList(){
      try{
        let params = {
          courierId: this.courierId,
          count: this.count,
          offset: this.offset,
        }
        let {data} = await axios.get(`/api/json/maiev/admin/courier/order/list`,{params});
        if(data.success){
          this.orderList = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
    },

    async requestOrderCnt(){
      let params= {
        courierId: this.courierId
      }
      let {data} = await axios.get(`/api/json/maiev/admin/courier/order/cnt`,{params});
      if(data.success){
        this.cnt = data.data;
      }else{
        this.$message.error(data.errMsg);
      }
    },

    handleCurrentChange(){
      this.requestOrderList();
    },

    edit(){
      this.isEditing = true;
    },

    cancel(){
      this.isEditing = false;
      this.requestCourierDetail();
    },

    async update(){
      const { courierName, courierSex, courierPhone, courierLoca, courierAddr, courierImg, courierArea, courierAreaId} = this.courier;
      // ----------------------  校验  ---------------------
      if(!courierName){
        return this.$message.error(this.$t('物流管理.请填写快递员姓名'));
      }else if(!courierSex && courierSex !== 0){
        return this.$message.error(this.$t('物流管理.请填写性别'));
      }else if(!courierLoca){
        return this.$message.error(this.$t('物流管理.请填写住址'));
      }else if(!courierPhone){
        return this.$message.error(this.$t('物流管理.请填写联系电话'));
      }else if(!courierAddr){
        return this.$message.error(this.$t('物流管理.请填写详细地址'));
      }else if(!courierImg.key){
        return this.$message.error(this.$t('物流管理.请填写持证件照图片'));
      }else if(!courierAreaId){
        return this.$message.error(this.$t('物流管理.请选择配送地区'))
      }
      let param = {
        courierName: courierName,
        courierSex: courierSex,
        courierPhone: courierPhone,
        courierLoca: courierLoca,
        courierAddr: courierAddr,
        courierImg: courierImg.key,
        courierArea: courierArea,
        courierAreaId: courierAreaId
      };
      param.courierId = this.courierId;
      let response = await axios.post('/api/json/zuljin/admin/courier/update',param,{formData: true})
      if(response.data.success) {
        this.$message.success(this.$t('通用.保存成功'));
        this.isEditing = false;
      }else{
        this.$message.error(response.data.errMsg);
      }
    },

    goBack() {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="scss">
.courier-detail {
  .base-info{
    &-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .delivery-record{
    margin-top: 1rem;
  }

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

  .table{
    padding: 16px 0;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
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


