<template>
    <div>
        <el-radio-group v-model="radio" class="country-radio">
            <el-radio-button v-for="(country,idx) in countryList" :key="idx" :label="country.id">{{country.name}}</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        props: {
            checkCountry: {
                type: Function,
                required: true
            },
            countryId: {
                type: Number,
                required: false
            }
        },
        data () {
            return {
                countryList: [
                    {
                        name: 'All',
                        id: '0'
                    },{
                        name: 'Indonesia',
                        id: '1'
                    },{
                        name: 'Malaysia',
                        id: '2'
                    },{
                        name: 'Philippines',
                        id: '3'
                    },{
                        name: 'Vietnam',
                        id: '4'
                    }
                ],
                radio_d: this.countryId || 0,
            };
        },
        created() {
            // this.radio = this.defaultCountry || 0
        },
        computed: {
            radio: {
                get: function() {
                    // ----------------------  change事件放到这里绑定，初始化value可以执行一次  ---------------------
                    this.checkCountry(this.radio_d)
                    return this.radio_d
                },
                set: function(val) {
                    this.radio_d = val
                }
            }
        },
        methods: {

        }
    }
</script>
<style scoped>
.country-radio{
    margin-bottom: 2rem;
}
</style>
