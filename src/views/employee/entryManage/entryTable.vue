<template>
  <div class="content spl-container">
    <!-- 导航 -->
    <breadcrumb :data="pathData"></breadcrumb>
    <header class="header">
      <splTab :tabs="tabs" v-model="tabActive"></splTab>
      <div slot="header" class="header-right" v-show="tabActive==0">
        <el-button size="small" type="primary" v-show="templateInfoButtTag" @click="templateInfoButtTag = false">编辑</el-button>
        <el-button size="small" type="primary" v-show="!templateInfoButtTag" @click="updateCustomTemplate">保存</el-button>
        <el-button size="small" type="primary" v-show="!templateInfoButtTag" icon="el-icon-plus" @click="dialogVisible3=true;addGroupFrom={}">添加分类</el-button>
      </div>
      <div slot="header" class="header-right" v-show="tabActive==1">
        <el-button size="small" type="primary"  @click="clickAddMaterialBuut('')">添加</el-button>
      </div>
    </header>
    <!-- <el-button v-show="tabActive==1" class="header-right" size="small" type="primary" @click="clickAddMaterialBuut(item.uuid)">添加</el-button> -->
    <div v-show="tabActive==0">
      <el-card class="box-card pt-40">
        <p class="text-item">设置员工填写入职登记时需要提交的基础信息、紧急联系人、教育经历、工作经历等</p>
        <div v-for="(item, index) in registrationData.templateInfoArrays" :key="index">

          <div class="title-name">
            <div>
              <img class="mr-5" v-if="item.templateGroupName==='账户信息'" src="@/assets/images/icons/ic-account-type23.png" alt="">
              <img class="mr-5" v-else src="@/assets/images/icons/ic-account-type17.png" alt="">
              {{item.templateGroupName}}
            </div>
            <div>
              <el-button v-show="!templateInfoButtTag && item.templateGroupName!='基础信息' && item.templateGroupName!='银行信息' && item.templateGroupName!='附件信息'" icon="el-icon-delete" size="small" type="primary" @click="deleteGroup(item.uuid)">删除分类</el-button>
              <el-button v-show="!templateInfoButtTag && item.templateGroupName!='基础信息' && item.templateGroupName!='银行信息' && item.templateGroupName!='附件信息'" icon="el-icon-edit" class="mr-10" size="small" type="primary" @click="clickEditGroup(index)">修改分类</el-button>
              <!-- <el-button icon="el-icon-plus" class="fr" size="small" type="primary" @click="addDatumFileItem(item.uuid)">添加信息</el-button> -->
            </div>
          </div>

          <dTable :data="item.commonItemList" ref="datumFileTable" :showEmptyAll="true" :cancelMinHeight="true" :paging="false" :showIndex="false" :showSelection="false" :key="refreshKey">
            <el-table-column label="信息名称" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :inline="true" :model="registrationData.templateInfoArrays[index].commonItemList[scope.$index]" :ref="'infoForm'+index+scope.$index+'fieldName'">
                  <el-form-item class="addr-select" prop="fieldName" :rules="[{ required: true,  message: '请填写信息名称',  trigger:'blur'}]">
                    <el-input v-if="registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldType != 50008008"
                              v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldName" placeholder="请输入内容"
                              :disabled="templateInfoButtTag || registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag==0"
                              @change="checkTemplateInfo($event,index,scope.$index)"></el-input>

                    <el-select v-else
                               v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldName"
                               placeholder="请选择"
                               :disabled="templateInfoButtTag || registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag==0">
                      <el-option v-for="item in materialTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictName"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="员工看到的填表说明" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :inline="true" :model="registrationData.templateInfoArrays[index].commonItemList[scope.$index]" :ref="'infoForm'+index+scope.$index+'fieldComment'">
                  <el-form-item class="addr-select" prop="fieldComment" :rules="[{ required: true,  message: '请填写员工看到的填表说明',  trigger:'blur'}]">
                    <el-input v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldComment" placeholder="请输入内容"
                              :disabled="templateInfoButtTag || registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag==0"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            
            <el-table-column label="填写格式" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :inline="true" :model="registrationData.templateInfoArrays[index].commonItemList[scope.$index]" :ref="'infoForm'+index+scope.$index+'fieldType'">
                  <el-form-item class="addr-select" prop="fieldType" :rules="[{ required: true,  message: '请选择填写格式',  trigger:'blur'}]">
                    <el-select v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldType"
                               placeholder="请选择" :disabled="templateInfoButtTag || registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag==0"
                               @change="if(registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldType == 50008008){registrationData.templateInfoArrays[index].commonItemList[scope.$index].fieldName=''}"
                    >
                      <el-option label="文本输入框" value="50008001"></el-option>
                      <el-option label="数值输入框" value="50008002"></el-option>
                      <el-option label="日期选择框" value="50008003"></el-option>
                      <el-option label="下拉选择框" value="50008004"></el-option>
                      <el-option label="复选框" value="50008006"></el-option>
                      <el-option label="文本域" value="50008007"></el-option>
                      <el-option label="地区选择框" value="50008010"></el-option>
                      <el-option label="省市选择器" value="50008011"></el-option>
                      
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="是否必填" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-form :inline="true" :model="registrationData.templateInfoArrays[index].commonItemList[scope.$index]" :ref="'infoForm'+index+scope.$index+'mustInput'">
                  <el-form-item class="addr-select" prop="mustInput" :rules="[{ required: true,  message: '请填写是否必填',  trigger:'blur'}]">
                    <el-checkbox v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].mustInput"
                                 :disabled="templateInfoButtTag || registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag==0">是</el-checkbox>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="入职登记项" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-checkbox v-model="registrationData.templateInfoArrays[index].commonItemList[scope.$index].registItem"
                             :disabled="templateInfoButtTag">是</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button v-show="!templateInfoButtTag  && registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag!=0"
                           type="text" size="small" class="text-red"
                           @click="delDatumFileItem(item.uuid,scope.$index)">删除</el-button>
                <div v-show="(scope.row.fieldType=='下拉选择框'||scope.row.fieldType==50008004||scope.row.fieldType=='复选框'||scope.row.fieldType==50008006) && !templateInfoButtTag && registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag!=0"
                     class="opt-btn-split"></div>
                <el-button v-show="(scope.row.fieldType=='下拉选择框'||scope.row.fieldType==50008004||scope.row.fieldType=='复选框'||scope.row.fieldType==50008006) && !templateInfoButtTag && registrationData.templateInfoArrays[index].commonItemList[scope.$index].updateTag!=0"
                           type="text" size="small" @click="showSelectInfo(item.uuid,scope.$index, scope.row)">
                  设置下拉选项
                </el-button>
                <el-button v-show="(scope.row.fieldType=='下拉选择框'||scope.row.fieldType==50008004||scope.row.fieldType=='复选框'||scope.row.fieldType==50008006) && templateInfoButtTag" type="text" size="small" @click="showSelectInfo(item.uuid,scope.$index, scope.row)">
                  显示下拉选项
                </el-button>
              </template>
            </el-table-column>
          </dTable>
          <div class="add-method f-cursor" @click="addDatumFileItem(item.uuid)" v-show="!templateInfoButtTag"><i class="el-icon-plus mr-10"></i> 添加信息</div>

        </div>
      </el-card>
    </div>
    <div v-show="tabActive==1">
      <el-card class="box-card pt-40">
        <p class="text-item">设置员工填写入职登记时需要提交的材料附件，包括身份证原件复印件、个人证件照、学历证明等</p>
        <div v-for="(item, index) in registrationData.registrationArrays" :key="index">
          <div class="mt-10 mb-10" style="display:flex; align-items: center; font-size:16px; font-weight: bold;">
            <img class="mr-5" v-if="item.templateGroupName==='账户信息'" src="@/assets/images/icons/ic-account-type23.png" alt="">
            <img class="mr-5" v-else src="@/assets/images/icons/ic-account-type17.png" alt="">
            {{item.templateGroupName}}
          </div>
          <dTable :data="item.commonItemList" ref="datumFileTable" :showEmptyAll="true" :cancelMinHeight="true" :paging="false" :showIndex="false" :showSelection="false">
            <el-table-column label="材料名称" prop="fieldName" min-width="300" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="员工看到的填表说明" prop="fieldComment" min-width="300" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="是否必填" prop="mustInput" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p v-if="scope.row.mustInput==true">是</p>
                <p v-else>否</p>
              </template>
            </el-table-column>
            <el-table-column label="入职登记项" prop="registItem" min-width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p v-if="scope.row.registItem==true">是</p>
                <p v-else>否</p>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="clickEditMaterialBuut(item.uuid,scope.row.id)" v-show="!templateInfoButtTag && scope.row.updateTag!=0">编辑</el-button>
                <div class="opt-btn-split" v-show="!templateInfoButtTag && scope.row.updateTag!=0"></div>
                <el-button type="text" size="small" class="text-red" @click="deleteMaterialItem(scope.row.uuid)" v-show="!templateInfoButtTag && scope.row.updateTag!=0">删除</el-button>
              </template>
            </el-table-column>
          </dTable>
          <!--          <div class="add-method f-cursor" @click="clickAddMaterialBuut(item.uuid)" v-show="!templateInfoButtTag"><i class="el-icon-plus mr-10"></i> 添加信息</div>-->
        </div>
      </el-card>
    </div>

    <!--添加||编辑分类-->
    <el-dialog :title="addGroupFrom.groupUuid==null || addGroupFrom.groupUuid==''?'添加分类':'编辑分类'" :visible.sync="dialogVisible3" width="30%" :before-close="handleClose" :close-on-click-modal="false"
               :show-close="false">
      <el-form ref="addGroupFrom" :model="addGroupFrom" label-width="80px">
        <el-form-item label="分类名称:">
          <el-input style="width:260px;" placeholder="请输入分类名称" v-model="addGroupFrom.groupName"></el-input>
        </el-form-item>
        <el-form-item label="是否多项:">
          <el-checkbox v-model="addGroupFrom.isRepeat">是</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-left:0px; text-align:center;">
          <el-button class="mr-60" size="small" @click="dialogVisible3 = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveOrUpdateGroup()">确 认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--添加入职材料-->
    <el-dialog title="添加入职材料" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose" :close-on-click-modal="false" :show-close="false">
      <el-form ref="addInfoItemFrom" :model="addInfoItemFrom" label-width="auto">

        <el-form-item label="材料名称：">
          <el-select class="w-260" v-model="addInfoItemFrom.fieldName" placeholder="请选择">
            <el-option v-for="item in materialTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="员工看到的填表说明：">
          <el-input :rows="4" placeholder="请填写" class="w-260" type="textarea" v-model="addInfoItemFrom.fieldComment"></el-input>
        </el-form-item>

        <el-form-item label="是否必填：">
          <el-radio-group v-model="addInfoItemFrom.mustInput">
            <el-radio label="MUST">是</el-radio>
            <el-radio label="OPTIONAL">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否入职登记项：">
          <el-radio-group v-model="addInfoItemFrom.registItem">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="mr-30" size="small" @click="dialogVisible1 = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveOrUpdateMaterialItem(addInfoItemFrom)">确 认</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--编辑入职材料-->
    <el-dialog title="编辑入职材料" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose" :close-on-click-modal="false" :show-close="false">
      <el-form ref="editInfoItemFrom" :model="editInfoItemFrom" label-width="auto">
        <el-form-item label="材料名称：">
          <el-select class="w-260" v-model="editInfoItemFrom.fieldName" placeholder="请选择">
            <el-option v-for="item in materialTypes" :key="item.dictCode" :label="item.dictName" :value="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工看到的填表说明：">
          <el-input :rows="4" class="w-260" type="textarea" v-model="editInfoItemFrom.fieldComment"></el-input>
        </el-form-item>
        <el-form-item label="是否必填：">
          <el-radio-group v-model="editInfoItemFrom.mustInput">
            <el-radio label="MUST">是</el-radio>
            <el-radio label="OPTIONAL">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否入职登记项：">
          <el-radio-group v-model="editInfoItemFrom.registItem">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="mr-30" size="small" @click="dialogVisible2 = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveOrUpdateMaterialItem(editInfoItemFrom)">确 认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--展示下拉框值-->
    <el-drawer style="" size="466px" :title="selectItemTitleName" :visible.sync="drawer" :before-close="handleClose" custom-class="setInputSelect-drawer">
      <template>
        <el-form :model="selectItemForm" ref="selectItemForm" label-width="">
           
          <p class="value-scope-title">选择值的来源：</p>
          <div class="ml-20">
            <el-form-item label="" prop="selectItemSource" :rules="[{ required: true, message: '请选择值的来源', trigger: 'change'}]">
              <el-radio-group v-model="selectItemForm.selectItemSource" @change="changeSelectItemSource">
                <el-radio :label="1" :disabled="templateInfoButtTag">从系统取值</el-radio>
                <el-radio :label="2" :disabled="templateInfoButtTag">自行输入</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          
           
          <div class="ml-20 mt-15" v-if="selectItemForm.selectItemSource==1">
            <p class="mb-10">请选择来源项：</p>
            <el-form-item label="" prop="selectSysSource" :rules="[{ required: true, message: '请选择来源项', trigger: 'change'}]">
              <el-select v-model="selectItemForm.selectSysSource" placeholder="请选择" :disabled="templateInfoButtTag" @change="changeSelectSysSource">
                <el-option v-for="item in selectSysSourceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
           </el-form-item>
          </div>
         
        </el-form>

        <p class="value-scope-title value-scope-title2">取值范围</p>
        <div class="setInputSelect-div" v-if="selectItemForm.selectItemSource==1">
          <div v-for="(item,index) in inputValuesList" :key="index" class="setInputSelect">
            <el-input style="" v-model="item.dictName" :disabled="templateInfoButtTag" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="setInputSelect-div" v-if="selectItemForm.selectItemSource==2">
          <div v-for="(item,index) in inputValuesList" :key="index" class="setInputSelect">
            <el-input style="" v-model="item.inputValue" :disabled="templateInfoButtTag" placeholder="请输入内容"></el-input>
          </div>
        </div>
        
        <div class="mt-50 mb-20 text-center" v-show="!templateInfoButtTag">
          <el-button class="mr-60" size="small" @click="addInputValue" :disabled="selectItemForm.selectItemSource==1">添加</el-button>
          <el-button size="small" type="primary" @click="checkSaveInputValue">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
  import dTable from '../../../components/common/table'
  import splTab from '../../../components/common/spl-tab'
  import addrSelector from '../../../components/common/addrSelector'
  import {accMul, calFee, getAccfundAmount, getSocialCyleAmount, accAdd2} from '../../../utils/socialAccfundProduct'

  export default {
    components: {dTable, splTab, addrSelector},
    data() {
      return {
        spanRow: 8,
        pathData: [
          {name: '入离职管理'},
          {name: '入职登记表'}
        ],
        tabs: ['入职登记表', '入职材料'],
        tabActive: 0,
        datumFileTableData: [],
        registrationData: {
          templateInfoArrays: [],
          registrationArrays: []
        },
        templateInfoButtTag: true,
        options: [
          {code: 50008001, name: '文本输入框'},
          {code: 50008002, name: '数值输入框'},
          {code: 50008003, name: '日期选择框'},
          {code: 50008004, name: '下拉选择框'},
          {code: 50008005, name: '单选框'},
          {code: 50008006, name: '复选框'},
          {code: 50008007, name: '文本域'},
          {code: 50008008, name: '文件上传'},
          {code: 50008009, name: '系统取值'},
          {code: 50008010, name: '地区选择框'},
          {code: 50008011, name: '省市选择器'}
        ],
        dialogVisible1: false,
        addInfoItemFrom: {
          createId: '',
          createName: '',
          customerId: this.$store.state.userData.custId,
          fieldComment: '',
          fieldName: '',
          fieldType: 50008008,
          groupName: '',
          mustInput: 'MUST',
          templateGroupUuid: '',
          uuid: ''
        },
        dialogVisible2: false,
        editInfoItemFrom: {},

        drawer: false,
        inputValuesList: [],
        selectItemTitleName: '',
        selectItemGroupUuid: '',
        selectItemUuid: '',
        selectItemIndex: 0,
        selectItemForm: {
          selectItemSource: '', 
          selectSysSource: ''
        },
        selectSysSourceList: [],

        dialogVisible3: false,
        addGroupFrom: {
          groupUuid: '',
          groupName: '',
          isRepeat: ''
        },
        refreshKey: new Date().getTime(),
        materialTypes: [],
        templateInfoInitChange: false
      }
    },
    computed: {
      tableHeight: function () {
        return this.$global.bodyHeight - 400 + 'px'
      }
    },
    watch: {
      tabActive: function (val) {
        let that = this;
        if (val !== undefined) {
          console.info(that.tabActive)
          if (that.tabActive == 1 && that.templateInfoInitChange) {
            that.$confirm('"入职登记表"中存在未保存的项, 是否保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.tabActive = 0
              that.updateCustomTemplate()
            }).catch(() => {
              that.$message.success("已取消保存")
            });
          }
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.getRegistrationData()
        this.getMaterialType()
        this.getSysDict()
      })
    },
    methods: {
      // 获取表格数据
      getRegistrationData() {
        console.info('temp')
        let that = this
        that.$http({
          url: '/api/entryresign/registration/getRegistrationData',
          method: 'post'
          // data: {custId: this.$store.state.userData.custId}
        }).then(({data}) => {
          let resultData = data.data[0]
          that.templateInfoInitChange = false;
          // 非附件编辑
          var templateInfoArrays = []
          // 附件编辑
          var registrationArrays = []
          for (let i = 0; i < resultData.length; i++) {
            let element = resultData[i]
            let commonItemList = element.commonItemList
            for (let j = 0; j < commonItemList.length; j++) {
              let b = commonItemList[j].registItem == 1
              commonItemList[j].registItem = b
              if (commonItemList[j].mustInput!=null && commonItemList[j].mustInput=='MUST'){
                commonItemList[j].mustInput = true
              }else {
                commonItemList[j].mustInput = false
              }
              for (let k = 0; k < that.options.length; k++) {
                let option = that.options[k]
                if (option.code == commonItemList[j].fieldType) {
                  commonItemList[j].fieldType = option.name
                }
              }
              commonItemList[j].registItem.fieldType
            }
            element.commonItemList = commonItemList
            if (commonItemList.length>0 && commonItemList[0].fieldType == '文件上传') {
              registrationArrays.push(element)
            } else {
              templateInfoArrays.push(element)
            }
          }
          that.registrationData.registrationArrays = registrationArrays
          that.registrationData.templateInfoArrays = templateInfoArrays
          that.templateInfoInitLength = templateInfoArrays.length
          that.refreshKey = new Date().getTime()
          console.info(that.registrationData)
        })
      },

      // 入职登记表-保存入职登记表
      updateCustomTemplate() {
        let that = this
        let infoFormValid = true
        // 校验自定义字段
        let templateInfoArrays = that.registrationData.templateInfoArrays
        for (let i = 0; i < templateInfoArrays.length; i++) {
          let commonItemList = templateInfoArrays[i].commonItemList
          for (let j = 0; j < commonItemList.length; j++) {
            that.$refs['infoForm' + i + j + 'fieldName'][0].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            that.$refs['infoForm' + i + j + 'fieldName'][1].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            that.$refs['infoForm' + i + j + 'fieldComment'][0].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            that.$refs['infoForm' + i + j + 'fieldComment'][1].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            that.$refs['infoForm' + i + j + 'fieldType'][0].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            that.$refs['infoForm' + i + j + 'fieldType'][1].validate((valid) => {
              if (infoFormValid) {
                infoFormValid = valid
              }
            })
            // that.$refs['infoForm' + i + j + 'mustInput'][0].validate((valid) => {
            //   if (infoFormValid) {
            //     infoFormValid = valid
            //   }
            // })
            // that.$refs['infoForm' + i + j + 'mustInput'][1].validate((valid) => {
            //   if (infoFormValid) {
            //     infoFormValid = valid
            //   }
            // })
          }
        }
        console.info(infoFormValid)
        if (infoFormValid) {
          var resultList = []
          let templateInfoArrays = that.registrationData.templateInfoArrays
          templateInfoArrays.forEach((templateInfo, i)=>{
            let commonItemList = templateInfo.commonItemList
            commonItemList.forEach((commonItem, j)=>{
                let number = commonItem.registItem == true ? 1 : 0
                commonItem.registItem = number
                // let updateTag = commonItem.updateTag == null || commonItem.updateTag == '' ? 1 : commonItem.updateTag;
                // commonItem.updateTag = 0
                if (commonItem.mustInput!=null && commonItem.mustInput==true){
                  commonItem.mustInput = 'MUST'
                }else {
                  commonItem.mustInput = 'OPTIONAL'
                }
                for (let k = 0; k < that.options.length; k++) {
                  let option = that.options[k];
                  if (option.name == commonItem.fieldType) {
                    commonItem.fieldType = option.code
                  }
                }
              })
            resultList = resultList.concat(commonItemList)
          })


          let registrationArrays = that.registrationData.registrationArrays;
          registrationArrays.forEach((registration, i)=>{
            let commonItemList = registration.commonItemList
            commonItemList.forEach((commonItem, i)=>{
              let number = commonItem.registItem == true ? 1 : 0
              commonItem.registItem = number
              // let updateTag = commonItem.updateTag == null || commonItem.updateTag == '' ? 1 : commonItem.updateTag;
              // commonItem.updateTag = updateTag
              for (let k = 0; k < that.options.length; k++) {
                let option = that.options[k];
                if (option.name == commonItem.fieldType) {
                  commonItem.fieldType = option.code
                }
              }
            })
            resultList = resultList.concat(commonItemList)
          })


          that.$http({
            url: '/api/entryresign/registration/saveRegistration',
            method: 'post',
            data: resultList
          }).then(({data}) => {
            console.info(data)
            that.getRegistrationData()
            this.$message.success('保存成功')
            that.templateInfoButtTag = true
          })
        }
      },
      // 新增资料
      addDatumFileItem(groupUuid) {
        let that = this
        console.info(groupUuid)
        console.info(that.registrationData)
        let templateInfoArrays = that.registrationData.templateInfoArrays
        for (let i = 0; i < templateInfoArrays.length; i++) {
          let templateInfo = templateInfoArrays[i]
          if (templateInfo.uuid == groupUuid) {
            templateInfo.commonItemList.push({
              createId: '',
              createName: '',
              createTime: '',
              customerId: that.$store.state.userData.custId,
              dataType: '',
              fieldComment: '',
              fieldName: '',
              fieldType: '',
              groupName: templateInfo.templateGroupName,
              id: '',
              inputValuesList: [],
              isEdit: '',
              materialsItems: '',
              mustInput: false,
              registItem: '',
              selectOptions: '',
              templateGroupUuid: groupUuid,
              updateId: '',
              updateName: '',
              updateTag: 1,
              updateTime: '',
              uuid: '',
              value: '',
              valueFrom: '',
              fromValue: ''
            })
            that.templateInfoInitChange = true;
          }
        }
        that.registrationData.templateInfoArrays = templateInfoArrays
      },
      // 删除资料
      delDatumFileItem(groupId, index) {
        console.info(groupId, index)
        this.$confirm('此操作将删除资料, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let templateInfoArrays = this.registrationData.templateInfoArrays
          for (let i = 0; i < templateInfoArrays.length; i++) {
            let templateInfo = templateInfoArrays[i]
            if (templateInfo.uuid == groupId) {
              let commonItemList = templateInfo.commonItemList
              commonItemList.splice(index, 1)
              that.templateInfoInitChange = true;
              this.$message.success('删除成功')
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 入职材料项 编辑按钮
      clickEditMaterialBuut(groupId, itemId) {
        let that = this
        let registrationArrays = that.registrationData.registrationArrays
        for (let i = 0; i < registrationArrays.length; i++) {
          let registration = registrationArrays[i]
          if (registration.uuid == groupId) {
            let commonItemList = registration.commonItemList
            for (let j = 0; j < commonItemList.length; j++) {
              let commonItem = commonItemList[j]
              if (commonItem.id == itemId) {
                // that.editInfoItemFrom = {
                //   createId: commonItem.createId,
                //   createName: commonItem.createName,
                //   customerId: that.$store.state.userData.custId,
                //   fieldComment: commonItem.fieldComment,
                //   fieldName: commonItem.fieldName,
                //   fieldType: commonItem.fieldType,
                //   groupName: commonItem.groupName,
                //   mustInput: commonItem.mustInput,
                //   templateGroupUuid: commonItem.templateGroupUuid,
                //   uuid: commonItem.uuid,
                //   registItem: commonItem.registItem
                // }
                this.$set(that.editInfoItemFrom, 'createId', commonItem.createId)
                this.$set(that.editInfoItemFrom, 'createName', commonItem.createName)
                this.$set(that.editInfoItemFrom, 'customerId', that.$store.state.userData.custId)
                this.$set(that.editInfoItemFrom, 'fieldComment', commonItem.fieldComment)
                this.$set(that.editInfoItemFrom, 'fieldName', commonItem.fieldName)
                this.$set(that.editInfoItemFrom, 'fieldType', commonItem.fieldType)
                this.$set(that.editInfoItemFrom, 'groupName', commonItem.groupName)
                let mustInput = commonItem.mustInput!=null &&  commonItem.mustInput== true ? 'MUST':'OPTIONAL';
                this.$set(that.editInfoItemFrom, 'mustInput', mustInput)
                this.$set(that.editInfoItemFrom, 'templateGroupUuid', commonItem.templateGroupUuid)
                this.$set(that.editInfoItemFrom, 'uuid', commonItem.uuid)
                this.$set(that.editInfoItemFrom, 'registItem',  commonItem.registItem == true ? '1':'0')
                this.$set(that.editInfoItemFrom, 'updateTag',  commonItem.updateTag)
                that.dialogVisible2 = true
              }
            }
          }
        }
      },
      // 入职材料项 新增按钮
      clickAddMaterialBuut(groupId) {
        console.info(groupId)
        let that = this
        that.addInfoItemFrom = {}//清空
        // that.addInfoItemFrom.fieldType = '50008008'
        // that.addInfoItemFrom.mustInput = 'MUST'
        // that.addInfoItemFrom.customerId = that.$store.state.userData.custId
        // that.addInfoItemFrom.registItem = 1
        this.$set(that.addInfoItemFrom, 'fieldType', '50008008')
        this.$set(that.addInfoItemFrom, 'mustInput', "MUST")
        this.$set(that.addInfoItemFrom, 'customerId', that.$store.state.userData.custId)
        this.$set(that.addInfoItemFrom, 'registItem', '0')
        this.$set(that.addInfoItemFrom, 'updateTag', 1)
        if (groupId != null && groupId != '') {
          // that.addInfoItemFrom.templateGroupUuid = groupId
          this.$set(that.addInfoItemFrom, 'templateGroupUuid', groupId)
          let registrationArrays = that.registrationData.registrationArrays
          for (let i = 0; i < registrationArrays.length; i++) {
            let registration = registrationArrays[i]
            if (registration.uuid == groupId) {
              // that.addInfoItemFrom.groupName = registration.templateGroupName
              this.$set(that.addInfoItemFrom, 'groupName', registration.templateGroupName)
            }
          }
        } else {
          // that.addInfoItemFrom.templateGroupUuid = ''
          // that.addInfoItemFrom.groupName = ''
          this.$set(that.addInfoItemFrom, 'templateGroupUuid', '')
          this.$set(that.addInfoItemFrom, 'groupName', '')
          if (that.registrationData != null && that.registrationData.registrationArrays != null && that.registrationData.registrationArrays.length > 0) {
            // that.addInfoItemFrom.templateGroupUuid = that.registrationData.registrationArrays[0].uuid
            // that.addInfoItemFrom.groupName = that.registrationData.registrationArrays[0].templateGroupName
            this.$set(that.addInfoItemFrom, 'templateGroupUuid', that.registrationData.registrationArrays[0].uuid)
            this.$set(that.addInfoItemFrom, 'groupName', that.registrationData.registrationArrays[0].templateGroupName)
          }
        }
        that.dialogVisible1 = true
        console.info(that.addInfoItemFrom)
      },
      // 入职登记表-新增/修改入职材料项
      saveOrUpdateMaterialItem(params) {
        console.info(params)
        params.fieldType = '50008008'
        params.registItem ==true? 1:0;
        let that = this
        let registrationArrays = that.registrationData.registrationArrays
        for (let i = 0; i < registrationArrays.length; i++) {
          let registration = registrationArrays[i];
          let commonItemList = registration.commonItemList;
          // for (let j = 0; j < commonItemList.length; j++) {
          //   let commonItem = commonItemList[j];
          //   if (commonItem.uuid == params.uuid && registration.uuid == params.templateGroupUuid) {
          //     continue;
          //   }
          //   if (commonItem.fieldName == params.fieldName) {
          //     that.$message.warning('字段名称“' + params.fieldName + '”重复')
          //     return
          //   }
          // }
        }

        that.$http({
          url: '/api/entryresign/registration/saveOrUpdateMaterialItem',
          method: 'post',
          data: params
        }).then(({data}) => {
          // let resultData = data.data[0];
          console.info(data)
          that.getRegistrationData()
          that.handleClose()
          this.$message.success('保存成功')
        })
      },
      // 入职登记表-删除入职材料项
      deleteMaterialItem(itemId) {
        console.info(itemId)
        let that = this
        this.$confirm('此操作将删除入职材料项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http({
            url: '/api/entryresign/registration/deleteMaterialItem?uuid=' + itemId,
            method: 'post'
            // data: {uuid: itemId}
          }).then(({data}) => {
            // let resultData = data.data[0];
            console.info(data)
            that.getRegistrationData()
            that.handleClose()
            this.$message.success('删除成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      getOptions(code) {
        let that = this
        for (let i = 0; i < that.options.length; i++) {
          if (that.options[i].code = code) {
            return that.options[i].name
          }
        }
      },

      //入职登记表-获取附件类型
      getMaterialType() {
        this.$http({
          url: '/api/entryresign/registration/getMaterialType',
          method: 'post'
        }).then(({data}) => {
          console.info(data.data[0])
          this.materialTypes = data.data[0]
        })
      },

      handleClose() {
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.drawer = false
        this.$refs.selectItemForm.resetFields()
      },
      // 展示下拉选择项
      showSelectInfo(groupId, index, row) {
        console.info(groupId, index)
        let that = this
        that.selectItemGroupUuid = groupId
        that.selectItemIndex = index
        that.selectItemForm.selectItemSource = row.valueFrom==''||row.valueFrom==null?'':row.valueFrom
        // valueFrom:1-系统取值，2-自行输入
        that.selectItemForm.selectSysSource = row.valueFrom==1?row.fromValue:''
        if(that.selectItemForm.selectItemSource==1){
          that.changeSelectSysSource()
        }else if(that.selectItemForm.selectItemSource==2){
          that.selectItemUuid = row.uuid
          that.inputValuesList = row.inputValuesList
          //let templateInfoArrays = that.registrationData.templateInfoArrays
           //for (let i = 0; i < templateInfoArrays.length; i++) {
             // //let templateInfo = templateInfoArrays[i]
             //if (templateInfo.uuid == groupId) {
               //let commonItemList = templateInfo.commonItemList
               //let commonItem = commonItemList[index]
               //that.selectItemUuid = commonItem.uuid
               //if (commonItem.inputValuesList == null || commonItem.inputValuesList == '') {
                 //that.inputValuesList = []
               //} else {
                 //that.inputValuesList = commonItem.inputValuesList
               //}
             //}
           //}
        }
        
        if (that.templateInfoButtTag) {
          that.selectItemTitleName = '【' + row.fieldName + '】下拉值范围'
          } else {
          that.selectItemTitleName = '编辑【' + row.fieldName + '】下拉值范围'
        }
        that.drawer = true
      },
      // 添加下拉值
      addInputValue() {
        let that = this
        that.inputValuesList.push({
          createId: '',
          createName: '',
          createTime: '',
          id: '',
          inputValue: '',
          templateUuid: '',
          uuid: that.selectItemUuid
        })
      },
      // 保存-校验
       checkSaveInputValue() {
        let that = this
        this.$refs.selectItemForm.validate((valid) => {
          if(valid){
            that.saveInputValue()
          }
        })
       },
      // 保存
      saveInputValue() {
        let that = this
       
        let templateInfoArrays = that.registrationData.templateInfoArrays
        var inputValuesList = []
        var inputValuesListArr = []
        let item = null
        if(that.selectItemForm.selectItemSource==1){
          // 系统取值
          inputValuesList = that.inputValuesList
        }else if(that.selectItemForm.selectItemSource==2){
          // 自行输入
          for (let j = 0; j < that.inputValuesList.length; j++) {
          item = that.inputValuesList[j]
          if(item.inputValue !=''&&inputValuesListArr.indexOf(item.inputValue)<0){
            inputValuesListArr.push(item.inputValue)
            inputValuesList.push(item)
          }
        }
        }
       
        for (let i = 0; i < templateInfoArrays.length; i++) {
          let templateInfo = templateInfoArrays[i]
          if (templateInfo.uuid == that.selectItemGroupUuid) {
            that.registrationData.templateInfoArrays[i].commonItemList[that.selectItemIndex].inputValuesList = inputValuesList
            that.registrationData.templateInfoArrays[i].commonItemList[that.selectItemIndex].valueFrom = that.selectItemForm.selectItemSource
            that.registrationData.templateInfoArrays[i].commonItemList[that.selectItemIndex].fromValue = that.selectItemForm.selectSysSource
          }
        }
        that.drawer = false
      },
      // 新增/修改分组类别
      saveOrUpdateGroup() {
        let that = this
        let number = that.addGroupFrom.isRepeat == true ? 1 : 0
        that.addGroupFrom.isRepeat = number
        that.$http({
          url: '/api/entryresign/registration/saveOrUpdateGroup',
          method: 'post',
          data: that.addGroupFrom
        }).then(({data}) => {
          console.info(data)
          that.handleClose()
          that.getRegistrationData()

          if (that.addGroupFrom.groupUuid == null || that.addGroupFrom.groupUuid == '') {
            that.$message.success('添加分组成功')
          } else {
            that.$message.success('编辑分组成功')
          }
          that.addGroupFrom = {}
        })
      },
      // 入职登记表-删除分组类别
      deleteGroup(groupUuid) {
        let that = this
        this.$confirm('此操作将删除分组类别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http({
            url: '/api/entryresign/registration/deleteGroup?groupUuid=' + groupUuid,
            method: 'post'
            // data: {groupUuid:groupUuid}
          }).then(({data}) => {
            console.info(data)
            that.handleClose()
            that.getRegistrationData()
            that.$message.success('删除分组成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      // 入职登记表-点击编辑分组类别
      clickEditGroup(groupIndex) {
        let that = this
        let number = that.addGroupFrom.isRepeat == true ? 1 : 0
        let templateInfo = that.registrationData.templateInfoArrays[groupIndex]
        let isRepeat = templateInfo.isRepeat == 1 ? true : false;
        this.$set(that.addGroupFrom, 'isRepeat', isRepeat)
        this.$set(that.addGroupFrom, 'groupName', templateInfo.templateGroupName)
        this.$set(that.addGroupFrom, 'groupUuid', templateInfo.uuid)
        // that.addGroupFrom.isRepeat = isRepeat
        // that.addGroupFrom.groupName = templateInfo.templateGroupName
        // that.addGroupFrom.groupUuid = templateInfo.uuid
        that.dialogVisible3 = true
      },
      //判断字段是否重复
      checkTemplateInfo(val, groupIndex, itemIndex) {
        console.info(val)
        let that = this
        let templateInfoArrays = that.registrationData.templateInfoArrays
        for (let i = 0; i < templateInfoArrays.length; i++) {
          let templateInfo = templateInfoArrays[i];
          let commonItemList = templateInfo.commonItemList;
          for (let j = 0; j < commonItemList.length; j++) {
            if (i == groupIndex && j == itemIndex) {
              continue;
            }
            let commonItem = commonItemList[j];
            if (commonItem.fieldName == val) {
              that.$message.warning('字段名称“' + val + '”重复')
              return
            }
          }
        }
      },

      //入职登记表-设置下拉框-获取系统取值下拉
      getSysDict() {
        this.$http({
          url: '/api/entryresign/registration/getSysDict',
          method: 'post'
        }).then(({data}) => {
          console.info(data.data[0])
          this.selectSysSourceList = data.data[0]
        })
      },

      //<!-- 改变-设置下拉框-系统取值下拉 -->
      changeSelectSysSource(){
        for(let k=0;k<this.selectSysSourceList.length;k++){
          if(this.selectSysSourceList[k].code==this.selectItemForm.selectSysSource){
            this.inputValuesList = this.selectSysSourceList[k].list
          }
        }
      },
      changeSelectItemSource (){
        this.inputValuesList = []
        this.selectItemForm.selectSysSource = ""
      }
    },
    filters: {
      filterAmount(base, feeRatio, calAccuCode) {
        let res = calFee(base, feeRatio, calAccuCode)
        return res
      }
    }
  }
</script>

<style scoped lang="less">
  .content {
    position: relative;

    .handle-btn {
      height: 50px;
      background: #f2f2f2;
      line-height: 50px;
    }

    .search-l {
      width: 60%;
      max-width: 750px;
      min-width: 600px;
    }

    .search-l-input {
      min-width: 370px;
    }

    /deep/ .el-table {
      margin-top: 0;
    }

    .header {
      .header-right {
        position: fixed;
        right: 30px;
        top: 169px;
        z-index: 999;
      }
    }

    .title-name {
      display: flex;
      justify-content: space-between;
      height: 55px;
      line-height: 55px;
      font-size: 16px;
      font-weight: bold;
    }

    .add-method {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed #ddd;
      background: #fff;
      position: relative;
    }

    /deep/ .spl-tabs0 {
      position: fixed;
      z-index: 999;
    }
  }

  /deep/ .value-scope-title {
    margin: 15px 20px 10px 20px;
    text-align: left;
    font-size: 14px;
    color: #222222;
  }
  /deep/ .value-scope-title2 {
    margin: 20px 0;
    text-align: center;
  }

  /deep/ .el-drawer.rtl {
    overflow-y: scroll;
  }
  .setInputSelect-div{
    max-height: 400px;
    overflow: auto;
  }
  .setInputSelect{
    width: 426px;
    margin-bottom: 10px;
    margin-left: 20px;
  }
  /deep/.setInputSelect-drawer{
    padding-top: 60px;
    .el-drawer__header{
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #DDDDDD;
        font-size: 16px;
        color: #222222;
        padding-top: 0;
        margin-bottom: 0;
    }
    .el-drawer__header > :first-child:focus, .el-drawer__header > span[role='heading']:focus{
      outline: none;
    }
    .el-drawer__close-btn:focus {
      outline: none;
    }
  }
  /deep/.setInputSelect-drawer:focus{
    outline: none;
  }
  
  
</style>
