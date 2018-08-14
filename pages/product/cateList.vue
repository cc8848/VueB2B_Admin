<template>
  <section class="container">
    <!-- <country-radio :checkCountry="checkCountry" :countryId="0"></country-radio> -->
    <div class="add-cate">
        <div class="input-group">
            <el-input
                class="group-input"
                :placeholder="$t('商品管理.请输入类目名称')"
                v-model="newCate.name">
                <template slot="prepend">{{$t('商品管理.大类名称')}}</template>
            </el-input>
            <el-input
                class="group-input"
                :placeholder="$t('商品管理.请输入类目描述')"
                v-model="newCate.description">
            </el-input>
        </div>
        <div class="input-group">
            <div class="add-cate-img">
                <el-upload
                class="avatar-uploader"
                action="/api/img/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess.bind(null,'newCate')"
                :before-upload="beforeAvatarUpload.bind(null,'newCate')">
                    <img v-if="newCate.src" :src="newCate.src" class="avatar">
                    <span v-else class="el-icon-plus avatar-uploader-icon txt"></span>
                </el-upload>
            </div>
        </div>
        <div class="submite-wrap">
            <el-button type="default" class="submite">{{$t('通用.取消')}}</el-button>
            <el-button type="success" class="submite" @click="saveAddCate">{{$t('通用.保存')}}</el-button>
        </div>
    </div>
    <div class="cate">
        <div class="cate-list">
            <div 
                class="cate-item" 
                v-for="cate in cateList" v-dragging="{ item: cate, list: cateList, group: 'category' }"
                :class="{isNowCat:cate.name === nowCate.name}"
                :key="cate.id"
                @click="changeCate(cate)"
            >
            {{cate.name}}
            <i class="el-icon-circle-close" @click="(e) => deleteCate(cate,e)"></i>
            </div>
        </div>
        <div class="subclass-list" v-if="nowCate">
            <el-alert :title="$t('商品管理.编辑大类')" type="success" :closable="false"></el-alert>
            <div class="now-cate add-item">
                
                <div class="add-item-img">
                    <el-upload
                    class="avatar-uploader"
                    action="/api/img/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess.bind(null,'nowCate')"
                    :before-upload="beforeAvatarUpload.bind(null,'nowCate')">
                        <img :src="nowCate.src" class="avatar">
                    </el-upload>
                </div>
                <div class="add-item-right">
                    <div class="add-item-name">
                        <el-input
                            class="group-input"
                            :placeholder="$t('商品管理.请输入类目名称')"
                            size="small"
                            v-model="nowCate.name">
                        </el-input>
                        <el-input
                            class="group-input"
                            :placeholder="$t('商品管理.请输入类目描述')"
                            size="small"
                            v-model="nowCate.description">
                        </el-input>
                    </div>
                    <div class="add-item-btn">
                        <el-button type="success" class="submite" @click="saveEditCate">{{$t('通用.保存')}}</el-button>
                    </div>
                </div>
            </div>
            <el-alert :title="$t('商品管理.添加小类')" type="success" :closable="false"></el-alert>
            <div class="add-item">
                <div class="add-item-img">
                    <el-upload
                    class="avatar-uploader"
                    action="/api/img/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess.bind(null,'newSubclass')"
                    :before-upload="beforeAvatarUpload.bind(null,'newSubclass')">
                        <img v-if="newSubclass.src" :src="newSubclass.src" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="add-item-right">
                    <div class="add-item-name">
                        <el-input
                            class="group-input"
                            :placeholder="$t('商品管理.请输入类目名称')"
                            size="small"
                            v-model="newSubclass.name">
                        </el-input>
                    </div>
                    <div class="add-item-btn">
                        <el-button type="default" class="submite" @click="resetAddSubclass">{{$t('通用.重置')}}</el-button>
                        <el-button type="success" class="submite" @click="saveAddSubclass">{{$t('通用.保存')}}</el-button>
                    </div>
                </div>
            </div>
            <div class="subclass-item-list">
                <div class="subclass-item" v-for="subclass in subclassList" v-dragging="{ item: subclass, list: subclassList, group: 'subclass' }"
                :key="subclass.id">
                    <i class="el-icon-circle-close subclass-item-delete" @click="(e) => deleteSubclass(subclass,e)"></i>
                    <el-upload
                    class="avatar-uploader"
                    action="/api/img/upload"
                    :show-file-list="false"
                    :on-success="subclassUploadSuccess.bind(this,subclass)"
                    :before-upload="beforeEditSubUpload.bind(null,subclass)">
                        <img :src="subclass.src" alt="" class="subclass-item-img">
                    </el-upload>
                    <edit-input class="subclass-item-name " width="120" :inputValue="subclass.name" :ref="subclass.id" :onBlur="saveEdit.bind(this,subclass,'name')" >
                        <i class="el-icon-arrow-down" @click="toggleThird(subclass)"></i>
                    </edit-input>
                    <div class="thirdclass" :ref="`third-${subclass.id}`">
                        <div class="add">
                            <el-input class="input"  auto-complete="off" :placeholder="$t('商品管理.请输入类目名称')" v-model="subclass.addThird" width="80" size="mini"></el-input>
                            <div class="el-icon-circle-plus-outline btn" @click="saveAddThird(subclass)"></div>
                        </div>
                        <div class="thirdclass-list">
                            <div class="thirdclass-list-item" v-for="(thirdclass,idx) in subclass.children" :key="idx">
                                <edit-input :inputValue="thirdclass.name" width="160" :ref="thirdclass.id" :onBlur="saveEdit.bind(this,thirdclass,'name')">
                                    <i class="el-icon-circle-close thirdclass-item-delete" @click="(e) => deleteThirdclass(subclass,thirdclass,e)"></i>
                                </edit-input>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="subclass-item-name" @dblclick="edit.bind(subclass)">{{subclass.name}}</div>  -->
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
import DataTable from '~/components/global/DataTable'
import CountryRadio from '~/components/global/CountryRadio'
import EditInput from '~/components/global/EditInput'
import { mapMutations } from 'vuex'
import axios from 'axios'
// axios.defaults.headers.common['Content-Type'] = 'application/json'
export default {
    layout: 'withNav',
    async asyncData ({ params, error }) {
        
    },
    data: function() {
        return {
            cateList: [],
            nowCate: {
                img: ''
            },
            subclassList: [],
            newCate: {
                name: '',
                description: '',
                img: '',
                src: ''
            },
            uploadUrl: {},
            uploadKey: {},
            newSubclass: {
                name: '',
                img: '',
                src: ''
            },
            tableData: [],
            imageUrl: '',
            showSubclassDialog: false
        }
    },
    async created() {
        // const cateList = await axios.get('/api/category')
        this.initPage()
    },
    mounted () {
        this.$dragging.$on('dragend', async({group}) => {
            if(group === 'category') {
                let cateList = this.cateList
                , cateListNew = cateList.map(cate => {
                    return {
                        ...cate,
                        sort: cateList.map(i => i.name).indexOf(cate.name) + 1
                    }
                }) 
                const {data:{data:updateCateList}} = await axios.post('/api/category/sort',cateListNew)
                updateCateList &&  (this.cateList = cateListNew)
            } else if(group === 'subclass') {
                let subclassList = this.subclassList
                , subclassListNew = subclassList.map(cate => {
                    return {
                        ...cate,
                        sort: subclassList.map(i => i.name).indexOf(cate.name) + 1
                    }
                }) 
                console.log(subclassListNew)
                const {data:{data:updateSubclassList}} = await axios.post('/api/subclass/sort',{subclassList:subclassListNew,category:this.nowCate.id})
                updateSubclassList &&  (this.subclassList = subclassListNew)
            }
        })
    },
    methods: {
        async logout() {
            this.$store.commit('logout',this.$router)
        },
        async initPage() {
            const initCateInfo = (arr) => {
                if(!arr) return 
                return arr.map(item => ({
                    ...item,
                    src: item.imgUri,
                    children: initCateInfo(item.children) || []
                }))
            }
            // ----------------------  删除时候用  ---------------------
            try {
                let {data} = await axios.get('/api/json/velen/public/catalog')
                if(data.success) {
                    let cateList = data.data
                    , sortCateList = initCateInfo(cateList.sort((a,b) => a.sort - b.sort))
                    , nowCate = sortCateList[0] || null
                    this.cateList = sortCateList,
                    this.nowCate = nowCate
                    nowCate
                        ? (async _ => {
                            let subclassList = nowCate.children
                            , sortSubclassList = subclassList.sort((a,b) => a.sort - b.sort)
                            this.subclassList = sortSubclassList
                        })()
                        : null
                }
            } catch (e) {
                this.$message.error(e.message)
            }
        },
        checkCountry(id) {
            console.log(id)
        },
        async saveAddCate() {
            const {name,img} = this.newCate
            if(!name || !img) {
                return this.$message.error(this.$t('商品管理.大类名和图片不能为空'));
            }
            let param = {
                name,
                imgUri: img
            }
            const {data} = await axios.post('/api/json/velen/admin/catalog/add',param,{formData:true})
            if(data.success) {
                this.initPage()

                // let {data:{data:cateList}} = await axios.get('/api/category')
                // this.cateList = cateList.sort((a,b) => a.sort - b.sort)
                // cateList.length === 1 
                //     ? this.nowCate = cateList[0]
                //     : null
                this.newCate = {
                    name: '',
                    description: '',
                    img: ''
                }
            }
        },
        async handleAvatarSuccess(type, res, file, fileList) {
            // const {data:{url}} = res
            // this[type].img = url
        },
        async beforeEditSubUpload(sub,file) {
            let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=1&cnt=1&contentType=${file.type}`)
            if(data.success) {
                let url = data.data[0].url
                , key = data.data[0].key
                , src = data.data[0].src
                let res = await this.amazonUpload(url,file,{contentType: file.type})
                if(res.success) {
                    sub.img = key 
                    sub.src = src
                    await this.updataCate(sub)
                } else {
                    this.$message.error(this.$t('通用.图片上传失败'))
                }
            } else {
                this.$message.error(this.$t('通用.图片上传失败'))
            }
            return Promise.reject()
        },
        async beforeAvatarUpload(type,file) {
            let {data} = await axios.get(`/api/json/elune/admin/get/s3/url?type=1&cnt=1&contentType=${file.type}`)
            if(data.success) {
                let url = data.data[0].url
                , key = data.data[0].key
                , src = data.data[0].src
                let res = await this.amazonUpload(url,file,{contentType: file.type})
                if(res.success) {
                    this[type].img = key 
                    this[type].src = src
                } else {
                    this.$message.error(this.$t('通用.图片上传失败'))
                }
            } else {
                this.$message.error(this.$t('通用.图片上传失败'))
            }
            return Promise.reject()
        },
        async saveEditCate() {
            const {nowCate} = this
            let res = await this.updataCate(nowCate)
            // if(res) {
            //     this.cateList = this.cateList.map(item => {
            //         return item.id === nowCate.id
            //                 ? data.data
            //                 : item
            //     })
            // }
        },
        async saveAddSubclass() {
            const {name,img} = this.newSubclass
            , cateId = this.nowCate.id
            if(!name || !img) {
                return this.$message.error(this.$t('商品管理.小类名或图片不能为空'));
            }
            let param = {
                name,
                imgUri: img,
                parentId: cateId
            }
            const {data} = await axios.post('/api/json/velen/admin/catalog/add',param,{formData:true})
            if(data.success) {
                // this.getSubClass(cateId)
                let findedCate = this.cateList.find(item => item.id === cateId)
                if(findedCate.children) {
                    findedCate.children.push(data.data)
                } else {
                    findedCate.children = [data.data]
                }
                this.newSubclass = {
                    name:'',
                    img:''
                }
            }
        },
        resetAddSubclass() {
            this.newSubclass = {
                name:'',
                img:''
            }
        },
        async changeCate(cate) {
            if(this.nowCate.id === cate.id) return

            this.nowCate = cate
            console.log(this.nowCate,'nowcate')
            let findedCate = this.cateList.find(item => item.id === cate.id)
            this.subclassList = findedCate.children
            // this.getSubClass(cate.id)
        },
        async deleteCate(cate,e) {
            e.preventDefault()

            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async() => {
                let {data:{data:delCate}} = await axios.delete(`/api/category/${cate.id}`)
                this.initPage()
            }).catch((e) => {
                console.log(e)
                return
            });
        },
        async deleteSubclass(subclass,e) {
            e.preventDefault()
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async() => {
                let {data:{data:delSub}} = await axios.delete(`/api/subclass/${subclass.id}`)
                this.getSubClass(this.nowCate.id) 
            }).catch((e) => {
                console.log(e)
                return
            });
        },
        toggleThird(subclass)                    {
            // !subclass.showThird 
            //     ? subclass.showThird = true
            //     : delete subclass.showThird 
            // ----------------------  各种尝试均无效，无奈采用dom  ---------------------
            let ele = this.$refs[`third-${subclass.id}`][0]
            ele.className.indexOf('active') < 0
                ? ele.className += ' active'
                : ele.className = 'thirdclass'
        },
        async saveAddThird(subclass) {
            console.log(subclass)
            let newThird = {
                name: subclass.addThird,
                imgUri: 'xxx',
                parentId: subclass.id
            }
            const {data} = await axios.post('/api/json/velen/admin/catalog/add',newThird,{formData:true})
            if(data.success) {
                if(subclass.children) {
                    subclass.children.push(data.data)
                } else {
                    subclass.children = [data.data]
                }
                subclass.addThird = ''
            }
        },
        async deleteThirdclass(subclass,thirdclass,e) {
            let {data} = await axios.delete(`/api/thirdclass/${thirdclass.id}`)
            if(data.success) {
                subclass.thirdclass.splice(subclass.thirdclass.map(i => i.id).indexOf(thirdclass.id),1) 
            }
            // thirdclassList.splice(thirdclassList.map(item => item.name).indexOf(tag.name), 1);
        },
        async getSubClass(cateId) {
            // let {data:{data:subclassList}} = await axios.get(`/api/subclass/${cateId}`)
            // , sortSubclassList = subclassList.sort((a,b) => a.sort - b.sort)
            let {data} = await axios.get('/api/json/velen/public/catalog')
            if(data.success) {
                let cateList = data.data
                , findedCate = cateList.find(item => item.id === cateId)
                this.subclassList = findedCate.children
                return findedCate.children
            }
        },
        async saveEdit(subclass,type,value) {
            let oldValue = subclass[type]
            subclass[type] = value
            let subNew = {...subclass,type:value}
            let res = await this.updataCate(subNew)
            res 
                ? null
                : (() => {
                    this.subclassList.find(item => item.id === subclass.id)[type] = oldValue
                    this.$refs[subclass.id][0].reset(oldValue)
                })()
        },
        async subclassUploadSuccess(subclass,res,file) {
            subclass.img = res.data.url
            const {data:{data:updateSubclass}} = await axios.patch(`/api/subclass/${subclass.id}`,subclass)
        },
        async updataCate(params) {
            return new Promise(async(resolve,reject) => {
                const {id,name,img,imgUri,key} = params
                if(!name) {
                    return this.$message.error(this.$t('商品管理.大类名和图片不能为空'));
                }
                let param = {
                    id,
                    name
                }
                img ? param.imgUri = img : null
                let {data} = await axios.post(`/api/json/velen/admin/catalog/edit`,param,{formData: true})
                if(data.success) {
                    this.$message.success(this.$t('通用.操作成功'))
                    resolve(true)
                } else {
                    this.$message.error(this.$t('通用.操作失败'))
                    resolve(false)
                }
            })
        }
    },
    components:{
        DataTable,CountryRadio,EditInput
    }
}
</script>
<style scoped lang="scss">
.add-cate{
    background-color: #efeff4;
    padding: 1rem;
    margin-top: 1rem;
        margin-left: 1rem;
    .input-group{
        margin-top: 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;

        .group-input{
            width: 20rem;
            margin-left: 1rem;
        }

        .block{
            display: block;
            min-height: 40px;
        }
        
        .add-cate-img{
            margin-left: 1rem;

            .txt{
                font-size: 12px;
                color: #8c939d;
                width: 10rem;
                height: 10rem;
                line-height: 10rem;
                text-align: center;
            }
        }
    }

    .submite-wrap{
        display: flex;
        justify-content: flex-end;
    }
}
.cate{
    display: flex;
    margin-top: 1rem;

    &-list{
        width: 10rem;
        margin-left: 1rem;
    }
    &-item{
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: #bcdcbd;
        margin-top: 0.5rem;

        .el-icon-circle-close{
            display: none;
            cursor: pointer;
        }

        &:hover{
            border: 2px solid greenyellow;
        }

        &:hover .el-icon-circle-close{
            display: initial;
        }

        &.isNowCat{
            border: 2px solid red;
        }

    }

    .subclass-list{
        margin-left: 2rem;
        max-width: 80%;
        width: 80%;

        .now-cate{
            padding-bottom: 1rem;
            // border-bottom: 2px dashed #ccc;
        }

        .add-item{
            margin-top: 1rem;
            display: flex;
            margin-left: 1rem;

            &-img{
                width: 10rem;
                height: 10rem;
                img{
                    width: 10rem;
                }

            }

            &-name{
                margin-top: 1rem;

                .group-input{
                    width: 10rem;
                }
            }

            &-right{
                margin-left: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        }

        .subclass-item{
            width: 10rem;
            min-height: 10rem;
            margin-left: 1rem;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            border: 1px solid #ccc;
            position: relative;

            &:hover .subclass-item-delete{
                display: initial;
            }

            &-img{
                width: 8rem;
            }

            &-delete{
                position: absolute;
                right: 0.5rem;
                top: 0.5rem;
                display: none;
                cursor: pointer;
                z-index: 10;
            }

            &-name{
                cursor: pointer;
            }

            &-list{
                display: flex;
                flex-flow: row wrap;
                margin-top: 2rem;
                
                .thirdclass{
                    width: 100%;
                    position: absolute;
                    top: 10rem;
                    z-index: 10;
                    border-radius: 5px;
                    min-height: 8rem;
                    background-color: #eee;
                    display: none;
                    &.active{
                        display: block;
                    }

                    .add{
                        display: flex;
                        margin-top: 0.2rem;
                        justify-content: center;
                        align-items: center;

                        .input{
                            width: 5rem;
                            margin-right: 0.5rem;
                        }

                        .btn{
                            cursor: pointer;
                            font-size: 1rem;
                            color: #bcdcbd;
                            &:hover{
                                color: green;
                            }
                        }
                    }

                    &-list{
                        display: flex;
                        flex-wrap: wrap;
                        max-height: 15rem;
                        overflow: auto;
                        
                        &-item{
                            .thirdclass-item-delete{
                                display: none;
                                cursor: pointer;
                            }
                            &:hover .thirdclass-item-delete{
                                display: inherit;
                            }

                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.add-item,.add-cate{
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
}
</style>
