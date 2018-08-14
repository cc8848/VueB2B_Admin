<template>
  <section class="container">
    <div class="header">
      <div class="header-name">{{$t('菜单.运营设置')}}</div>
    </div>
    <div class="hot block">
      <el-alert class="alert" :title="$t('运营管理.搜索热词')" type="success" :closable="false"></el-alert>
      <sort-tag :sortList="hotWords" @listChange="hotWordsChange" :newTagName="$t('运营管理.热词')"></sort-tag>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import SortTag from '~/components/global/SortTags'
export default {
  layout: 'withNav',
  components: {
    SortTag
  },
  data() {
    return {
      hotWords: [], //热词列表
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getHotWords()
    },
    async getHotWords() {
      let {data} = await axios.get(`/api/json/velen/public/hot/word`)
      if(data.success) {
        this.hotWords = data.data.map(i => i.word)
      } else {
        this.$message.error(data.errMsg)
      }
    },
    async hotWordsChange(words) {
      let {data} = await axios.post(`/api/json/velen/admin/update/search/hot/word?hotWords=${words.join(',')}`)
      if(data.success) {
        this.getHotWords()
      } else {
        this.$message.error(data.errMsg)
      }
    }
  },
}
</script>
