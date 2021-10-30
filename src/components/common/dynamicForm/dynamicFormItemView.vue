<template>
  <!--1.文本 2.数值 3.日期 4.小时分钟 5.时间 6.下拉选项 7.文件 8.是否-->
  <el-form-item :label="item.formName+'：'" :required="item.required">
    <!--<p v-if="df.formTypeCode==7" v-text="getFileInfo(df.defaultValue)"></p>-->
    <p v-if="item.formTypeCode == '7'"><span class="f-cursor text-blue" @click="downFile">{{fileName}}</span></p>
    <p v-else>{{item | parseDynamicFieldText($moment, workAges, workAgeUnits)}}</p>
  </el-form-item>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return false
        }
      },
      size: 10,
      loading: false,
      defaultValue: '',
      options: [],
      timeout: null,
      idCardCode: '20004001',
      workAges: ['workYears', 'entryYears', 'probationPeriod'],
      workAgeUnits: {
        'workYears': '年',
        'entryYears': '年',
        'probationPeriod': '月'
      },
      fileName: '',
      filePath: '',
      uploadLoading: false
    }
  },
  filters: {
    parseDynamicFieldText (value, $moment, workAges, workAgeUnits) {
      var defaultValue = value.defaultValue
      if (defaultValue !== undefined && defaultValue != null && defaultValue !== '') {
        if (value.formTypeCode == '3') { // 日期
          return $moment(defaultValue).format('YYYY-MM-DD')
        } /* else if (value.formTypeCode === '4') {//小时分钟
           return $moment(defaultValue).format('HH:mm:ss')
           } */ else if (value.formTypeCode == '5') { // 时间
          return $moment(defaultValue).format('YYYY-MM-DD HH:mm:ss')
        } else if (value.formTypeCode == '6') { // 下拉
          var options = value.options
          if (options != null && options.length > 0) {
            for (var i = 0; i < options.length; i++) {
              if (defaultValue == options[i].id) {
                return options[i].name
              }
            }
          }
          return ''
        } else if (value.formTypeCode == '8') { // 是否
          return defaultValue == '1' ? '是' : '否'
        } else if (value.formTypeCode == '2') { // 数值
          var formKey = value.formKey
          if (workAges.indexOf(formKey) >= 0) {
            return defaultValue + workAgeUnits[formKey]
          }
        }
      }
      return defaultValue
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.item.formTypeCode == 7 && this.item.defaultValue) {
        this.getFileInfo(this.item.defaultValue)
      }
    })
  },
  methods: {
    // 获取附件信息
    getFileInfo (id) {
      if(id && id!= null && id!== ''){
        this.$http({
          url: '/sys/getFile/' + id,
          method: 'get',
          params: {}
        }).then(({ data }) => {
          if (data.code === 0) {
            this.fileName = data.data.orginalName
            this.filePath = data.data.fileUrl
          } else {
            this.$message.errow('系统异常')
            this.fileName = ''
            this.filePath = ''
          }
        })
      }else {
        this.fileName = ''
        this.filePath = ''
      }
    },
    downFile () {
      this.$downloadFile('/sys/download/' + this.item.defaultValue, 'get', {})
    }
  },
  mounted () {
  }
}
</script>
<style lang='less' scoped>
  .h-auto-select{
    .el-select-dropdown__item:hover{
      background: #f0f9eb !important;
    }
  }
</style>
