<template>
  <div class="spl-container content">
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="clearfix">
      <div class="search pt-30 ml-20 search-row fl">
        <el-input placeholder="搜索文件名/关键字" class="w-240" v-model="searchWord" @keyup.enter.native="getTableData"></el-input>
        <el-button type="primary" class="search-btn" icon="el-icon-search" @click="getTableData"></el-button>
      </div>
      <div class="fr hint pt-30 mr-20">
        <img class="mr-10" src="../../assets/images/icons/ic-account-type39.png" alt="">
        <el-popover popper-class="popover" placement="bottom" width="306" trigger="hover" content="由于用工方式是和仕邦建立，签署的文件需仕 邦予定，请联系服务专员。">
          <p class="f-cursor" slot="reference">怎样添加新的模板文件？</p>
        </el-popover>
      </div>
    </header>
    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="false" :showSelection="false" :paging="false">
      <el-table-column prop="templateTypeName" label="文件类型" width="350" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="templateName" label="文件名称" min-width="350" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createName" label="创建人" width="350" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="创建时间" width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handlePreview(scope.row)" type="text" size="small">预览</el-button>
        </template>
      </el-table-column>
    </dTable>
    <el-dialog :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
      <iframe :src="pdfViewUrl" frameborder="0" width="100%" height="680px"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import dTable from '../../components/common/table'
export default {
  components: { dTable },
  data () {
    return {
      pathData: [{ name: '文件签署' }, { name: '文件管理' }],
      searchWord: '',
      pdfViewUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 270 + 'px'
    }
  },
  created () {
    this.$nextTick(() => {
      this.getTableData()
    })
  },
  methods: {
    /* 获取表格数据 */
    getTableData (params = []) {
      params = [{ property: 'templateName', value: this.searchWord }]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/entryresign/contractTemplate/list'
      })
    },
    /* 预览 */
    handlePreview (row) {
      if(this.$global.isAcrobatPluginInstall()){
        this.$http({
          url: '/api/entryresign/pdfViewUrl?fileId=' + row.fillFileId + '&fileName=' + encodeURIComponent(row.templateName),
          method: 'get'
        }).then(({ data }) => {
          this.pdfViewUrl = data.data[0]
          this.dialogVisible = true
        })
      }else{
        alert("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
        location = "https://seebonpubfile.oss-cn-shenzhen.aliyuncs.com/software/AdbeRdr930_zh_CN.exe";
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  header{
    .hint{
      display: flex;
      align-items: center;
      p{
          color: #FF9600;
        font-size: 14px;
      }
    }
  }
}
/deep/.el-dialog__headerbtn{
  top:8px;
}
/deep/.pal-pagination,.display-flex{
  display: none;
}
</style>
