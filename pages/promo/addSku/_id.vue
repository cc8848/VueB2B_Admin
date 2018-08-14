<template>
  <section class="container promo-add-sku" v-loading="loading">
    <div class="header">
      <div class="header-name">{{$t('活动管理.添加商品')}}</div>
      <el-button size="small" class="header-back" @click="goBack" type="success">{{$t('通用.返回')}}</el-button>
    </div>
    <el-row class="search-wrap">
      <el-col :span="12">
        <span class="label">{{$t('活动管理.类目')}}</span>
        <el-cascader
          v-model="selectedCatalog"
          :options="catalogOptions"
          @change="handleCatalogChange"
        ></el-cascader>
      </el-col>
      <el-col :span="12">
        <search-bar placeholder="" @search="handleSearch"></search-bar>
      </el-col>
    </el-row>
    <div class="product-list">
      <div class="header">
        <div>
          <span class="title">{{$t('活动管理.商品列表')}}</span>
          <el-button @click="addSelected(addSelectionMap)">{{$t('活动管理.添加')}}</el-button>
        </div>
      </div>
      <el-table
        class="spu-list"
        ref="spuList"
        :data="spuList"
        height="275px"
        @selection-change="handleAddSpuSelection"
        @expand-change="handleAddSpuExpand"
      >
        <el-table-column
          type="selection"
          :width="styles.selectionWidth"
          :selectable="handleSpuSelectable"
          >
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              class="sku-list"
              row-class-name="sku-list"
              header-cell-class-name="sku-list"
              :ref="'skuList'+scope.row.spuId"
              :data="scope.row.skuList"
              @selection-change="(selection)=>{handleAddSkuSelection(selection, scope.row)}"
              >
              <el-table-column
                type="selection"
                :width="styles.selectionWidth"
                :selectable="handleSkuSelectable"
                >
              </el-table-column>
              <el-table-column  v-for="(header,idx) in skuHeader" :key="idx" v-bind="header" :label="$t(header.label)"></el-table-column>
              <el-table-column :label="$t('通用.操作')">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="!scope.row.available"
                    @click="addSku(scope.row)"
                  >
                    {{$t('活动管理.添加')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column  v-for="(header,idx) in spuHeader" :key="idx" v-bind="header"  :label="$t(header.label)"></el-table-column>
        <el-table-column :label="$t('通用.操作')">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.available"
              @click="addSpu(scope.row)"
            >
              {{$t('活动管理.添加')}}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="expandSpu(scope.row)"
            >
              {{$t('活动管理.查看sku')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          :disabled="!couldSearch"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div class="product-list">
      <div class="header">
        <div>
          <span class="title">{{$t('活动管理.已选商品列表')}}</span>
          <el-button @click="()=>deleteSelected(deleteSelection)">
            {{$t('通用.删除')}}
          </el-button>
        </div>
        <el-button @click="uniFiedPrice">{{$t('活动管理.统一定价')}}</el-button>
      </div>
      <data-table
        :tableData="selectedProductListData"
        :tableHeader="selectedProductListHeader"
         height="275px"
        :selection="true"
        @selection-change="handleDeleteSelection">
      </data-table>
    </div>
    <div class="footer-wrap">
      <el-button @click="goBack">{{$t('通用.取消')}}</el-button>
      <el-button @click="submit">{{$t('通用.确定')}}</el-button>
    </div>
  </section>
</template>
<script>
import DataTable from '~/components/global/DataTable';
import SearchBar from '~/components/global/SearchBar';
import axios from 'axios';
const spuHeader = [
  {prop: 'spuId', label: '活动管理.SPUID', width: 64,},
  {prop: 'spuName', label: '活动管理.SPU名称'},
  {prop: 'merchantName', label: '活动管理.商户'},
  {prop: 'isSpuInPromoStr', label: '活动管理.是否参加活动'},
];
const skuHeader = [
  {prop: 'skuId', label: '活动管理.SKUID', width: 66,},
  {prop: 'skuName', label: '活动管理.SKU名称'},
  {prop: 'price', label: '活动管理.价格'},
  {prop: 'isSkuInPromoStr', label: '活动管理.是否参加活动'},
  {prop: 'statusStr', label: '活动管理.状态'},
  {prop: 'promoIds', label: '活动管理.活动ID'},
]
const selectedHeader = [
  {prop: 'skuId', label: '活动管理.SKUID'},
  {prop: 'merchantName', label: '活动管理.商户'},
  {prop: 'skuName', label: '活动管理.商品名称'},
  {prop: 'price', label: '活动管理.供应价格'},
  {prop: 'promoPrice', label: '活动管理.活动价格', inputNumber: {controls: false, size: 'small', integer: 'ceil'}},
];
export default {
  layout: 'withNav',
  components: {
    DataTable,
    SearchBar
  },
  data: function(){
    return {
      loading: true,
      isSearch: false,
      catalog: [],
      selectedCatalog: [],
      keyword: '',
      count: 10,
      currentPage: 2,
      statusMap: {
        1: this.$t('活动管理.在售'), 2: this.$t('活动管理.下架'), 3: this.$t('活动管理.售罄')
      },
      productList: [],
      spuHeader: [...spuHeader],
      skuHeader: [...skuHeader],
      styles: {
        operateWidth: 120,
        selectionWidth: 45,
      },
      addSelectionMap: {},
      deleteSelection: [],
      selectedProductList: [],
      selectedProductListHeader: [
        ...selectedHeader,
        {
          prop: 'operate',
          isOperate: true,
          label: '通用.操作',
          operate: [
            {
              text: '通用.删除',
              onClick: (row)=>{
                this.deleteSelected([row]);
              }
            },
          ]
        }
      ],
    }
  },
  computed:{
    catalogOptions: function(){
      let format = function(value){
        let option = Object.assign({},value,{label: value.name, value: value.id});
        if(Array.isArray(option.children)){
          option.children = option.children.map(format);
        }
        return option;
      }
      return this.catalog.map(format)
    },
    offset: function(){
      return this.count * (this.currentPage - 1);
    },
    catalogId: function(){
      let catalogId = this.selectedCatalog[this.selectedCatalog.length - 1];
      return catalogId;
    },
    promoId: function(){
      return this.$route.params.id;
    },
    couldSearch: function(){
      return typeof this.catalogId === 'number' || this.keyword !== '';
    },
    spuList: function(){
      return this.productList.map((spu)=>{
        let {skuList, ...other} = spu;
        let spuAvailable = false;
        let isSpuInPromo = false;
        let mySkuList =  skuList.map(sku=>{
          let promoIds = [];
          let isSkuInPromo = false;
          if(Array.isArray(sku.promoList)){
            promoIds = sku.promoList.map(promo=>promo.promoId);
          }
          if(promoIds.length>0){
            isSpuInPromo = true;
            isSkuInPromo = true;
          }
          if(sku.available){
            spuAvailable = true;
          }
          return {
            ...other,
            ...sku,
            promoIds: promoIds, 
            isSkuInPromo: isSkuInPromo,
            isSkuInPromoStr: isSkuInPromo?this.$t('通用.是'):this.$t('通用.否'),
            statusStr: this.statusMap[sku.status]
          }
        });
        return {
          ...other,
          skuList:mySkuList,
          available: spuAvailable,
          isSpuInPromo: isSpuInPromo,
          isSpuInPromoStr: isSpuInPromo?this.$t('通用.是'):this.$t('通用.否')
        }
      })
    },
    selectedProductListData: function(){
      let step = 1;
      return this.selectedProductList.map(function(value){
        let {operate, ...other} = value;
        return {
          ...other, 
          promoPrice: Math.ceil(value.promoPrice || value.price),
          promoPriceMin: step,
          promoPriceMax: value.price - step
        }
      })
    }
  },
  watch: {
    addSelectionMap: {
      handler: function(newVal, oldVal){
        let val = Object.assign({}, oldVal, newVal);
        for(let [spuId, skuList] of Object.entries(val)){
          let oldSkuList = oldVal[spuId] || [];
          let newSkuList = newVal[spuId] || [];
          let availableSkuList = [];
          let spu = this.spuList.find(v=>v.spuId===Number(spuId));
          if(spu && Array.isArray(spu.skuList)){
            availableSkuList = spu.skuList.filter(v=>v.available);
          }
          // console.log({
          //   spuId,
          //   oldSkuList,
          //   newSkuList,
          //   availableSkuList
          // });
          //根据选中的skuList确定spu是否被选中
          this.$refs.spuList.toggleRowSelection(spu, newSkuList.length===availableSkuList.length);
          let maxLength = availableSkuList.length;
          //当从全部选中到取消勾选任意一项后，使由于上面的spu勾选取消导致的skuList勾选不做处理
          if(newSkuList.length === maxLength - 1 && oldSkuList.length === maxLength){
            setTimeout(()=>{
              this.addSelectionMap[spuId] = newSkuList;
            },0)
          }
          this.$nextTick(function(){
            for(let sku of Object.values(availableSkuList)){
              if(this.$refs['skuList'+spuId]){
                //确定sku是否被选中
                this.$refs['skuList'+spuId].toggleRowSelection(sku, newSkuList.includes(sku));
              }
            }
          });
        }
      },
      deep: true
    }
  },
  async created(){
    await this.getCatalog();
  },
  methods: {
    async getCatalog(){
      this.loading = true;
      try{
        let {data} = await axios.get(`/api/json/velen/public/catalog`);
        if(data.success){
          this.catalog = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
      this.loading = false;
    },
    async requestSecProductList(){
      this.loading = true;
      let query = `promoId=${this.promoId}&offset=${this.offset}&count=${this.count}`;
      if(typeof this.catalogId === 'number'&&this.isSearch === false){
        query += `&catalogId=${this.catalogId}`;
      }
      if(this.keyword&&this.isSearch === true){
        query += `&keyword=${this.keyword}`;
      }
      try{
        let {data} = await axios.get(`/api/json/guldan/admin/promo/spec/product/list?${query}`);
        if(data.success){
          this.productList = data.data;
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
      this.loading = false;
    },
    async requestAddPromoSku(){
      let params = {
        promoId: this.promoId,
        skuList: this.selectedProductListData.map(function(value){
          return {
            "price": value.price,
            "promoPrice": value.promoPrice,
            "settlementPrice": value.price,
            "skuId": value.skuId,
            "status": 0
          }
        })
      }
      this.loading = true;
      try {
        let {data} = await axios.post(`/api/json/guldan/admin/promo/sku/add`, params);
        if(data.success){
          this.$message.success(this.$t('通用.添加成功'));
          this.goBack();
        }else{
          this.$message.error(data.errMsg);
        }
      }catch(error){
        this.$message.error(error.message);
      }
      this.loading = false;
    },
    reset(){
      this.currentPage = 1;
    },
    async handleCatalogChange(){
      this.isSearch = false;
      await this.search();
    },
    async handleSearch(key){
      //点击搜索是搜索所有类目下的商品
      this.isSearch = true;
      this.keyword = key;
      await this.search();
    },
    async search(shouldReset = true){
      if(this.couldSearch){
        if(shouldReset){
          this.reset();
        }
        await this.requestSecProductList();
        //更新数据后滚动到最上方
        this.$nextTick(function(){
          let spuListBody = this.$refs.spuList.$el.querySelector('.el-table__body-wrapper');
          spuListBody.scrollTop = 0;
        })
      }else{
        this.$message.error(this.$t('活动管理.请选择类目或输入关键字'));
      }
    },
    handleCurrentChange(){
      this.search(false);
    },
    handleAddSpuExpand(row, expandedRows){
      this.addSelectionMap = Object.assign({}, this.addSelectionMap);
    },
    addSpu(spu){
      this.addSelected({[spu.spuId]: spu.skuList});
    },
    expandSpu(spu){
      this.$refs.spuList.toggleRowExpansion(spu);
    },
    addSku(sku,spu){
      this.addSelected({[sku.spuId]: [sku]});
    },
    handleSpuSelectable(row, index){
      return row.available;
    },
    handleSkuSelectable(row, index){
      return row.available;
    },
    handleAddSpuSelection(val){
      let addSelectionMap = {};
      val.map(spu=>{
        if(spu&&Array.isArray(spu.skuList)){
          addSelectionMap[spu.spuId] = spu.skuList.filter(v=>v.available);
        }
      })
      this.addSelectionMap = Object.assign({}, addSelectionMap);
    },
    handleAddSkuSelection(skuList, spu){
      this.addSelectionMap = Object.assign({}, this.addSelectionMap, {[spu.spuId]: skuList});
    },
    addSelected(selected){
      console.log(selected);
      let selectedProductList = [...this.selectedProductList];
      //记录map，方便去重
      let map = new Map();
      for(let sku of Object.values(selectedProductList)){
        if(!map.has(sku.skuId)){
          map.set(sku.skuId, true);
        }
      }
      for(let skuList of Object.values(selected)){
        for(let sku of skuList){
          //不再已选列表并且可添加
          if(!map.has(sku.skuId)&&sku.available){
            selectedProductList.push(sku);
            map.set(sku.skuId, true);
          }
        }
      }
      this.selectedProductList = selectedProductList;
      this.addSelectionMap = {};
    },
    handleDeleteSelection(val){
      this.deleteSelection = val;
    },
    confirmDelete(resolve, reject=()=>{}){
      this.$confirm(this.$t('通用[\'此操作不可恢复，确认删除吗？\']'), this.$t('通用.提示'), {
        confirmButtonText: this.$t('通用.确定'),
        cancelButtonText:  this.$t('通用.取消'),
        type: 'warning'
      }).then(resolve)
      .catch(reject)
    },
    deleteSelected(value){
      if(Array.isArray(value)&&value.length>0){
        this.confirmDelete(()=>{
          let deleteIds = value.map(v=>v.skuId);
          this.selectedProductList = this.selectedProductList.filter(v=>!deleteIds.includes(v.skuId));
        })
      }
    },
    async submit(){
      await this.requestAddPromoSku();
    },
    goBack(){
      this.$router.go(-1);
    },
    async uniFiedPrice(){
      let {value} = await this.$prompt(this.$t('活动管理.活动商品统一折扣')+': ', this.$t('活动管理.提示'), {
        confirmButtonText: this.$t('通用.确认'),
        cancelButtonText: this.$t('通用.取消'),
        inputPattern: /^[1-9][0-9]?%$/,
        inputErrorMessage: this.$t('活动管理[\'折扣格式不正确，正式格式如50%\']')
      });
      let discount = Number(value.replace('%','')) / 100;
      this.selectedProductList = this.selectedProductList.map(function(value){
        return {
          ...value,
          promoPrice: Math.ceil(discount * value.price)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.promo-add-sku{
  .search-wrap{
    .label{
      margin-right: 1rem;
    }
  }

  .product-list{
    .header{
      padding: 1rem 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        margin-right: 1rem;
      }
    }
    .spu-list{
      margin: 1rem 0;
      .el-table__expanded-cell[class*=cell]{
        padding: 0;
      }
      // .el-table__header-wrapper{
      //   .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      //     background-color: #fff;
      //     border-color: #dcdfe6;
      //   }
      // }
    }
    .sku-list{
      $custom-color: oldlace;
      background: $custom-color;
      &:hover>td{
        // background: mix(#f5f7fa, $custom-color)
        background: $custom-color;
      }

      // .el-table__header-wrapper{
      //   .el-checkbox{
      //     display: none;
      //   }
      // }
    }
    .pagination{
      // padding: 0 1rem;
      display: flex;
      justify-content: flex-end;
    }
  }

  .footer-wrap{
    // padding: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>


