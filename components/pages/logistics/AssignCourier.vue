<template>
  <el-dialog
    :title="$t('物流管理.分配快递员')"
    :visible="visible"
    @close="close">
    <el-form ref="assignForm" :model="assignForm" :rules="rules">
      <el-form-item prop="courier">
        <el-select
          v-model="assignForm.courier"
          value-key="courierName"
          :loading="loading"
          filterable
          remote
          :remote-method="querySelectList"
          class="courier-select">
          <el-option
            v-for="item in options"
            :key="item.value.courierId"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="order">
      <div class="title">{{$t('物流管理.订单信息')}}</div>
      <data-table :tableData="orderData" :tableHeader="orderHeader"></data-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t('通用.取消')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('通用.确定')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import axios from 'axios';
import DataTable from '~/components/global/DataTable';
const tableHeader = [
  {prop: 'id', label: '物流管理.订单ID'},
  {prop: 'skuQty', label: '物流管理.SKU数量'},
  {prop: 'receiver', label: '物流管理.收货人'},
  {prop: 'phone', label: '物流管理.联系电话'},
  {prop: 'address', label: '物流管理.收货地址'},
  {prop: 'shopName', label:'物流管理.商家名称'},
  {prop: 'shopAddr', label: '物流管理.商户地址'}
]
export default {
  components: {
    DataTable
  },
  props:{
    'visible': Boolean,
    'orderHeader': {
      type: Array,
      default: function(){
        return tableHeader;
      }
    },
    'orderData': {
      type: Array,
    }
  },
  data: function(){
    return {
      assignForm: {
        courier: null
      },
      rules: {
        courier: [
          {required: true, message: this.$t('物流管理.请输入快递员名称'), trigger: 'blur'}
        ]
      },
      options: [],
      loading: false
    }
  },
  watch: {
    visible: function(){
      if(this.visible === false){
        this.reset();
      }
    }
  },
  created: async function(){
    await this.querySelectList('', 100);
  },
  methods: {
    querySelectList: async function(query='', count = 20){
      this.loading = true;
      let {data} = await axios.post(`/api/json/zuljin/admin/courier/querySelectList`,{condition: query, count: count}, {formData: true});
      if(data.success){
        this.options = data.data.list.map(v=>{
          if(query===''){
            return {
              value: v,
              label: `${v.courierName}`
            }
          }else{
            return {
              value: v,
              // label: `${v.courierId}: ${v.courierName}`
              label: `${v.courierName}`
            }
          }
        })
      }else{
        this.$message.error(data.errMsg);
      }
      this.loading = false;
    },
    async reset(){
      this.assignForm = {
        courier: null
      }
      this.$refs.assignForm.clearValidate();
      this.options = [];
      await this.querySelectList('', 100);
    },
    close(){
      this.$emit('close');
    },
    submit(){
      this.$refs.assignForm.validate((valid)=>{
        if(valid){
          this.$emit('submit', this.assignForm);
        }
      })
    }
  }
}
</script>
<style lang="scss">
.courier-select{
  min-width: 300px;
}
</style>


