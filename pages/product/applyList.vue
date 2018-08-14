<template>
  <section class="container">
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="SKU ID"
      >
    </el-table-column>
    <el-table-column
      prop="vendorId.vendorName"
      label="商户名称"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="产品名称"
      >
    </el-table-column>
    <el-table-column
      prop="updatedAt"
      label="更新时间"
     >
    </el-table-column>
  
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="agreeItem(scope.row)" type="text" size="small">通过</el-button>
        <el-button @click="rejectItem(scope.row)" type="text" size="small">拒绝</el-button>
      </template>
    </el-table-column>
  </el-table>
  </section>
</template>

<script>
import axios from 'axios'
import { mapGetters,mapState } from 'vuex'
export default {
  layout: 'withNav',
  data:function() {
    return {
      tableData: [
        
      ],
    }
  },
  async created() {
    this.initPage()
  },
  computed: {
    ...mapState({
      token: state => state.token
    })
  },
  methods: {
    async initPage() {
      try {
        let [itemListRes] = await Promise.all([
          axios.get('/api/item/reviewlist')
        ])

        if(!itemListRes.data.success) {
          if(itemListRes.data.err === 'Please login') {
            this.$store.commit('logout',this.$router)
          }
        } else {
          this.tableData = itemListRes.data.data
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async agreeItem(row) {
      try {
        let item = row
        let res = await axios.patch(`/api/item/${row.id}`,{passStatus:'passed'})
        if(!res.data.success) {
          if(res.data.err === 'Please login') {
            this.$store.commit('logout',this.$router)
          }
        } else {
          this.$message.success('操作成功！')
          this.initPage()
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async rejectItem(row) {
      try {
        let item = row
        let res = await axios.patch(`/api/item/${row.id}`,{passStatus:'reject'})
        if(!res.data.success) {
          if(res.data.err === 'Please login') {
            this.$store.commit('logout',this.$router)
          }
        } else {
          this.$message.success('操作成功！')
          this.initPage()
        }
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>