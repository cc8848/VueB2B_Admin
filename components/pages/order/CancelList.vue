<template>
  <!-- 基础信息 -->
  <div class="basic block">
    <el-alert class="basic-header alert" :title="$t('订单管理.取消订单')" type="success" :closable="false"></el-alert>
    <div class="basic-table">
      <el-table
      :data="cancelList"
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
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cancelList: {
        required: true,
        default: () => []
      }
    },
    data() {
      return {

      }
    },
    methods: {
      getProp(prop) {
        return Object.entries(prop).map(item => {
          return `${item[0]}:${item[1]}`
        }).reduce((cal,i,idx) => idx === 0 ? cal + i : cal + ',' + i,'')
      },
    }
  }
</script>

<style scoped>

</style>