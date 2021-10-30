<template>
  <div class="spl-container content">
    <!-- 面包屑导航 -->
    <breadcrumb :data="pathData"></breadcrumb>

    <header class="clearfix pt-40 mb-20">
      <div class="fl clearfix ml-60">
        <span class="fl">状态：</span>
        <el-checkbox-group class="fl" v-model="state">
          <el-checkbox label="待员工签署" name="type"></el-checkbox>
          <el-checkbox label="待仕邦签署" name="type"></el-checkbox>
          <el-checkbox label="已完成签署" name="type"></el-checkbox>
          <el-checkbox label="放弃签署" name="type"></el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="fr search clearfix">
        <el-input class="fl w-260" placeholder="请输入证件号码\姓名\手机号码查询" @keyup.enter.native="getTableData" v-model="searchValue"></el-input>
        <el-button size="small" class="ml-20 mr-10" type="primary" @click="getTableData">查询</el-button>
        <el-popover v-model="popover" placement="bottom" width="100%" trigger="click" popper-class="seach-popover" :visible-arrow="false">
          <el-button size="small" slot="reference" class="s-btn btn--border-blue">筛选</el-button>
          <el-row :gutter="0">
            <el-form :inline="true" :model="searchForm" ref="searchForm">
              <el-col :span="6">
                <el-form-item prop="entrySubject" class="ml-25" label="入职主体：">
                  <el-select v-model="searchForm.entrySubject" placeholder="请选择" clearable>
                    <el-option v-for="(item,index) in entrySubjectList" :key="index" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="onlyLook" class="ml-180">
                  <el-checkbox v-model="searchForm.onlyLook" label="只看离职类型的文件" name="type"></el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item prop="idCard" label="证件号码：" class="ml-235">
                  <el-input v-model="searchForm.idCard" type="textarea" class="w-200" placeholder="一行只可输入一个身份证"></el-input>
                  <span class="text-red ml-10">已输入{{searchForm.searchIdCardsLength}}个</span>
                </el-form-item>

                <el-form-item class="ml-30 mt-10">
                  <el-button size="small" type="primary" class="s-btn" @click="getTableData" icon="el-icon-search">查询</el-button>
                  <el-button size="small" icon="el-icon-refresh-left" @click="searchForm.idCard = '', searchForm.searchIdCardsLength = 0 , searchForm.entrySubject='' , searchForm.onlyLook=false" class="s-btn btn--border-blue" style="margin-left: 15px;">重置</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-popover>
        <el-button size="small" class="ml-10 fl mr-10" type="primary" @click="doSignFile">发起签署</el-button>
      </div>
    </header>

    <dTable @fetch="getTableData" ref="empTable" :tableHeight="tableHeight" :showIndex="true" :showSelection="false" :paging="true">
      <el-table-column prop="useType" label="" width="50" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img v-if="scope.row.useType === '2'" src="@/assets/images/icons/state.png" alt="">
          </template>
      </el-table-column>
      <el-table-column prop="empName" label="姓名" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="idCard" label="证件号码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="telephone" label="手机号码" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="optrName" label="签约主体" min-width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="cnt" label="文件数" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="signStatusStr" label="状态" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createName" label="发起人" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTimeStr" label="发起日期" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="handleOperation(scope.row)" type="text" size="small">操作</el-button>
        </template>
      </el-table-column>
    </dTable>

    <footer>
      <el-button size="small" type="primary" icon="ic-export-white" @click="handleExport">导出数据</el-button>
      <el-button class="s-btn btn--border-blue" icon="ic-download-blue" @click="handleDodnload">下载文件</el-button>
    </footer>

    <!-- 操作 -->
    <el-drawer :with-header="false" :withHeader="false" :show-close="false" :visible.sync="operationDrawer" :wrapperClosable="false" direction="rtl" :modal="false" custom-class="spl-detail-drawer">
      <operationDrawer :operationInfo="operationInfo" @handleClose="handleClose"/>
    </el-drawer>
  </div>
</template>

<script>
import dTable from '../../components/common/table'
import operationDrawer from './operationDrawer'
export default {
  components: { dTable, operationDrawer },
  data () {
    return {
      // 导航
      pathData: [{ name: '文件签署' }, { name: '签署管理' }],
      state: [], // 状态
      searchValue: '',
      searchForm: {
        entrySubject: '', // 入职主体
        onlyLook: false, // 只看离职类型的文件
        idCard: '', // 证件号码
        searchIdCardsLength: 0,
        setEmpIdCards: []
      },
      entrySubjectList: [],
      operationDrawer: false,
      popover: false,
      operationInfo: {}
    }
  },
  watch: {
    'searchForm.idCard' (newValue, oldValue) {
      var obj = this.$global.getIdCardRow(this.searchForm.idCard)
      this.searchForm.searchIdCardsLength = obj.num
      this.searchForm.setEmpIdCards = obj.value
    }
  },
  computed: {
    tableHeight: function () {
      return this.$global.bodyHeight - 370 + 'px'
    }
  },
  created () {
    this.$nextTick(() => {
      this.getTableData()
    })
  },
  mounted () {
    this.getEntrySubjectList()
  },
  methods: {
    /* 获取入职主体 */
    getEntrySubjectList () {
      this.$http({
        url: '/api/entryresign/entrySubjectList',
        method: 'get',
        data: {}
      }).then(({ data }) => {
        this.entrySubjectList = data.data[0]
        if (this.entrySubjectList.length === 1) {
          this.searchForm.entrySubject = this.entrySubjectList[0].name
        }
      })
    },
    /* 获取表格数据 */
    getTableData (params = []) {
      let signStatus = this.state.map(v => {
        if (v === '待员工签署') {
          v = '2'
          return v
        } else if (v === '待仕邦签署') {
          v = '3'
        } else if (v === '已完成签署') {
          v = '5'
        } else {
          v = '7'
        }
        return v
      })
      params = [
        { property: 'optrName', value: this.searchForm.entrySubject }, // 签约主体名称
        { property: 'signStatus', value: signStatus }, // 签署状态多个用逗号隔开
        { property: 'queryCond', value: this.searchValue }, // 姓名/身份证/手机号码
        { property: 'idCards', value: this.searchForm.setEmpIdCards }, // 多个身份证用,隔开
        { property: 'onlyLeave', value: this.searchForm.onlyLook === false ? '' : '1' } // 只看离职1,查看全部不传
      ]
      this.$refs.empTable.fetch({
        query: params,
        method: 'post',
        url: '/api/entryresign/file/fileList'
      })
      this.popover = false
    },
    /* 操作 */
    handleOperation (row) {
      if(this.$global.isAcrobatPluginInstall()){
        this.operationInfo = row
        this.operationDrawer = true
      }else{
        alert("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
        location = "https://seebonpubfile.oss-cn-shenzhen.aliyuncs.com/software/AdbeRdr930_zh_CN.exe";
      }
    },
    /* 导出数据 */
    handleExport () {
      this.$downloadFile('/api/entryresign/file/exportFileList', 'post', {}, this.$global.EXCEL)
    },
    /* 下载文件 */
    handleDodnload () {
      let signStatus = this.state.map(v => {
        if (v === '待员工签署') {
          v = '2'
          return v
        } else if (v === '待仕邦签署') {
          v = '3'
        } else if (v === '已完成签署') {
          v = '5'
        } else {
          v = '7'
        }
        return v
      })
      this.$downloadFile('/api/entryresign/file/downloadFile', 'post', {
        optrName: this.searchForm.entrySubject,
        signStatus,
        queryCond: this.searchValue,
        idCards: this.searchForm.setEmpIdCards,
        onlyLeave: this.searchForm.onlyLook === false ? '' : '1'
      })
    },

    // 发起签署
    doSignFile () {
      this.$http({
        url: '/api/entryresign/file/preLaunchSign',
        method: 'post',
        data: {
          type: '1' // 1入职2离职(这个页面发起的是入职)
        }
      }).then(({ data }) => {
        this.$router.push('/fileSign/startSign?batchNum=' + data.data[0] + '&type=1')
      })
    },

    //  关闭操作
    handleClose () {
      this.operationDrawer = false
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    position: relative;
    header{
      .search{
        display: flex;
        align-items: center;
      }
    }
    footer{
      position: absolute;
      left: 43px;
      bottom: 13px;
    }
  }
</style>
