<template>
    <div>
        <!-- 现在收货地址只有写死的印尼雅加达 -->
        <!-- <el-input
            style="width:25rem;"
            :placeholder="$t('通用.请输入')"
            v-model="addressForm.area"
            disabled
            clearable>
        </el-input> -->
        <el-select
            v-model="addressForm.province"
            value-key="id"
            @change="changeProvince"
            :placeholder="$t('通用[\'请选择省份（州）\']')"
            :clearable="clearable"
            :disabled="disabled"
            :size="size"
            >
            <el-option
                v-for="(item,idx) in provinceList"
                :key="idx"
                :label="item.name"
                :clearable="clearable"
                :value="item">
            </el-option>
        </el-select>
        <el-select
            class="ml"
            v-show="showCity"
            v-model="addressForm.city"
            value-key="id"
            @change="changeCity"
            :placeholder="$t('通用.请选择城市')"
            :clearable="clearable"
            :disabled="disabled"
            :size="size"
            >
            <el-option
                v-for="(item,idx) in cityList"
                :key="idx"
                :label="item.name"
                :value="item">
            </el-option>
        </el-select>
        <el-select
            class="ml"
            v-show="showDist"
            v-model="addressForm.dist"
            value-key="id"
            @change="changeDist" 
            :placeholder="$t('通用.请选择区域')"
            :disabled="disabled"
            :clearable="clearable"
            :size="size"
            >
            <el-option
                v-for="(item,idx) in distList"
                :key="idx"
                :label="item.name"
                :value="item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        value: Object,
        type: {
            type: String,
            default: 'dist',
            validator: function (value) {
                return ['province', 'city', 'dist'].indexOf(value) !== -1;
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            validator: function (value){
                return ['medium', 'small', 'mini'].indexOf(value) !== -1;
            }
        }
    },
    data () {
        return {
            province: '',
            city: '',
            dist: '',
            areaData: null,
            provinceList: [],
            cityList: [],
            distList: [],
            selectedIdx: null,
            addressForm: {

            },
        }
    },
    computed: {
        showDist(){
            return this.type === 'dist';
        },
        showCity(){
            return this.type === 'city' || this.type === 'dist'
        }
    },
    watch: {
        value: function(newVal){
            this.updateSelect();
        }
    },
    async created() {
        // ----------------------  获取国家地区数据  ---------------------
        await this.getAreaData();
        this.updateSelect();
    },
    methods: {
        async getAreaData() {
            let {data} = await axios.post(`/api/json/wrynn/collect/queryCountryCityList`,{collectCountry:1});
            if(data.success) {
                this.areaData = data.data;
                this.provinceList = data.data.province;
            }
        },
        updateSelect(){
            if(this.value.id && this.areaData){
                let id = Number(this.value.id);
                let address = {};
                if(this.type === 'dist'){
                    address.dist = this.getDistById(id);
                    if(address.dist){
                        address.city = this.getCityById(Number(address.dist.parent));
                    }
                    if(address.city){
                        address.province = this.getProvinceById(Number(address.city.parent));
                    }
                }else if(this.type === 'city'){
                    address.city = this.getCityById(id);
                    if(address.city){
                        address.province = this.getProvinceById(Number(address.city.parent));
                    }
                }else if(this.type === 'province'){
                    address.province = this.getProvinceById(id);
                }
                this.addressForm = Object.assign({}, this.addressForm, address);
            }
        },
        getDistById(distId){
            let distMap = this.areaData && this.areaData.dist;
            for(let [city, distList] of Object.entries(distMap)){
                if(Array.isArray(distList)){
                    let dist = distList.find(v=>v.id === distId);
                    if(dist){
                        this.distList = distList;
                        return dist;
                    }
                }
            }
        },
        getCityById(cityId){
            let cityMap = this.areaData && this.areaData.city;
            for(let [province, cityList] of Object.entries(cityMap)){
                if(Array.isArray(cityList)){
                    let city = cityList.find(v=>v.id === cityId);
                    if(city){
                        this.cityList = cityList;
                        return city;
                    }
                }
            }
        },
        getProvinceById(provinceId){
            let provniceList = this.areaData && this.areaData.province;
            if(Array.isArray(provniceList)){
                let province = provniceList.find(v=>v.id === provinceId);
                if(province){
                    this.provinceList = provniceList;
                    return province;
                }
            }
        },
        changeProvince(province) {
            let cityList = [];
            let key = province && province.name;
            if(this.areaData&&Array.isArray(this.areaData.city[key])){
                cityList = this.areaData.city[key];
            }
            this.cityList = [...cityList];
            this.addressForm.city && delete this.addressForm.city;
            this.addressForm.dist && delete this.addressForm.dist;
            this.setCurrentValue();
        },
        changeCity(city) {
            let distList = [];
            let key = city && city.name;
            if(this.areaData&&Array.isArray(this.areaData.dist[key])){
                distList = this.areaData.dist[key];
            }
            this.distList = [...distList];
            this.addressForm.dist && delete this.addressForm.dist;
            this.setCurrentValue();
        },
        changeDist(dist) {
            this.setCurrentValue();
        },
        setCurrentValue(){
            let {province, city, dist} = this.addressForm;
            console.log(this.addressForm);
            let area = [];
            let id;
            if(province){
                area.push(province.name);
                if(this.type === 'province'){
                    id = province.id;
                }
            }
            if(city){
                area.push(city.name);
                if(this.type === 'city'){
                    id = city.id;
                }
            }
            if(dist){
                area.push(dist.name);
                if(this.type === 'dist'){
                    id = city.id;
                }
            }
            let value = {
                ...this.addressForm,
                id: id,
                area: area.join(' ').trim()
            }
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
</script>
