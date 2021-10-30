<template>
  <div>
    <!--element-loading-background="rgba(255, 255, 255, 0.5)"-->
    <div class="table-div" :style="{height: this.height}" :class="{'cancelMinHeight': this.cancelMinHeight, 'showEmptyAll': this.showEmptyAll&&tableData.length<1}">
      <el-table size="mini" class="pal-table" ref="palTable" border  style="width: 100%;" height="100%" highlight-current-row
                :row-key="rowKey"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                :data="tableData"
                :row-class-name="tableRowClassName"
                @sort-change = "sortChange"
                @selection-change="selectionChange"
                @current-change="currentChange"
                @row-click = "rowClick"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
                :span-method="arraySpanMethod">
        <el-table-column type="selection" fixed="left" align="center" width="55" v-if="showSelection" :reserve-selection="reserveSelection"></el-table-column>
        <el-table-column fixed label="序号" width="75" align="center" v-if="showIndex">
          <template scope="scope"><span>{{scope.$index+(params.page - 1) * params.limit + 1}} </span></template>
        </el-table-column>
        <slot></slot>
        <template slot="empty">
          <p></p>
        </template>
      </el-table>
      <div class="empty-box" v-show="tableData.length<1">
        <div class="box">
          <img class="img" src="../../assets/images/empty.png">
          <p class="info">暂无数据信息</p>
        </div>
      </div>
    </div>
    <div class="pal-pagination display-flex" v-if="paging">
      <div class="flex1 text-left">
        <slot name="pagination-btns"></slot>
      </div>
      <el-pagination background
        v-if="paging"
        popper-class="pal-pagination"
        @size-change="limitChange"
        @current-change="pageChange"
        :current-page.sync="params.page"
        :page-size="params.limit"
        :page-sizes="pageSizes"
        align="right"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div  class="pal-pagination display-flex" v-if="showBottom">
      <div class="flex1 text-left">
        <slot name="bottom-btns"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="less">
  .pal-table{
   .el-loading-spinner i{
     font-size: 40px;
     margin-bottom: 10px;
   }
    .el-table__fixed{
      height: calc(100% - 10px)!important;
    }
    .is-scrolling-none + .el-table__fixed{
      height: 100%!important;
    }
 }
 .palTableFixed {
   .pal-table {
     .el-table__fixed {
       height: auto !important; // 此处的important表示优先于element.style
       bottom: 11px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
     }
   }
 }
 .cancelMinHeight{
   .pal-table{
     .el-table__body-wrapper{
       height: auto!important;
     }
   }
 }
</style>
<style lang="less" scoped>
  .table-div{
    position: relative;
    .empty-box{
      position: absolute;
      width: 100%;
      height: calc(100% - 70px);
      bottom: 20px;
      text-align: center;
      .box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .pal-table {
    position: relative;
  }
  /deep/.pal-table.el-table::before{
    display: none;
  }
  .pal-pagination{
    text-align: center;
    padding: 15px;
    border:1px solid rgba(221, 221, 221, 1);
    .el-pagination{
      margin-top: 0;
      font-weight: normal;
    }
  }
  /deep/ .el-table__fixed-right:before, /deep/ .el-table__fixed:before {
    background: none;
  }
  .empty-box2{
    text-align: center;
    .info{
      font-size: 14px;
      color: #C3C3C3;
      line-height: normal;
    }
  }
  .showEmptyAll{
    .pal-table{
      /deep/.el-table__body-wrapper{
        min-height: 250px!important;
      }
    }
  }

  /deep/ .el-table .checked-row {
    background: #ecf5ff !important;
  }

  /deep/ .el-table .unchecked-row {
    td {
      background: none !important;
    }
  }
</style>
<script>
export default {
  props: {
    // 参数  默认返回分页和条数
    params: {
      type: [Object, String, Number],
      default: function () {
        return { page: 1, limit: 20 }
      }
    },

    data: {
      type: [Array],
      default: function () {
        return []
      }
    },

    cancelMinHeight: {
      default: false
    },
    showEmptyAll: {
      default: true
    },

    // 分页
    paging: {
      default: true
    },
    // 分页
    showBottom: {
      default: false
    },
    // 多选框
    showSelection: {
      default: false
    },
    clickAndSelect: {
      default: true
    },
    // 序号
    showIndex: {
      default: false
    },

    tableHeight: {
      default: '600px'
    },

    noMinHeight: {
      default: false
    },
    rowKey: {
      default: ''
    },
    reserveSelection: {
      default: false
    },
    spanMethod: {
      type: Function,
      default: null
    },
    pageSizes: {
      type: [Array],
      default: function () {
        return [20, 50, 100, 500, 1000]
      }
    }
  },
  data () {
    /*
     *表格查询格式
     *{
 "filters": [   表头过滤
   {
     "operator": "string",   模糊or精确
     "property": "string",  字段
     "value": {}   //值
   }
 ],
 "page": 0,   //当前页
 "query": [   //表格查询
   {
     "property": "string",  字段
     "value": {}   值
   }
 ],
 "sidx": "string",   排序字段名
 "size": 0,          每页展示条数
 "sort": "string"    排序方式（升序或降序）
}
     * */
    return {
      api: '', // 请求接口
      requestMethod: 'post', // 默认post请求
      query: [], // 表格查询条件
      fetchPaging: '', // fetch传入的paging参数
      tableData: [], // 表格数据
      tableDataRecord: [], // 保存表格数据，用于前端分页时
      total: 0, // 总条数
      loading: false, // loading动画
      requestParams: {},
      callback: null,
      successback: null,
      errorback: null,
      selections: [],
      height: '',
      palTableFixed: false,
      sortCol: null
    }
  },
  watch: {
    data: function () {
      if (this.data) {
        this.tableData = this.data
      }
    },
    tableHeight: function () {
      this.watchTableHeight()
    }
  },
  created () {
    this.watchTableHeight()

    //    console.log(JSON.stringify(this.data))
    if (this.data) {
      this.tableData = this.data
    } else {
      this.tableData = []
    }
  },
  updated () {
    if (this.$refs.palTable.$el.classList.value.indexOf('el-table--scrollable-x') >= 0) {
      this.palTableFixed = true
    } else {
      this.palTableFixed = false
    }
  },
  computed: {
    // 实时更新server
    // server: function () {
    //   return this.api.split('.')[0]
    // },
    // 实时更新url
    // url: function () {
    //   return this.api.split('.')[1]
    // },
  },
  methods: {
    // query, method, url,paging, callback, successback, errorback, pageChange
    // query--查询参数
    // method--请求方式,
    // url--接口,
    // paging--判断是否在前端分页, 不传默认后台分页，传'front'则在前端分页
    // callback--处理完表格数据后的回调，successback--直接回调（需要自行处理表格数据） errorback--错误回调
    // pageChange  // 忽略
    fetch (obj) {
    //  this.loading = true
    //   {
    //     "filters": [
    //     {
    //       "operator": "string",
    //       "property": "string",
    //       "value": {}
    //     }
    //   ],
    //     "page": 0,
    //     "query": [
    //     {
    //       "property": "string",
    //       "value": {}
    //     }
    //   ],
    //     "sidx": "string",
    //     "size": 0,
    //     "sort": "string"
    //   }
      this.loading = true
      // 如果有分页, 执行此方法重置分页为1，如果是分页触发才不用改变
      if (obj.pageChange !== 'change') {
        if (this.paging) {
          this.params.page = 1
        }
        if (obj.pageChange == 'limitChange' && this.fetchPaging == 'front') {
          //  在前端分页
          this.frontPagingHandle()
          return
        }
      } else {
        if (this.fetchPaging == 'front') {
        //  在前端分页
          this.frontPagingHandle()
          return
        }
      }

      if (obj.url) {
        this.api = obj.url
      }
      if (obj.query) {
        this.query = obj.query
      }
      if (obj.paging) {
        this.fetchPaging = obj.paging
      }
      if (obj.method) {
        this.requestMethod = obj.method
      }
      if (obj.callback) {
        this.callback = obj.callback
      }
      if (obj.successback) {
        this.successback = obj.successback
      }
      if (obj.errorback) {
        this.errorback = obj.errorback
      }

      var httpJson = {
        url: this.api,
        method: this.requestMethod
      }

      var httpParams = {
        page: this.params.page,
        start: (this.params.page - 1) * this.params.limit,
        size: this.params.limit,
        query: this.query
      }
      if (!obj.noSort) {
        if (this.sortCol != null && this.sortCol.prop != null && this.sortCol.order != null) {
          httpParams.sidx = this.sortCol.column.sortable == true ? this.sortCol.prop : this.sortCol.column.sortable
          httpParams.sort = this.sortCol.order === 'ascending' ? 'asc' : 'desc'
        } else {
          httpParams.sidx = ''
          httpParams.sort = ''
        }
      }

      this.requestParams = httpParams
      if (this.requestMethod === 'get' || this.requestMethod === 'GET') {
        httpJson.params = httpParams
      } else if (this.requestMethod === 'post' || this.requestMethod === 'POST') {
        httpJson.data = httpParams
      }
      this.$http(httpJson).then(({ data }) => {
        var res = data.data[0]
        this.loading = false
        if (this.successback) {
          this.successback(res)
        } else {
          this.tableDataRecord = res.rows || []
          if (obj.paging == 'front') {
            //  在前端分页
            this.frontPagingHandle()
          } else {
            this.tableData = res.rows || []
            // 如果有分页
          }
          if (this.paging) {
            this.total = res.records || 0
            // this.params.page = data.curr || 0
          }
          if (this.callback) {
            this.callback(res)
          }
        }
      }).catch((data) => {
        this.loading = false
        if (this.errorback) {
          this.errorback(data)
        } else {
          // this.$message({
          //   message: '系统异常',
          //   type: 'error'
          // })
        }
      })
    },

    frontPagingHandle () {
      let page = this.params.page
      let limit = this.params.limit
      let start = (page - 1) * limit
      let end = start + limit
      let data = this.tableDataRecord.slice(start, end)
      this.tableData = data
      this.loading = false
    },

    init (params) {
      this.loading = true
      // 如果采用微服务的方式需要传微服务和url
      this.$http({
        url: 'http://192.168.0.68:3003/api/cust/countCustByType/detail/2019?page=1&results=10&',
        method: this.method ? this.method : 'get',
        params: params
      }).then(({ data }) => {
        this.tableData = data.data || []
        // 如果有分页
        if (this.paging) {
          this.total = data.count || 0
          this.params.page = data.curr || 0
        }
        this.loading = false
      })
    },
    // 重新请求 //如果需要重新请求使用$refs 调用这个方法
    reload () {
      // 如果有分页
      if (this.paging) {
        this.params.page = 1
      }
      // api动态加载完 开始重新请求数据
      this.$nextTick(() => {
        this.fetch({})
      })
    },
    // 判断表格数据是否为空
    isEmptyTable () {
      if (this.tableData.length > 0) {
        return false
      } else {
        return true
      }
    },
    // 重新请求 //如果需要重新请求使用$refs 调用这个方法
    emptyTable () {
      this.tableData = []
      this.tableDataRecord = []
    },
    // 以下是对el-table原来的方法再次封装emit出去
    // 多选
    selectionChange (val) {
      this.selections = val
      this.$emit('selection-change', val)
    },
    // 单选
    currentChange (currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    rowClick (row, event, column) {
      this.$emit('row-click', row, event, column)
      if (this.clickAndSelect) {
        this.$refs.palTable.toggleRowSelection(row)
      }
    },
    cellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    cellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    // 排序
    sortChange (column, prop, order) {
      this.$emit('sort-change', column, prop, order)
      this.sortCol = column
      this.fetch({ pageChange: 'change' })
    },
    // 表格翻页
    pageChange (page) {
      this.params.page = page
      this.fetch({ pageChange: 'change' })
    },
    limitChange (limit) {
      this.params.limit = limit
      this.fetch({ pageChange: 'limitChange' })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.spanMethod) {
        return this.spanMethod({ row, column, rowIndex, columnIndex })
      }
    },
    getParamsObj () {
      var obj = {}
      this.requestParams.query.forEach(item => {
        obj[item.property] = item.value
      })
      return obj
    },
    clearSort () {
      this.$refs.palTable.clearSort()
      this.sortCol = null
      this.fetch({ pageChange: 'change' })
    },
    clearSelection () {
      this.$refs.palTable.clearSelection()
    },
    //获取多项选择的数据
    getSelectionsArr (field) {
      //      console.log(field)
      if (!field) {
        return false
      }
      var arr = []

      for (var i = 0; i < this.selections.length; i++) {
        arr.push(this.selections[i][field])
      }
      //      console.log(arr)
      return arr
    },
    selectRow (row, selected) {
      if (this.showSelection) {
        this.$refs.palTable.toggleRowSelection(row, selected)
      } else {
        this.$refs.palTable.setCurrentRow(row)
      }
    },
    watchTableHeight () {
      if (!this.cancelMinHeight) {
        if (this.tableHeight.replace('px', '') < 260) {
          if (this.noMinHeight) {
            this.height = this.tableHeight
          } else {
            this.height = '260px'
          }
        } else {
          this.height = this.tableHeight
        }
      } else {
        //  不设置最小高度，为了某些静态表
        this.height = 'auto'
      }
    },
    tableRowClassName({row, rowIndex}) {
        if (this.showSelection) {
          if (this.selections.indexOf(row)>-1) {
            return 'checked-row'
          }
          return 'unchecked-row'
        }
        return ''
    }
  }
}
</script>
