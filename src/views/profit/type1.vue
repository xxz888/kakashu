<template>
  <div style="background: #fff">
    <van-nav-bar
      class="agent_nav theme_bg"
      style="background: none"
      :border="false"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      loading-text="加载中..."
    >
      <div>
        <div class="profit_type_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">{{ title }}（元）</div>
                <div class="amount">
                  {{ profitNew.totalRebateTotal | toFixed }}
                </div>
              </div>
              <div class="right"></div>
            </li>
            <li class="item">
              <div class="left">
                <div class="title">当日收益（元）</div>
                <div class="profit_amount">
                  {{ profitNew.todayRebateTotal | toFixed }}
                </div>
              </div>
              <div class="right">
                <div class="title">当月收益（元）</div>
                <div class="profit_amount">
                  {{ profitNew.monthRebateTotal | toFixed }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <div class="profit_type_top">
            <div class="profit_type_top_bg">
              <van-dropdown-menu
                class="date_sel menu"
                active-color="#9B3C9D"
                background="none"
              >
                <van-dropdown-item
                  v-model="yaer"
                  :options="yearList"
                  @change="dateChange"
                />
                <van-dropdown-item
                  v-model="month"
                  :options="monthList"
                  @change="dateChange"
                />
              </van-dropdown-menu>
            </div>
          </div>
          <ul class="profit_type_date">
            <li class="item van-hairline--bottom">
              <div>类型</div>
              <div class="type">金额(元)</div>
              <div class="type">分润(元)</div>
              <p class="right"></p>
            </li>

            <li class="item van-hairline--bottom"
                @click="next('profitTypeDetail', 4, 1, '线下花呗')"

            >
              <div class="type">线下花呗</div>
              <div>{{ profitNew.direc1.amount | toFixed }}</div>
              <div class="active">{{ profitNew.direc1.rebate | toFixed }}</div>
              <p class="right">
                <van-icon name="arrow" />
              </p>
            </li>
            <li class="item van-hairline--bottom"
                 @click="next('profitTypeDetail', 5, 1, '京东白条')"
            >
              <div class="type">京东白条</div>
              <div>{{ profitNew.direc2.amount | toFixed }}</div>
              <div class="active">{{ profitNew.direc2.rebate | toFixed }}</div>
              <p class="right">
                <van-icon name="arrow" />
              </p>
            </li>


               <li class="item van-hairline--bottom">
              <div class="type">信用申卡</div>
              <div>0.00</div>
              <div class="active">0.00</div>
              <p class="right">
                <van-icon name="arrow" />
              </p>
            </li>

             <li class="item van-hairline--bottom">
              <div class="type">积分兑换</div>
              <div>0.00</div>
              <div class="active">0.00</div>
              <p class="right">
                <van-icon name="arrow" />
              </p>
            </li>

             <li class="item van-hairline--bottom">
              <div class="type">在线商场</div>
              <div>0.00</div>
              <div class="active">0.00</div>
              <p class="right">
                <van-icon name="arrow" />
              </p>
            </li>
          </ul>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { NavBar, PullRefresh, Icon, DropdownMenu, DropdownItem } from "vant";
import { profitSumQuery } from "@/api/profit";
import { getTurnoverTotal, getTotalCurrent } from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      phone: localStorage.getItem("phone"),
      isLoading: false,
      fuwuList: [],
      queryType: 6, //1:快捷,2:余额还款,3:空卡还款,6:花呗
      title: "刷卡",
      yearList: [],
      yaer: "",
      month: "",
      monthList: [
        {
          text: "01月",
          value: "01",
        },
        {
          text: "02月",
          value: "02",
        },
        {
          text: "03月",
          value: "03",
        },
        {
          text: "04月",
          value: "04",
        },
        {
          text: "05月",
          value: "05",
        },
        {
          text: "06月",
          value: "06",
        },
        {
          text: "07月",
          value: "07",
        },
        {
          text: "08月",
          value: "08",
        },
        {
          text: "09月",
          value: "09",
        },
        {
          text: "10月",
          value: 10,
        },
        {
          text: "11月",
          value: 11,
        },
        {
          text: "12月",
          value: 12,
        },
      ],
      profit: {
        direc1: {
          amount: 0,
          rebate: 0,
        },
        direc2: {
          amount: 0,
          rebate: 0,
        },
        direc3: {
          amount: 0,
          rebate: 0,
        },
        monthRebate: 0,
        todayRebate: 0,
        totalRebate: 0,
      },
      profitNew: {
        direc1: {
          amount: 0,
          rebate: 0,
        },
        direc2: {
          amount: 0,
          rebate: 0,
        },
        direc3: {
          amount: 0,
          rebate: 0,
        },
        monthRebate: 0,
        todayRebate: 0,
        totalRebate: 0,

        monthRebate1: 0,
        todayRebate1: 0,
        totalRebate1: 0,

        monthRebateTotal: 0,
        todayRebateTotal: 0,
        totalRebateTotal: 0,
      },
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  computed: {},
  created() {
    this.title = JSON.parse(this.$route.params.title);
    this.title = "增值总收益";
    
    this.queryType = JSON.parse(this.$route.params.level);
    this.getData();
    // this._profitSumQuery()
    this._getTurnoverTotal(7);
    this._getTurnoverTotal(8);
    this._getTotalCurrent(7);
    this._getTotalCurrent(8);
  },
  methods: {
    //收益统计
    _getTurnoverTotal(value) {
  
      var dic = {
        types: value == 7 ? ["71", "72", "73", "74"] : ["81", "82", "83", "84"],
        queryDate: String(this.yaer) + String(this.month),
      };
      getTurnoverTotal(dic).then((res) => {
        if (res.resp_code == "000000") {
          if (JSON.stringify(res.result) != "{}") {
            var type1 = value == 7 ? "T71" : "T81";
            var type2 = value == 7 ? "T72" : "T82";

            var amountTotal1 = 0;
            var profitTotal1 = 0;
            var amountTotal2 = 0;
            var profitTotal2 = 0;
        

            if (res.result[type1] && res.result[type1].amountTotal) {
              amountTotal1 = res.result[type1].amountTotal;
            }
            if (res.result[type1] && res.result[type1].profitTotal) {
              profitTotal1 = res.result[type1].profitTotal;
            }
            if (res.result[type2] && res.result[type2].amountTotal) {
              amountTotal2 = res.result[type2].amountTotal;
            }
            if (res.result[type2] && res.result[type2].profitTotal) {
              profitTotal2 = res.result[type2].profitTotal;
            }
       
            if (value == 7) {
              this.profitNew.direc1.amount = amountTotal1+amountTotal2;
              this.profitNew.direc1.rebate = profitTotal1+profitTotal2;
            }

            if (value == 8) {
              this.profitNew.direc2.amount = amountTotal1+amountTotal2;
              this.profitNew.direc2.rebate = profitTotal1+profitTotal2;
            }

            // this.profitNew.direc3.amount = amountTotal3;
            // this.profitNew.direc3.rebate = profitTotal3;
          }else{
            if (value == 7) {
              this.profitNew.direc1.amount = 0;
              this.profitNew.direc1.rebate = 0;
            }

            if (value == 8) {
              this.profitNew.direc2.amount = 0;
              this.profitNew.direc2.rebate = 0;
            }
          }
        }
      });
    },

    _getTotalCurrent(value) {
       


      var that = this;
      var dic = {
        types: value == 7 ? ["71", "72", "73", "74"] : ["81", "82", "83", "84"],
      };
      getTotalCurrent(dic).then((res) => {
        
        if (res.resp_code == "000000") {
          var type1 = "";
          var type2 = "";
          var type3 = "";

          if (value == 7) {
            type1 = "T71";
            type2 = "T72";
            type3 = "T73";
          }
          if (value == 8) {
            type1 = "T81";
            type2 = "T82";
            type3 = "T83";
          }
          //   if (this.queryType == 3) {
          //   type1 = 'T21'; type2 = 'T22'; type3 = 'T23';
          // }
          var today1Value = 0;
          var today2Value = 0;
          var today3Value = 0;
          var month1Value = 0;
          var month2Value = 0;
          var month3Value = 0;
  
          if (res.result[type1] && res.result[type1].todayProfitTotal) {
            today1Value = res.result[type1].todayProfitTotal;
          }
          if (res.result[type2] && res.result[type2].todayProfitTotal) {
            today2Value = res.result[type2].todayProfitTotal;
          }
          if (res.result[type3] && res.result[type3].todayProfitTotal) {
            today3Value = res.result[type3].todayProfitTotal;
          }
          if (res.result[type1] && res.result[type1].monthProfitTotal) {
            month1Value = res.result[type1].monthProfitTotal;
          }
            if (res.result[type2] && res.result[type2].monthProfitTotal) {
                month2Value = res.result[type2].monthProfitTotal;
            }
            if (res.result[type3] && res.result[type3].monthProfitTotal) {
                month3Value = res.result[type3].monthProfitTotal;
            }
          if (value == 7) {
            that.profitNew.todayRebate =
              today1Value + today2Value + today3Value;
            that.profitNew.monthRebate =
              month1Value + month2Value + month3Value;
            that.profitNew.totalRebate =
              parseFloat(that.profitNew.todayRebate) +
              parseFloat(that.profitNew.monthRebate);
          }
          if (value == 8) {
            that.profitNew.todayRebate1 =
              today1Value + today2Value + today3Value;
            that.profitNew.monthRebate1 =
              month1Value + month2Value + month3Value;
            that.profitNew.totalRebate1 =
              parseFloat(that.profitNew.todayRebate1) +
              parseFloat(that.profitNew.monthRebate1);
          }
         
           that.profitNew.monthRebateTotal =  that.profitNew.monthRebate + that.profitNew.monthRebate1;
           that.profitNew.todayRebateTotal = that.profitNew.todayRebate + that.profitNew.todayRebate1;
          //  that.profitNew.totalRebateTotal = that.profitNew.totalRebate + that.profitNew.totalRebate1;
        

        }
      });
    },
    onClickLeft() {
      this.publicJs.back();
    },
    getData() {
      var d = new Date(),
        nowYear = d.getFullYear(),
        month = d.getMonth() + 1;
      this.yaer = nowYear;
      if (month <= 9) {
        month = "0" + month;
      }
      this.month = month;
      this.yearList = [
        {
          text: nowYear + "年",
          value: nowYear,
        },
        {
          text: nowYear - 1 + "年",
          value: nowYear - 1,
        },
        {
          text: nowYear - 2 + "年",
          value: nowYear - 2,
        },
      ];
    },
    dateChange() {
       // this._profitSumQuery()
    this._getTurnoverTotal(7);
    this._getTurnoverTotal(8);
    this._getTotalCurrent(7);
    this._getTotalCurrent(8);
    },
    _profitSumQuery() {
      profitSumQuery(
        this.queryType,
        String(this.yaer) + String(this.month)
      ).then((res) => {
        if (res.resp_code == "000000") {
          this.profit = res.result;
        }
      });
    },
    next(name, level, type, title) {
      this.$router.push({
        name: name,
        params: {
          type: JSON.stringify(type),
          level: JSON.stringify(level),
          title: JSON.stringify(title),
          yaer: JSON.stringify(this.yaer),
          month: JSON.stringify(this.month),
        },
      });
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
  },
};
</script>
<style scoped>
>>> .van-popup {
  width: 94.7%;
  left: 10px;
  border-radius: 0px 0px 5px 5px;
}

.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}

.profit_type_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
}

.profit_type_top_bg >>> .van-dropdown-menu__bar {
  box-shadow: none;
}

.profit_type_top {
  width: 100%;
  padding: 10px 0 25px 0;
  font-size: 15px;
  color: #fff;
  border-radius: 0 0 20px 20px;
}

.profit_type_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_type_top .item > div {
  flex: 1;
  text-align: center;
}

.profit_type_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;
}

.profit_type_top .item .amount {
  font-size: 32px;
}

.profit_type_top .item .profit_amount {
  font-size: 20px;
}

.profit_type_top .item .right {
  position: relative;
}

.profit_share_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.profit_type_date {
  font-size: 14px;
  color: #333;
}

.profit_type_date .item {
  display: flex;
  line-height: 44px;
  text-align: center;
}

.profit_type_date .item .right {
  width: 40px;
  color: #666;
  font-size: 15px;
  line-height: 44px;
}

.profit_type_date .item div {
  flex: 1;
}

.active {
  color: #9B3C9D;
}

.profit_type_date .type {
  font-size: 12px;
  color: #666;
}
</style>
