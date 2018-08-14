<template>
  <section class="edit-wrap" @dblclick="toggleEdit" :style="{width:width + 'px'}">
    <el-input v-model="value" style="width:80%;" :placeholder="placeholder" v-if="edit" v-focus="isFocus" @blur="editDone" size="small" autofocus></el-input>
    <span v-if="!edit">{{value}}</span>
    <slot></slot>
  </section>
</template>
<script>
    export default{
        props: {
            width: String,
            inputValue: {
                type: String,
                default: '',
                required: true
            },
            placeholder: {
                type: String,
                default: 'input',
                required: false
            },
            isEdit: {
                type: Boolean
            },
            onBlur: {
                type: Function,
                default: () => {},
                required: false
            }
        },
        data() {
            return {
                edit: this.isEdit || false,
                value: '',
                isFocus: true
            }
        },
        created() {
            this.value = this.inputValue
        },
        computed: {
            // ----------------------  value必须要用computed计算，否则无法更新  ---------------------
            // value: {
            //     get: function () {
            //         return this.inputValue
            //     },
            //     set: function() {

            //     }
            // }
        },
        watch: {
            inputValue(newVal,oldVal) {
                this.value = newVal
            }
        },
        directives: {
            focus: {
                inserted: function (el, {value}) {
                    if (value) {
                        el.focus()
                    }
                }
            }
        },
        methods: {
            toggleEdit() {
                this.edit = !this.edit
                this.isFocus = true
            },
            async editDone() {
                this.edit = !this.edit
                this.isFocus = false
                if(this.value === this.inputValue) return
                this.onBlur.call(null,this.value)
            },
            reset(value) {
                this.value = value || this.inputValue
            }
        }
    }
</script>
<style scoped lang="scss">
.edit-wrap{
    display: flex;
    justify-content: center;
    min-height: 2rem;
    align-items: center;

    &>span{
        margin-left: 0.5rem;
    }
}

</style>
