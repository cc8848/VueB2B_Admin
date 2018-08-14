import Vue from 'vue'

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

function formatDateHelp(date, fmt = 'yyyy-MM-dd/hh:mm') {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

const filterObj = {
    priceFormat(price,separator = '.',splitLength = 3) {
        return String(price).split('').reverse().reduce((result, letter, index) => (
            result.unshift(letter, index > 0 && index % splitLength === 0 ? separator : void 0), result
        ), []).join('')
    },
    pointDeduct(point) {
        return Number(point)/100
    },
    formatDate(time,fmt) {
      let date = new Date(time);
      return formatDateHelp(date,fmt);
    },
    formatOrderState(state) {
      let stateMap = {
        0: '新订单',
        1: this.i18n.t('订单管理.待发货'),
        2: this.i18n.t('订单管理.已发货'),
        3: this.i18n.t('订单管理.已签收'),
        4: this.i18n.t('订单管理.已取消'),
        5: this.i18n.t('订单管理.发货失败'),
        6: this.i18n.t('订单管理.待付款'),
      }
      return stateMap[state]
    },
    formatCodState(state) {
      let stateMap = {
        '1': this.i18n.t('订单管理.等待收款'),
        '2': this.i18n.t('订单管理.已收款')
      }
      return stateMap[state]
    },
    formatCountry(state) {
      let stateMap = {
        0: this.i18n.t('商户管理.全部'),
        1: this.i18n.t('商户管理.印尼'),
        2: this.i18n.t('商户管理.马来'),
        3: this.i18n.t('商户管理.菲律宾'),
        4: this.i18n.t('商户管理.越南')
      }
      return stateMap[state]
    },
    formatMerchantState(state) {
      let stateMap = {
        0: this.i18n.t('商户管理.待审核'),
        1: this.i18n.t('商户管理.审核通过'),
        2: this.i18n.t('商户管理.审核驳回')
      }
      return stateMap[state]
    },
    formatCaptcha(state) {
      let stateMap = {
        '1': this.i18n.t('通用.注册'),
        '2': this.i18n.t('权限管理.重置密码')
      }
      return stateMap[state]
    },
    formatSex(state) {
      let stateMap = {
        '0': this.i18n.t('通用.男'),
        '1': this.i18n.t('通用.女')
      }
      return stateMap[state]
    },
    formatAdminStatus(state) {
      let stateMap = {
        '0': this.i18n.t('通用.有效'),
        '1': this.i18n.t('通用.无效')
      }
      return stateMap[state]
    },
    formatAdminRole(state) {
      let stateMap = {
        '1': this.i18n.t('权限管理.超级管理员'),
        '2': this.i18n.t('权限管理.运营'),
        '3': this.i18n.t('权限管理.运营总监')
      }
      return stateMap[state]
    },
    formatRefundState(state) {
      let stateMap = {
        '1': this.i18n.t('订单管理.未处理'),
        '100': this.i18n.t('订单管理.已退款'),
        '101': this.i18n.t('订单管理.拒绝退款'),
        '102': this.i18n.t('订单管理.退款失败')
      }
      return stateMap[state]
    },
    formatAssignedOrderType(type){
      let typeMap = {
        '1': this.i18n.t('物流管理.普通订单'),
        '2': this.i18n.t('物流管理.COD订单')
      }
      return typeMap[type];
    },
    formatProductStatus(status){
      let statusMap ={
        1: this.i18n.t('活动管理.在售'),
        2: this.i18n.t('活动管理.下架'),
        3: this.i18n.t('活动管理.售罄')
      };
      return statusMap[status];
    },
    formatBool(bool){
      return bool?this.i18n.t('通用.是'):this.i18n.t('通用.否')
    },
    formatStatName(state) {
      let stateMap = {
        'totalCnt': this.i18n.t('统计.订单总量'),
        'codCnt': this.i18n.t('统计.cod订单量'),
        'cancelCnt': this.i18n.t('统计.取消订单量'),
        'refundCnt': this.i18n.t('统计.退款订单量'),
        'successCnt': this.i18n.t('统计.交易成功订单量'),

        'userCnt': this.i18n.t('统计.用户量')
      }
      return stateMap[state]
    },
    formatCouponOfferScope(offerScope){
      let map = {
        1: this.i18n.t('优惠券.全部用户'),
        2: this.i18n.t('优惠券.指定用户'),
        3: this.i18n.t('优惠券.新注册用户'),
        4: this.i18n.t('优惠券.老用户'),
        5: this.i18n.t('优惠券.完成首单用户')
      }
      return map[offerScope];
    },
    formatCouponStatus(status){
      let map = {
        1: this.i18n.t('优惠券.未生效'),
        2: this.i18n.t('优惠券.已生效'),
        3: this.i18n.t('优惠券.已过期'),
        4: this.i18n.t('优惠券.已删除')
      }
      return map[status];
    },
    formatCouponType(type){
      let map = {
        1: this.i18n.t('优惠券.满减'),
        2: this.i18n.t('优惠券.满折')
      }
      return map[type];
    },
    formatCouponUseScope(useScope){
      let map = {
        1: this.i18n.t('优惠券.全场商品'), 
        2: this.i18n.t('优惠券.指定品类'),
        3: this.i18n.t('优惠券.指定商品')
      }
      return map[useScope]
    },
    formatCouponLimitation(limitation){
      let map = {
        'Payment limitation': this.i18n.t('优惠券.支付限制')
      }
      return map[limitation];
    },
    formatCouponLimitationOption(limit){
      let map = {
        0: this.i18n.t('优惠券.全部可用'),
        1: this.i18n.t('优惠券.非COD可用')
      }
      return map[limit]
    },
    formatBDCodeStatus(status){
      let map = {
        0: this.i18n.t('优惠券.已生效'),
        1: this.i18n.t('优惠券.已删除')
      }
      return map[status];
    },
    formatDBQueryFunc(func){
      let map = {
        1: this.i18n.t('报表.普通')
      }
      return map[func];
    }
}

export default ({app}) => {
  Object.keys(filterObj).forEach(key => {
    Vue.filter(key, filterObj[key].bind(app))
  })
}
