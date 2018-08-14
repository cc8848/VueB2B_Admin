<template>
  <section class="container">
    <div class="header">
      <div class="header-name">{{$t('订单管理.订单详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <div class="basic block">
      <el-alert class="basic-header alert" :title="$t('通用.基础信息')" type="success" :closable="false"></el-alert>
      <div class="basic-info">
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.订单ID')}}:</div>
            <div class="value">{{orderInfo.id}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.下单时间')}}:</div>
            <div class="value">{{orderInfo.createTime | formatDate}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.订单状态')}}:</div>
            <div class="value">{{orderInfo.status | formatOrderState}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.COD订单')}}:</div>
            <div class="value">{{orderInfo.isCod ? $t('通用.是') : $t('通用.否')}}</div>
          </div>
          <div class="info-group" v-if="orderInfo.fromId">
            <div class="key">{{$t('订单管理.关联订单')}}:</div>
            <div class="value">{{orderInfo.fromId}}</div>
          </div>
        </div>
      </div>
      <div class="basic-table">
        <el-table
        :data="orderInfo.lis"
        style="width: 100%"
        max-height="250">
          <el-table-column
            prop="skuId"
            label="SKU ID"
            >
          </el-table-column>
          <el-table-column
            prop="skuName"
            :label="$t('订单管理.商品名称')"
            >
          </el-table-column>
          <el-table-column
            prop="prop"
            :label="$t('订单管理.SKU规格')"
            >
            <template slot-scope="scope">
              <span>{{getProp(scope.row.prop)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="qty"
            :label="$t('订单管理.数量')"
            >
          </el-table-column>
          <el-table-column
            prop="originalPrice"
            :label="$t('订单管理.供应价格')"
            >
            <template slot-scope="scope">
              <span>{{scope.row.originalPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="settlementPrice"
            :label="$t('订单管理.销售价格')"
            >
            <template slot-scope="scope">
              <span>{{scope.row.payPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t('通用.操作')"
            v-if="showCancelOrder"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="160"
                trigger="click">
                <el-input size="small" :placeholder="$t('订单管理.取消数量')" v-model="scope.row.cancelQty"></el-input>
                <div style="text-align: right; margin-top: 10px">
                  <el-button type="primary" size="mini" @click="cancelSku(scope.row)">{{$t('通用.保存')}}</el-button>
                </div>
                <el-button :ref="`popover-${scope.row.id}`" slot="reference" type="text" size="small">{{$t('通用.取消')}}</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 取消订单列表 -->
    <cancel-list v-if="orderInfo.cancelLis && orderInfo.cancelLis.length" :cancelList="orderInfo.cancelLis"></cancel-list>
    <!-- 优惠信息 -->
    <div class="block">
      <el-alert class="basic-header alert" :title="$t('订单管理.优惠信息')" type="success" :closable="false"></el-alert>
      <div class="discount-info">
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.积分抵扣')}}:</div>
            <div class="value">RP {{(orderInfo.pointsDiscount ? orderInfo.pointsDiscount : 0) | priceFormat}}</div>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.优惠券')}}:</div>
            <div class="value">{{orderInfo.couponId ? orderInfo.couponId : $t('通用.否')}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.优惠券抵扣')}}:</div>
            <div class="value">RP {{(orderInfo.couponDiscount ? orderInfo.couponDiscount : 0) | priceFormat}}</div>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.商品总金额')}}:</div>
            <div class="value">RP {{orderInfo.goodsPrice | priceFormat}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.运费')}}:</div>
            <div class="value">RP {{(orderInfo.freight || 0) | priceFormat}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.实际支付')}}:</div>
            <div class="value">RP {{orderInfo.actualPayPrice | priceFormat}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 物流信息 -->
    <div class="logistics block">
      <el-alert class="logistics-header alert" :title="$t('通用.物流信息')" type="success" :closable="false"></el-alert>
      <div class="logistic-info">
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.收货人')}}:</div>
            <div class="value">{{orderInfo.receiver}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.联系电话')}}:</div>
            <div class="value">{{orderInfo.receiverPhone}}</div>
          </div>
        </div>
        <div class="flex-wrap">
          <div class="info-group">
            <div class="key">{{$t('订单管理.详细地址')}}:</div>
            <div class="value">{{`${orderInfo.address}`}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.邮编')}}:</div>
            <div class="value">{{orderInfo.code}}</div>
          </div>
          <div class="info-group">
            <div class="key">{{$t('订单管理.门牌号')}}:</div>
            <div class="value">{{orderInfo.gate}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="refund block">
      <el-alert class="logistics-header alert" :title="$t('订单管理.汇款信息')" type="success" :closable="false"></el-alert>
      <div class="flex-wrap">
        <div class="info-group">
          <div class="key">{{$t('订单管理.退款总额')}}:</div>
          <div class="value">{{orderInfo.amount}}</div>
        </div>
        <div class="info-group">
          <div class="key">{{$t('订单管理.手续费')}}:</div>
          <div class="value">{{orderInfo.fee}}</div>
        </div>
      </div>
      <div class="flex-wrap">
        <div class="info-group">
          <div class="key">{{$t('订单管理.退款卡号')}}:</div>
          <div class="value">{{orderInfo.cardNo}}</div>
        </div>
        <div class="info-group">
          <div class="key">{{$t('订单管理.退款银行')}}:</div>
          <div class="value">{{orderInfo.bankName}}</div>
        </div>
        <div class="info-group">
          <div class="key">{{$t('订单管理.收款人')}}:</div>
          <div class="value">{{orderInfo.bankAccName}}</div>
        </div>
        <div class="info-group">
          <div class="key">{{$t('订单管理.联系电话')}}:</div>
          <div class="value">{{orderInfo.phone}}</div>
        </div>
      </div>
      <div class="input-group">
        <div class="label">{{$t('订单管理.汇款编号')}}：</div>
        <el-input
            style="width:10rem;"
            :placeholder="$t('订单管理.汇款编号')"
            v-model="refundForm.refNo"
            clearable>
        </el-input>
        <div class="label ml">{{$t('订单管理.汇款收据')}}：</div>
        <el-upload
        class="avatar-uploader"
        action="/api/img/upload"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload.bind(null,'refImg')">
            <img v-if="refImg.src" :src="refImg.src" class="avatar">
            <span v-else class="el-icon-plus avatar-uploader-icon txt"></span>
        </el-upload>
      </div>
      <div class="footer">
        <el-button class="footer-btn" @click="submitRefund" type="success">{{$t('通用.保存')}}</el-button>
      </div>
    </div>
    
  </section>
</template>

<script>
import axios from 'axios'
import CancelList from '~/components/pages/order/CancelList'
export default {
  layout: 'withNav',
  components: {
    CancelList
  },
  data() {
    return {
      orderInfo: {},
      refundForm: {},
      refImg:{
        key: '',
        src: ''
      }
    }
  },
  computed: {
    oid() {
      return this.$route.params.id || 1
    },
    showCancelOrder() {
      return [1,2,3].includes(this.orderInfo.status)
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getOrderInfo()
    },
    async getOrderInfo() {
      let {data} = await axios.get(`/api/json/maiev/admin/order/refund/detail?oid=${this.oid}`)
      if(data.success) {
        this.orderInfo = data.data
      } else {
        this.$message.error(data.errMsg)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    async beforeAvatarUpload(type,file) {
        let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=4&cnt=1`)
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
    async cancelOrder({lid = null,qty = null}) {
      this.$prompt(this.$t('订单管理.请输入取消原因'), this.$t('订单管理.取消订单'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText: this.$t('通用.取消'),
      }).then(async ({ value }) => {
        let param = {
          oidNo: this.oid, 
          reason: value
        }
        // ----------------------  取消一个sku额外参数  ---------------------
        lid !== null ? param.lid = lid : null
        qty !== null ? param.qty = qty : null
        let {data} = await axios.post(`/api/json/maiev/admin/order/cancel`,param)
        if(data.success) {
          this.$message.success(this.$t('通用.操作成功'))
          this.initPage()
        } else {
          this.$message.error(data.errMsg)
        }
      }).catch(() => {
        return      
      });
    },
    deliverFailed() {
      // TODO: 已发货 ——> 发货失败
    },
    editAddress() {
      // TODO: 发货失败 ——> 修改地址
    },
    refund() {
      this.showRefund = true
    },
    async submitRefund() {
      // ----------------------  校验  ---------------------
      let {refNo} = this.refundForm
      , {key} = this.refImg
      if(!refNo || !key) {
        return this.$message.error(this.$t('订单管理.请完善退款信息'))
      }
      let param = {
        refNo,
        imgUrl: key,
        id: this.oid
      }
      let {data} = await axios.post(`/api/json/maiev/admin/order/refund/submit`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.initPage()
        this.resetForm()
      } else {
        this.$message.error(data.errMsg)
      }
    },
    resetForm() {
      this.resetForm = {}
      this.refImg = {
        key: '',
        src: ''
      }
    },
    getProp(prop) {
      return Object.entries(prop).map(item => {
        return `${item[0]}:${item[1]}`
      }).reduce((cal,i,idx) => idx === 0 ? cal + i : cal + ',' + i,'')
    },
    cancelSku(row) {
      if(!row.cancelQty && row.cancelQty !== 0) {
        row.cancelQty = row.qty
      } else if(row.cancelQty <= 0 || row.cancelQty > row.qty) {
        return this.$message.error(this.$t('订单管理.取消个数不超过购买数量'))
      } 
      this.cancelOrder({lid: row.id, qty: Number(row.cancelQty)})
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  .basic,.logistic{
    &-info{
      padding: 2rem 0;
      align-items: center;

      .edit-btn{
        height: 2rem;
      }
    }
  }
  .refund{
    .input-group {
      background-color: #eee;
      .label{
        min-width: 0;
      }
    }
  }
  .footer{
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    &-btn{
      margin-left: 1rem;
    }
  }
}
</style><style lang="scss">
.avatar-uploader .el-upload {
      height: 10rem;
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
      width: 10rem;
      height: 10rem;
      line-height: 10rem;
      text-align: center;
  }
  .avatar {
      width: 10rem;
      height: 10rem;
      display: block;
  }
</style>