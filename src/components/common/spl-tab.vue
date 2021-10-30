<!--
  changeTab--切换tab触发的事件，参数obj={ active: index, item: item }
-->
<template>
  <div :class="'spl-tabs'+ type">
    <div class="spl-tabs-header display-flex">
        <span class="span-tabs" v-for="(item,index) in tabs" :key="index" :class="{active:index===splActive}"
              @click="handleClickTabs(index, item)">
          {{item}}
          <i v-show="index===splActive" class="ic-tab-active"></i>
        </span>
      <div class="flex1 pt-10 text-right pr-20">
        <slot name="btns"></slot>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'spl-tab',
  data () {
    return {
      splActive: 0
    }
  },
  props: {
    tabs: {
      type: [Array],
      default: function () {
        return []
      },
      required: true
    },
    value: {
      type: Number,
      default: 0,
      required: false
    },
    type: {
      type: Number,
      default: 0,
      required: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {},
  watch: {
    value (newValue, oldValue) {
      this.splActive = this.value
    }
  },
  created () {
    this.splActive = this.$lodash.isEmpty(this.value) ? this.value : 0
  },
  methods: {
    /* tab切换 */
    handleClickTabs (index, item) {
      this.splActive = index
      this.$emit('change', index)
      this.$emit('changeTab', { active: index, item: item })
    }
  }
}
</script>

<style lang='less' scoped>
  .spl-tabs0 {
    width: 100%;
    .spl-tabs-header {
      height: 50px;
      background: #F8F8F8;
      .span-tabs {
        position: relative;
        display: inline-block;
        min-width: 150px;
        height: 100%;
        padding: 0 15px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        .ic-tab-active {
          position: absolute;
          left: 50%;
          bottom: 0;
          margin-left: -9px;
          width: 18px;
          height: 16px;
          background: url('../../assets/images/icons/ic-account-type16.png');
        }
      }
    }
    .active {
      background: @blueColor;
      color: #fff;
    }
  }

  .spl-tabs1 {
    width: 100%;
    .spl-tabs-header {
      height: 40px;
      border-bottom: 1px solid rgba(206,206,206,1);
      .span-tabs {
        position: relative;
        display: inline-block;
        padding: 0 15px;
        min-width: 90px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        cursor: pointer;
        background:rgba(248,248,248,1);
        border:1px solid rgba(206,206,206,1);
        border-bottom: none;
        border-radius:5px 5px 0px 0px;
        margin-right: 10px;
        .ic-tab-active {
          display: none;
        }
      }
      .active {
        background: #fff;
        color: @blueColor;
        border-color: @blueColor;
        border-bottom: 1px solid #ffffff;
      }
    }
  }
</style>
