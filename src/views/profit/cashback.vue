<template>
  <div style="background: #fff;">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="返现记录" left-arrow
                 @click-left="onClickLeft">
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_share_top theme_bg">
          <van-dropdown-menu class="date_sel menu" active-color="#9B3C9D" background="none">
            <van-dropdown-item v-model="yaer" :options="yearList" @change="dateChange"/>
            <van-dropdown-item v-model="month" :options="monthList" @change="dateChange"/>
          </van-dropdown-menu>
        </div>
        <div class="cash_box">
          <div class="cash_title">
            <div class="type">类型</div>
            <div class="amount">已还金额（元）</div>
            <div class="amount">累计返现（元）</div>
          </div>
          <van-list v-model="isupLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <ul class="cash_list" v-if="profit.length>0">
              <li class="cash_item van-hairline--bottom" v-for="(item,index) in profit" :key="index">
                <div class="type">{{ item.description }}</div>
                <div class="amount">{{ item.tradeAmount |toFixed }}</div>
                <div class="theme amount">{{ item.rebate }}</div>
              </li>
            </ul>
            <van-empty class="user_empty" v-else
                       description="还没有获得返现 请前去立即推广哦">
              <van-button round @click="next('/sharePage','8')" class="bottom-button theme-linear-bg color_fff ">
                立即推广
              </van-button>
            </van-empty>
          </van-list>
        </div>

      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon, DropdownMenu, DropdownItem, List, Empty, Button
} from 'vant';
import {
  userDirectDetailQuery
} from "@/api/profit";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      yearList: [],
      yaer: '',
      month: "",
      monthList: [
        {text: "01月", value: '01'}, {text: "02月", value: '02'}, {text: "03月", value: '03'},
        {text: "04月", value: '04'}, {text: "05月", value: '05'}, {text: "06月", value: '06'},
        {text: "07月", value: '07'}, {text: "08月", value: '08'}, {text: "09月", value: '09'},
        {text: "10月", value: 10}, {text: "11月", value: 11}, {text: "12月", value: 12}
      ],
      queryType: '5',
      profit: [],
      isupLoading: false,
      finished: false,
      size: 20
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [List.name]: List,
    [Empty.name]: Empty,
    [Button.name]: Button
  },
  created() {
    this.getData()
    this._userDirectDetailQuery()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    getData() {
      var d = new Date(), nowYear = d.getFullYear(), month = d.getMonth() + 1;
      this.yaer = nowYear
      if (month <= 9) {
        month = '0' + (month)
      }
      this.month = month
      this.yearList = [
        {text: nowYear + '年', value: nowYear},
        {text: nowYear - 1 + '年', value: nowYear - 1},
        {text: nowYear - 2 + '年', value: nowYear - 2}
      ]
    },
    dateChange() {
      this._userDirectDetailQuery()
    },
    next(path, type) {
      this.$router.push({path: path});
    },
    _userDirectDetailQuery() {
      userDirectDetailQuery(String(this.yaer) + String(this.month), '1', this.queryType, this.size).then(res => {
        if (res.resp_code == '000000') {
          if (res.result.length > 0) {
            this.profit = res.result
            this.isupLoading = false;
            if (this.profit.length == this.size) {
              this.finished = false;
            } else if (this.size > this.profit.length) {
              this.finished = true;
            } else {
              this.finished = true;
            }
            this.size += 10
          } else {
            this.profit = [];
            this.finished = true
            this.isupLoading = true;
          }
        }
      })
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._userDirectDetailQuery()
        this.isLoading = false;
      }, 1000);
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this._userDirectDetailQuery()
      }, 500);
    }
  }
};

</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_share_top {
  width: 100%;
  padding: 10px 17px 25px 17px;
  font-size: 15px;
  color: #fff;
  border-radius: 0 0 20px 20px;
}

.date_sel >>> .van-dropdown-menu__bar {
  background: none;
  box-shadow: none;

}

.date_sel >>> .van-dropdown-menu__title {
  color: #fff;
}

.date_sel >>> .van-dropdown-menu__title::after {
  border-color: transparent transparent #fff #fff;
}

.cash_box {
  margin-top: -20px;
  padding: 0 10px;

}

.cash_title {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  display: flex;
  text-align: center;
  line-height: 50px;
  font-size: 13px;
  color: #666;
}

.cash_title .type {
  width: 140px;
}

.cash_title .amount {
  flex: 1;
}

.cash_list {
  padding-top: 10px
}

.cash_item {
  height: 44px;
  font-size: 12px;

  line-height: 44px;
  display: flex;
  text-align: center;

  background: #fff;
  color: #333;
}

.cash_item .type {
  width: 140px;
}

.cash_item .amount {
  flex: 1;
}

</style>
