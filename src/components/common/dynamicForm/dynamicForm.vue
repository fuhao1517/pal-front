<template>
  <!--<el-form v-model="data"
           label-width="100px">-->
  <el-row :gutter="20">
    <el-col :span="12" v-for="(item, index) in data.array" :key="index" v-show="item.showFlag!=undefined?item.showFlag:true">
      <el-form :model="item" :ref="data.code+'_dynamicForm_'+data.index+'_'+item.formKey">
        <dynamic-form-item :item="item" :code="data.code" :index="data.index" :oprType="data.oprType"></dynamic-form-item>
      </el-form>
    </el-col>
  </el-row>
 <!-- </el-form>-->
</template>
<script>
import dynamicFormItem from './dynamicFormItem'
export default {
  components: {
    dynamicFormItem
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showFlag: true
    }
  },
  computed: {
  },
  mounted () {
    this.setDefaultValue()
  },
  methods: {
    handleInput (val, key) {
      // 这里element-ui没有上报event，直接就是value了
      // console.log(...this.value)
      // console.log(val)
      // console.log(val)
      this.$emit('input', { ...this.value, [this.value[key].defaultValue]: val })
    },
    setDefaultValue () {
      const formData = { ...this.value }
      // 设置默认值
      // this.data.forEach(item => {
      //   const { key, value } = item
      //   if (formData[key] === undefined || formData[key] === null) {
      //     formData[key] = value
      //   }
      // })
      this.$emit('input', { ...formData })
    }
  }
}
</script>
