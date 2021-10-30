<template>
  <div class="spl-container spl-index-container" :style="{minHeight: containerHeight}">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <div class="top-type-list">
      <el-row>
        <el-col :span="6" class="type-list">
          <img src="@/assets/images/index/ic-index-type1.png" alt="">
          <p class="title">社保</p>
          <div>
            <el-row>
              <el-col :span="12" class="count-1">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.socialIncreaseCount}}</p>
                  <p class="detail">增员</p>
                </div>
              </el-col>
              <el-col :span="12" class="count-r">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.socialDecreaseCount}}</p>
                  <p class="detail">减员</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6" class="type-list">
          <img src="@/assets/images/index/ic-index-type2.png" alt="">
          <p class="title">公积金</p>
          <div>
            <el-row>
              <el-col :span="12" class="count-1">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.accfundIncreaseCount}}</p>
                  <p class="detail">增员</p>
                </div>
              </el-col>
              <el-col :span="12" class="count-r">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.accfundDecreaseCount}}</p>
                  <p class="detail">减员</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6" class="type-list">
          <img src="@/assets/images/index/ic-index-type3.png" alt="">
          <p class="title">商保</p>
          <div>
            <el-row>
              <el-col :span="12" class="count-1">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.comminsureIncreaseCount}}</p>
                  <p class="detail">增员</p>
                </div>
              </el-col>
              <el-col :span="12" class="count-r">
                <div class="count-detail">
                  <p class="count">{{increaseAndDecreaseCount.comminsureDecreaseCount}}</p>
                  <p class="detail">减员</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6" class="type-list">
          <img src="@/assets/images/index/ic-index-type4.png" alt="">
          <p class="title">人事</p>
          <div>
            <el-row>
              <el-col :span="12" class="count-1">
                <div class="count-detail">
                  <p class="count">{{statisticsCount.personEntryCount}}</p>
                  <p class="detail">入职处理</p>
                </div>
              </el-col>
              <el-col :span="12" class="count-r">
                <div class="count-detail">
                  <p class="count">{{statisticsCount.personResignCount}}</p>
                  <p class="detail">离职处理</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="calendar-news">
      <el-row :gutter="20" style="height: 100%;">
        <el-col :span="12" class="calendar-area">
          <div style="height: 100%;">
            <el-row :gutter="20" style="height: 100%;">
              <el-col :span="16" style="height: 100%;">
                <div style="background-color: #fff;height: 100%;">
                  <el-calendar v-model="activeDay" :key="refreshCalendar">
                    <template slot="dateCell" slot-scope="{ date, data }">
                      <el-popover placement="right" trigger="hover" popper-class="max-popper-500" :disabled="sysMsgDateArr.indexOf(data.day)<0">
                        <div v-if="sysMsgDateArr.indexOf(data.day)>-1">事项内容：{{sysMsgList[sysMsgDateArr.indexOf(data.day)].param}}</div>
                        <div slot="reference" class="calendar-td">
                          <span class="arrange rest" v-if="checkHoliday(data.day, 0)=='休'">休</span>
                          <span class="arrange work" v-if="checkHoliday(data.day, 0)=='班'">班</span>
                          <p class="solar" :class="{'text-red': checkHoliday(data.day, 1)}">{{Number(data.day.split('-')[2])}}
                            <!--设置日期在当天之后-->
                            <span class="spot spot-orange" v-if="sysMsgDateArr.indexOf(data.day)>-1&&(!(new Date(data.day) < new Date(curDate)))"></span>
                            <!--设置日期在当天之前-->
                            <span class="spot spot-green" v-if="sysMsgDateArr.indexOf(data.day)>-1&&(new Date(data.day) < new Date(curDate))"></span>
                          </p>
                          <p class="lunar" v-html="solarDate2lunar(data.day)"></p>
                        </div>
                      </el-popover>
                    </template>
                  </el-calendar>
                </div>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <div class="day-detail">
                  <div class="display-flex">
                    <span class="select-day">{{dayDetail.solar}}</span>
                    <div class="week-lunar ml-20">
                      <p class="week">{{dayDetail.week}}</p>
                      <p class="lunar">农历{{dayDetail.lunar}}</p>
                    </div>
                  </div>
                  <div class="day-content mt-20 flex1">
                    <p v-if="dayDetail.content">事项内容：{{dayDetail.content}}</p>
                    <p v-else>暂无事项内容</p>
                  </div>
                  <div class="text-center">
                    <el-button size="small" class="dash-gray-btn mt-20" style="width: 100%; max-width: 190px"
                               icon="el-icon-plus" @click="setForm.setmatterDialog = true">添加事项
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>

          </div>
        </el-col>

        <el-col :span="12" class="news-area">
          <div style="height: 100%;background-color: #fff;display: flex;flex-flow: column;">
            <div class="top_title">
              <p class="title">消息提醒</p>
            </div>
            <div class="flex1" style="overflow: auto">
              <ul class="news-list">
                <li v-for="(val, key, index) in deadlineMsgList" :key="index">
                  <span class="spot"></span><router-link to="/socialAccfund/import">{{val}}</router-link>
                </li>
                <li v-if="isLoadDeadlineMsgList&&statisticsCount.monthWaitEntryCount>0"><span class="spot"></span><router-link to="/employee/entryManage/index">本月有{{statisticsCount.monthWaitEntryCount}}名待入职员工，请及时跟进入职处理</router-link></li>
                <li v-if="isLoadDeadlineMsgList&&statisticsCount.monthWaitResignCount>0"><span class="spot"></span><router-link to="/employee/exitAdmin">本月有{{statisticsCount.monthWaitResignCount}}名待离职员工，请及时跟进离职处理</router-link></li>
                <li v-if="isLoadDeadlineMsgList&&statisticsCount.monthWaitSignFileCount>0"><span class="spot"></span><router-link to="/fileSign/signAdmin">本月有{{statisticsCount.monthWaitSignFileCount}}份文件未完成签署，请及时跟进签署</router-link></li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="used-opt mt-20">
      <el-row :gutter="20">
        <el-col :span="12" class="used-menu">
          <div style="background-color: #fff;">
            <div class="top_title">
              <p class="title">快捷菜单</p>
            </div>
            <el-row class="menu-list">
              <el-col :span="6">
                <router-link to="/employee/empAdd">
                  <div class="menu-type">
                    <i class="ic-index-menu ic-menu1"></i>
                    <p class="menu-name">添加员工</p>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="6">
                <router-link to="/socialAccfund/import">
                  <div class="menu-type">
                    <i class="ic-index-menu ic-menu2"></i>
                    <p class="menu-name">批量增减员</p>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="6">
                <router-link to="/salaryAccounting/index">
                  <div class="menu-type">
                    <i class="ic-index-menu ic-menu3"></i>
                    <p class="menu-name">薪酬核算</p>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="6">
                <router-link to="/billManage/index">
                  <div class="menu-type">
                    <i class="ic-index-menu ic-menu4"></i>
                    <p class="menu-name">账单管理</p>
                  </div>
                </router-link>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12" class="used-tool">
          <div style="background-color: #fff;">
            <div class="top_title">
              <p class="title">常用工具</p>
            </div>
            <el-row class="menu-list">
              <el-col :span="8">
                <div class="menu-type" @click="downloadFile(0)">
                  <i class="ic-index-menu ic-excel1"></i>
                  <p class="menu-name">人员信息导入表格</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="menu-type" @click="downloadFile(1)">
                  <i class="ic-index-menu ic-excel1"></i>
                  <p class="menu-name">增减员导入表格</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="menu-type" @click="downloadFile(2)">
                  <i class="ic-index-menu ic-excel1"></i>
                  <p class="menu-name">薪酬导入表格</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--添加事项-->
    <el-dialog title="添加提醒事项" :visible.sync="setForm.setmatterDialog" width="600px" :before-close="clearSetForm"
               :close-on-click-modal="false" :show-close="false">
      <el-form ref="setForm" :model="setForm" label-width="120px">
        <el-form-item label="提醒日期" prop="date" :rules="[{ required: true, message: '请选择提醒日期',trigger:'blur'}]">
          <el-date-picker v-model="setForm.date" class="w-360 date-editor2 date-editor3" type="date" value-format="yyyy-MM-dd"
                          @change="datePickerChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事项内容" prop="date" label-width="112px">
          <el-input
            type="textarea"
            class="w-360"
            style="margin-left: 8px;"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入内容"
            maxlength="200"
            v-model="setForm.content">
          </el-input>
          <span style="position: relative;bottom: -12px;"><span class="text-red" style="margin-left: 7px;">{{setForm.content.length}}</span><span
            style="color: #C0C4CC">个字</span></span>
        </el-form-item>
        <div style="text-align:center;margin-top: 35px;margin-bottom: 30px;">
          <el-button class="mr-60 w-90" size="small" @click="clearSetForm()">取 消</el-button>
          <el-button size="small" class="w-90" type="primary" @click="vaildSetForm()">确 认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { calendar } from '../../utils/calendar'

export default {
  data () {
    return {
      pathData: [{ name: '首页' }],
      timer: null,
      curDate: this.$moment(new Date()).format('YYYY-MM-DD'),
      activeDay: new Date(),
      refreshCalendar: new Date().getTime(),
      dayDetail: {
        solar: '',
        week: '',
        lunar: '',
        content: '',
        year: '',
        month: ''
      },
      weeks: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      setForm: {
        setmatterDialog: false,
        date: '',
        content: ''
      },
      deadlineMsgList: [],
      isLoadDeadlineMsgList: false,
      increaseAndDecreaseCount: {}, // 首页查询社保、公积金、商保增减员人数
      statisticsCount: {}, // 首页查询社保、公积金、商保增减员人数
      sysMsgList: [], // 设置事项集合
      sysMsgDateArr: [], // 设置事项-日期集合
      holidayList: [], // 首页查询社保、公积金、商保增减员人数
      curSelectYearMonth: this.$moment(new Date()).format('YYYYMM')
    }
  },
  computed: {
    containerHeight: function () {
      return this.$global.bodyHeight - 100 + 'px'
    }
  },
  created () {
    this.getIncreaseAndDecreaseCount()
    this.getStatisticsCount()
    this.getDeadlineMsg()

    this.initPage()
  },
  watch: {
    activeDay (val) {
      let date = this.$moment(val).format('YYYYMM')
      if (this.curSelectYearMonth != date) {
        this.curSelectYearMonth = date
        this.initPage()
      } else {
        this.handleSelectDay(this.activeDay)
      }
    }
  },
  methods: {
    // 农历显示
    solarDate2lunar (solarDate) {
      let solar = solarDate.split('-')
      let lunar = calendar.solar2lunar(solar[0], solar[1], solar[2])
      // return solar[2] + '\n' + lunar.IMonthCn + lunar.IDayCn\
      let festival = lunar.lunarFestival ? lunar.lunarFestival : lunar.festival ? lunar.festival : lunar.Term ? lunar.Term : ''
      if (festival != '') {
        return '<span class="text-red">' + festival + '</span>'
      } else {
        return lunar.IDayCn
      }
    },

    initPage () {
      //  事项
      this.getSysMsgByMonth()
      // 节假日
      this.getHoliday()
    },

    // 判断节假日+休息
    checkHoliday (day, type) {
      let date = this.$moment(day).format('YYYY-MM-DD')
      let dayFormat = date.split('-')
      let dayDetail = calendar.solar2lunar(dayFormat[0], dayFormat[1], dayFormat[2])
      let week = dayDetail.nWeek
      if (this.holidayList.length == 0) {
        if (type == 1) {
          if (week > 5) {
            return true
          } else {
            return false
          }
        } else {
          return ''
        }
      }

      if (type == 0) {
        if (this.holidayList.indexOf(date) > -1) {
          if (week < 6) {
            return '休'
          } else {
            return ''
          }
        } else {
          if (week > 5) {
            return '班'
          } else {
            return ''
          }
        }
      } else {
        if (week > 5 || this.holidayList.indexOf(date) > -1) {
          return true
        } else {
          return false
        }
      }
    },
    handleSelectDay (day) {
      let date = this.$moment(day).format('YYYY-MM-DD')
      let dayFormat = date.split('-')
      let dayDetail = calendar.solar2lunar(dayFormat[0], dayFormat[1], dayFormat[2])
      let index = this.sysMsgDateArr.indexOf(date)
      let content = index < 0 ? '' : this.sysMsgList[index].param

      this.dayDetail.solar = dayFormat[2]
      this.dayDetail.week = dayDetail.ncWeek
      this.dayDetail.lunar = dayDetail.IMonthCn + dayDetail.IDayCn
      this.dayDetail.content = content

      this.dayDetail.month = dayDetail.cMonth
      this.dayDetail.month = dayDetail.cMonth
      this.dayDetail.year = dayDetail.cYear
    },
    datePickerChange (val) {
      this.$http({
        url: '/api/index/getNewSysMsg?date=' + val,
        method: 'post'
      }).then(({ data }) => {
        this.setForm.content = data.data[0][0].param
      })
    },

    // 获取截止日消息提醒
    getDeadlineMsg () {
      this.$http({
        url: '/api/index/getDeadlineMsg',
        method: 'get'
      }).then(({ data }) => {
        this.deadlineMsgList = data.data[0]
        this.isLoadDeadlineMsgList = true
      })
    },

    // 首页查询社保、公积金、商保增减员人数
    getIncreaseAndDecreaseCount () {
      let that = this
      if (this.$store.state.userData.custId) {
        clearInterval(that.timer)
        this.$http({
          url: '/api/employee/increaseAndDecreaseCount/' + this.$store.state.userData.custId,
          method: 'get'
        }).then(({ data }) => {
          this.increaseAndDecreaseCount = data.data[0]
        })
      } else {
        this.timer = setInterval(function () {
          console.log('timer')
          that.getIncreaseAndDecreaseCount()
        }, 1000)
      }
    },
    // 首页查询社保、公积金、商保增减员人数
    getStatisticsCount () {
      this.$http({
        url: '/api/entryresign/statisticsCount',
        method: 'get'
      }).then(({ data }) => {
        this.statisticsCount = data.data[0]
      })
    },

    // 查询上当下月份的事项
    getSysMsgByMonth () {
      this.$http({
        url: '/api/index/getSysMsgByMonth',
        method: 'post',
        data: this.$qs.stringify({
          date: this.curSelectYearMonth
        })
      }).then(({ data }) => {
        this.sysMsgList = data.data[0]
        let sysMsgDateArr = []
        this.sysMsgList.forEach(it => {
          sysMsgDateArr.push(it.sendTime)
        })
        this.sysMsgDateArr = sysMsgDateArr
        this.refreshCalendar = new Date().getTime()
        this.handleSelectDay(this.activeDay)
      })
    },
    // 查询节休假日
    getHoliday () {
      this.$http({
        url: '/api/index/getHoliday',
        method: 'get',
        params: {
          date: this.curSelectYearMonth
        }
      }).then(({ data }) => {
        let res = data.data[0]
        let holidayList = []
        res.forEach(it => {
          holidayList.push(this.$moment(it).format('YYYY-MM-DD'))
        })
        this.holidayList = holidayList
        this.refreshCalendar = new Date().getTime()
      })
    },

    vaildSetForm () {
      this.$refs.setForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: '/api/index/addMsg',
            method: 'POST',
            data: {
              sendTime: this.setForm.date,
              receivedTime: this.setForm.date,
              param: this.setForm.content
            }
          }).then(({ data }) => {
            this.$message.success('操作成功')
            this.getSysMsgByMonth()
            this.clearSetForm()
          })
        }
      })
    },

    downloadFile (type) {
      let url = ''
      if (type == 0) {
        url = '/api/employee/import/exportEmployeeTemplate'
        this.$downloadFile(url, 'post', this.$global.EXCEL)
      } else if (type == 1) {
        url = '/api/socialAccfund/templates'
        this.$downloadFile(url, 'post', this.$global.EXCEL)
      } else if (type == 2) {
        url = '/api/salary/downloadTemplateFile?type=2'
        this.$downloadFile('/api/salary/downloadTemplateFile?type=2', 'post', {})
      }
    },

    clearSetForm () {
      this.setForm = {
        setmatterDialog: false,
        date: '',
        content: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .spl-index-container {
    background-color: @bodyBaseBgc;
    min-width: 1500px;
  }

  .top-type-list {
    padding: 30px 0;
    background-color: #fff;
    min-height: 168px;
    .type-list {
      text-align: center;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-top: 1px;
      margin-bottom: 10px;
    }
    .count-detail {
      display: inline-block;
      text-align: center;
    }
    .count {
      font-size: 24px;
      line-height: 20px;
      color: #333333;
      display: inline-block;
    }
    .detail {
      color: #666666;
      font-size: 14px;
      margin-top: 10px;
    }
    .count-1 {
      border-right: 1px solid #C0C4CC;
      padding-right: 20px;
      text-align: right;
      display: inline-block;
    }
    .count-r {
      padding-left: 20px;
      text-align: left;
      display: inline-block;
    }
  }

  .top_title {
    padding: 0 10px;
    .title {
      font-size: 18px;
      padding-left: 17px;
      border-bottom: 1px solid #BFC3CB;
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      color: #333333;
    }
  }

  .used-opt {
    .menu-list {
      height: 117px;
      text-align: center;
      vertical-align: middle;
      padding-top: 33px;
    }
    .menu-type {
      display: inline-block;
      cursor: pointer;
    }
    .menu-type:hover {
      .ic-menu1 {
        width: 32px;
        background: url("../../assets/images/index/ic-menu11.png");
      }
      .ic-menu2 {
        width: 30px;
        background: url("../../assets/images/index/ic-menu22.png");
      }
      .ic-menu3 {
        width: 31px;
        background: url("../../assets/images/index/ic-menu33.png");
      }
      .ic-menu4 {
        width: 27px;
        background: url("../../assets/images/index/ic-menu44.png");
      }
      .menu-name {
        color: #3F9DFF;
      }
      .ic-excel1 {
        width: 29px;
        background: url("../../assets/images/index/ic-excel2.png");
      }
    }
    .ic-index-menu {
      display: inline-block;
      height: 30px;
      margin-bottom: 5px;
    }
    .ic-menu1 {
      width: 32px;
      background: url("../../assets/images/index/ic-menu1.png");
    }
    .ic-menu2 {
      width: 30px;
      background: url("../../assets/images/index/ic-menu2.png");
    }
    .ic-menu3 {
      width: 31px;
      background: url("../../assets/images/index/ic-menu3.png");
    }
    .ic-menu4 {
      width: 27px;
      background: url("../../assets/images/index/ic-menu4.png");
    }
    .ic-excel1 {
      width: 29px;
      background: url("../../assets/images/index/ic-excel1.png");
    }
    .menu-name {
      color: #2F3133;
    }
  }

  .calendar-news {
    height: 465px;
    margin-top: 20px;
    .day-detail {
      height: 100%;
      width: 100%;
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
      flex-flow: column;
      display: flex;
    }
    .select-day {
      display: inline-block;
      width: 61px;
      height: 61px;
      line-height: 61px;
      text-align: center;
      background: #FF9700;
      font-size: 36px;
      color: #fff;
      border-radius: 3px;
    }
    .week-lunar {
      color: #333333;
    }
    .week {
      margin: 8px 0;
    }
    .day-content {
      overflow: auto;
    }
  }

  .calendar-area {
    height: 100%;
    background-color: @bodyBaseBgc;
    /deep/ .el-calendar {
      background: none;
      .text-red{
        color: #DF2D2D;
      }
      .solar {
        font-size: 16px;
        font-weight: bold;
      }
      .lunar {
        font-size: 12px;
        margin-top: 10px;
      }
    }
    /deep/ .el-calendar-table .el-calendar-day {
      height: 57px;
      padding: 0;
      .calendar-td{
        padding: 5px 8px;
      }
    }
    /deep/ .el-calendar-table thead {
      th {
        color: #656565;
      }
      th:nth-of-type(6), th:nth-of-type(7) {
        color: #DF2D2D;
      }
    }
    /deep/ .el-calendar__title {
      font-size: 20px;
      color: #333333;
    }
    /deep/ .el-calendar__button-group {
      .el-button {
        height: 36px;
      }
    }
    /deep/ .el-calendar__header {
      border: none;
      padding-top: 20px;
      padding-bottom: 5px;
    }
    /deep/ .el-calendar-table thead th {
      padding: 0 0 9px 0;
    }
    /deep/ .el-calendar-table {
      td {
        color: #333333;
        position: relative;
      }
      /*td:nth-of-type(6), td:nth-of-type(7) {
        .solar {
          color: #DF2D2D;
        }
      }*/
    }

    .arrange {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      right: 0;
      top: 0;
      color: #ffffff;
    }
    .rest {
      background-color: #FF3F2D;
    }
    .work {
      background-color: #C9C9C9;
    }
    .spot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: -2px;
      vertical-align: middle;
      margin-top: -3px;
    }
    .spot-orange {
      background-color: #FF9700;
    }
    .spot-green {
      background-color: #67C139;
    }
    /deep/ .el-calendar-table td {
      border-color: #D0DCF3;
    }
    /deep/ .el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev {
      color: #999999!important;
      .solar {
        color: #999999!important;
      }
    }
  }

  .news-area {
    height: 100%;
    .news-list {
      margin: 0;
      padding-left: 27px;
      padding: 18px 20px 18px 30px;
      li {
        padding-bottom: 15px;
        width: 100%;
        /*overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;*/
        cursor: pointer;
        display: flex;
        .spot{
          width: 8px;
          height: 8px;
          background: #67C139;
          border-radius: 50%;
          margin-right: 8px;
          vertical-align: middle;
          margin-top: 6px;
        }
        a{
          color: @comFontSizeColor;
          flex: 1;
        }
      }
      li:last-of-type{
        padding-bottom: 0;
      }
      li:hover {
        a{
          color: #3F9DFF;
        }
      }
    }
  }

  /deep/ .el-dialog__body {
    padding-top: 25px;
  }
</style>
