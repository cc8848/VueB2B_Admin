<template>
  <section class="container">
    <div class="header">
      <div class="header-name">{{$t('订单管理.订单详情')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <!-- 基础信息 -->
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
              <span>{{scope.row.originalPrice | priceFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="settlementPrice"
            :label="$t('订单管理.销售价格')"
            >
            <template slot-scope="scope">
              <span>{{scope.row.payPrice | priceFormat}}</span>
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
            <div class="value">{{`${orderInfo.province} ${orderInfo.city} ${orderInfo.dist} ${orderInfo.address}`}}</div>
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
    <div class="refund" v-if="showRefund">
      <div class="input-group">
        <div class="label">{{$t('订单管理.收款人')}}：</div>
        <el-input
            style="width:10rem;"
            :placeholder="$t('订单管理.收款人')"
            v-model="refundForm.bankAccName"
            clearable>
        </el-input>
        <div class="label ml">{{$t('订单管理.收款银行')}}：</div>
        <el-input
            style="width:10rem;"
            :placeholder="$t('订单管理.收款银行')"
            v-model="refundForm.bankName"
            clearable>
        </el-input>
        <div class="label ml">{{$t('订单管理.联系电话')}}：</div>
        <el-input
            style="width:10rem;"
            :placeholder="$t('订单管理.联系电话')"
            v-model="refundForm.phone"
            clearable>
        </el-input>
        <div class="label ml">{{$t('订单管理.银行账号')}}：</div>
        <el-input
            style="width:10rem;"
            :placeholder="$t('订单管理.银行账号')"
            v-model="refundForm.cardNo"
            clearable>
        </el-input>
      </div>
    </div>
    <div class="footer" v-if="canEdit">
      <el-button v-if="showCancelOrder" class="footer-btn" @click="cancelOrder" type="success">{{$t('订单管理.取消订单')}}</el-button>
      <el-button v-if="orderInfo.status === 2" class="footer-btn" @click="deliverFailed" type="success">{{$t('订单管理.发货失败')}}</el-button>
      <el-button v-if="orderInfo.status === 5" class="footer-btn" @click="editAddress" type="success">{{$t('订单管理.修改收货地址')}}</el-button>
      <el-button v-if="orderInfo.status === 4 && showRefund === false && !orderInfo.isCod && !orderInfo.refundStatus" class="footer-btn" @click="refund" type="success">{{$t('订单管理.退款')}}</el-button>
      <el-button v-if="orderInfo.status === 4 && showRefund === true" class="footer-btn" @click="submitRefund" type="success">{{$t('通用.保存')}}</el-button>
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
      showRefund: false,
      refundForm: {},
    }
  },
  computed: {
    canEdit() {
      return this.$route.query.canEdit === 'false' ? false : true
    },
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
      let {data} = await axios.get(`/api/json/maiev/admin/order/detail?id=${this.oid}`)
      if(data.success) {
        this.orderInfo = data.data
      } else {
        this.$message.error(data.errMsg)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    editBasic() {

    },
    editLogistic() {

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
      let {bankAccName,bankName,phone,cardNo} = this.refundForm
      if(!bankAccName || !bankName || !phone || !cardNo) {
        return this.$message.error('请完善退款信息')
      }
      let param = {
        ...this.refundForm,
        oid: this.oid
      }
      let {data} = await axios.post(`/api/json/maiev/admin/order/refund/edit`,param,{formData:true})
      if(data.success) {
        this.$message.success(this.$t('通用.操作成功'))
        this.$router.push('/order/refundList')
      } else {
        this.$message.error(data.errMsg)
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
</style>
