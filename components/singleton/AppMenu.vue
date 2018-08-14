<template>
  <el-menu
    router="router"
    default-active="0"
    class="el-menu-vertical"
    :unique-opened="true"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="0" route="/">
      <i class="el-icon-menu"></i>
      <span slot="title">{{$t('菜单.概况')}}</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.商户管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1" route="/merchant/merchantList">{{$t('菜单.商户列表')}}</el-menu-item>
        <el-menu-item index="1-2" route="/merchant/newMerchant">{{$t('菜单.新增商户')}}</el-menu-item>
        <!-- <el-menu-item index="1-3">{{$t('菜单.商户交易历史')}}</el-menu-item> -->
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.用户管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="2-1" route="/user/userList">{{$t('菜单.用户列表')}}</el-menu-item>
        <el-menu-item index="2-2" route="/user/msgVeriList">{{$t('菜单.短信验证')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.商品管理')}}</span>
      </template>
      <el-menu-item-group>
        <!-- <el-menu-item index="3-1" route="/product/applyList">{{$t('菜单.申请列表')}}</el-menu-item> -->
        <el-menu-item index="3-2" route="/product/cateList">{{$t('菜单.类目')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.订单管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="4-1" route="/order/orderList">{{$t('菜单.订单列表')}}</el-menu-item>
        <el-menu-item index="4-2" route="/order/refundList">{{$t('菜单.退款列表')}}</el-menu-item>
        <el-menu-item index="4-3" route="/order/codList">{{$t('菜单.COD订单')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.活动管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="5-1" route="/promo/promoList">{{$t('菜单.活动列表')}}</el-menu-item>
        <!-- <el-menu-item index="5-2" route="/order/refundList">{{$t('菜单.退款列表')}}</el-menu-item> -->
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="6">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.物流管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="6-1" route="/logistics/unAssignedList">{{$t('菜单.待分配订单')}}</el-menu-item>
        <el-menu-item index="6-2" route="/logistics/assignedList">{{$t('菜单.已分配订单')}}</el-menu-item>
        <el-menu-item index="6-3" route="/logistics/courier/courierList">{{$t('菜单.快递员管理')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="7">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.权限管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="7-1" route="/admin/adminList">{{$t('菜单.管理员列表')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="8">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.运营管理')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="8-1" route="/operation/config">{{$t('菜单.运营设置')}}</el-menu-item>
        <el-menu-item index="8-2" route="/operation/push/pushList">{{$t('菜单.推送列表')}}</el-menu-item>
        <!-- <el-menu-item index="8-2" route="/operation/push/newPush">{{$t('菜单.新增推送')}}</el-menu-item> -->
        <el-menu-item index="8-3" route="/operation/BD/BDCodeList">{{$t('菜单.推荐码')}}</el-menu-item>
        <el-menu-item index="8-4" route="/operation/BD/BDList">{{$t('菜单.佣金')}}</el-menu-item>
        <el-menu-item index="8-5" route="/operation/coupon/couponList">{{$t('菜单.优惠券')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="9">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{$t('菜单.数据分析')}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="9-1" route="/db/admin/dbQuery">{{$t('菜单[\'数据库查询(管理员)\']')}}</el-menu-item>
        <el-menu-item index="9-2" route="/db/dbQuery">{{$t('菜单.数据库查询')}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu> 
</template>
<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key,keyPath) {
        this.$store.commit('resetCachePage',1)
        console.log(key,keyPath)
      }
    }
  }
</script>
<style scope>
    .el-menu-vertical{
        height: 100%;
        overflow: auto;
    }
</style>

