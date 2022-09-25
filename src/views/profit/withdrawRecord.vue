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
                <div class="title">
                  <span>提现总金额</span>
                </div>

                <div class="amount" v-if="queryType == 9">
                  {{ totalPay | toFixed }}
                </div>
              </div>
              <div class="right"></div>
            </li>
            <li class="item">
              <div class="left">
                <div class="title">
                  <span v-if="queryType == 9">当日提现</span
                  ><span v-else-if="queryType == 7">当日弥补额度</span
                  ><span v-else-if="queryType == 4">当日收益</span>（元）
                </div>
                <div class="profit_amount">
                  {{ orderNew.todayProfitTotal | toFixedPositive }}
                </div>
              </div>
              <div class="right">
                <div class="title">
                  <span v-if="queryType == 9">当月提现</span
                  ><span v-else-if="queryType == 7">当月弥补额度</span
                  ><span v-else-if="queryType == 4">当月收益</span>（元）
                </div>
                <div class="profit_amount">
                  {{ orderNew.monthProfitTotal | toFixedPositive }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <div class="profit_type_top">
            <div class="profit_type_detail_top_bg" v-if="queryType == 4">
              <div>日期</div>
              <div>姓名</div>
              <div>金额（元）</div>
            </div>
            <div class="profit_type_record" v-else>
              <div>
                当日<span>提现</span>(笔):<span class="theme">{{
                  orderNew.totayCount
                }}</span>
              </div>
              <div>
                当月<span>提现</span>(笔):<span class="theme">{{
                  orderNew.monthCount
                }}</span>
              </div>
            </div>
          </div>
          <ul
            class="profit_type_date"
            v-if="order.detail.length > 0 && queryType == 4"
          >
            <li
              class="item van-hairline--bottom"
              v-for="(item, index) in order.detail"
              :key="index"
            >
              <div class="type">
                {{
                  item.tradeTime.split("-")[1] +
                  "/" +
                  item.tradeTime.split("-")[2]
                }}
              </div>
              <div>{{ item.userName }}</div>
              <div class="active">{{ item.tradeAmount | toFixed }}</div>
            </li>
          </ul>
          <ul
            class="profit_type_date"
            v-else-if="order.detail.length > 0 && queryType != 4"
          >
            <li class="van-hairline--bottom">
              <img src="../../assets/profit/title_icon.png" alt="" />
              <span class="theme"
                ><span v-if="queryType == 9">提现</span
                ><span v-else-if="queryType == 7">弥补</span>历史记录</span
              >
            </li>
            <li
              class="record van-hairline--bottom"
              v-for="(item, index) in order.detail"
              :key="index"
            >
              <div>
                <div>
                  <span v-if="queryType == 9">提现</span
                  ><span v-else-if="queryType == 7">弥补</span>金额
                </div>
                <p>{{ item.tradeTime }}</p>
              </div>
              <div>
                <span>{{ item.tradeAmount | toFixed }}</span>
                <!-- <p class="status">{{item.status| withdrawal}}</p> -->
              </div>
            </li>
          </ul>
          <van-empty class="user_empty" v-else description="暂无数据">
          </van-empty>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon,
  DropdownMenu,
  DropdownItem,
  empty,
  Button,
} from "vant";
import { orderDetailQuery } from "@/api/profit";
import { getTurnoverTotal, getTotalCurrent } from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      phone: localStorage.getItem("phone"),
      isLoading: false,
      fuwuList: [],
      queryType: 4, //1:快捷,2:余额还款,3:空卡还款,6:花呗
      title: "达标奖励",
      order: {
        detail: [],
      },
      orderNew: {},
      totalPay: "0.00",
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [empty.name]: empty,
    [Button.name]: Button,
  },
  computed: {},
  created() {
    this.title = JSON.parse(this.$route.params.title);
    this.queryType = JSON.parse(this.$route.params.level);
    this.totalPay = JSON.parse(this.$route.params.totalPay);
    this._getTotalCurrent();
    this._orderDetailQuery();
  },
  methods: {
    _orderDetailQuery() {
      orderDetailQuery("8", 100).then((res) => {
        if (res.resp_code == "000000") {
          this.order = res.result;
        }
      });
    },
    _getTotalCurrent() {
      var that = this;
      var dic = {
        types: [90],
      };
      getTotalCurrent(dic).then((res) => {
        if (res.resp_code == "000000") {
          if (res.result && res.result["T90"]) {
            that.orderNew = res.result["T90"];
          } else {
            if (!that.orderNew.todayProfitTotal) {
              that.orderNew.todayProfitTotal = 0;
            }
            if (!that.orderNew.monthProfitTotal) {
              that.orderNew.monthProfitTotal = 0;
            }
            if (!that.orderNew.totayCount) {
              that.orderNew.totayCount = 0;
            }
            if (!that.orderNew.monthCount) {
              that.orderNew.monthCount = 0;
            }
          }
        }
      });
    },
    onClickLeft() {
      this.publicJs.back();
    },
    dateChange() {
      this._getTotalCurrent();
    },
    next(name, level, type, title) {
      this.$router.push({ path: name });
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
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}

.profit_type_detail_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  font-size: 14px;
  /* margin-bottom: 20px; */
}

.profit_type_detail_top_bg div {
  flex: 1;
  text-align: center;
  color: #666;
  padding: 10px 0;
}

.profit_type_record {
  background: #fff;
  padding: 3px 15px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  font-size: 14px;
}

.profit_type_record div {
  flex: 1;
  color: #666;
  padding: 10px 0;
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
  padding-bottom: 20px;
}

.profit_type_date .item {
  display: flex;
  height: 44px;
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

.user_empty >>> .van-empty__image img {
  height: auto;
}

.profit_type_date .record {
  display: flex;
  padding: 10px 15px;
  font-size: 13px;
}

/* .profit_type_date li:nth-child(1){
    line-height: 44px;
    font-size: 14px;
    padding: 0 15px;
} */

.profit_type_date li:nth-child(1) img {
  height: 11px;
  width: 18px;
  margin-right: 5px;
}

.profit_type_date .record div {
  flex: 1;
  position: relative;
}

.profit_type_date .record p {
  font-size: 12px;
  color: #999;
  padding-top: 10px;
}

.profit_type_date .record span {
  font-size: 18px;
  color: #9B3C9D;
  position: absolute;
  height: 25px;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  display: inline-block;
}

.status {
  color: #9B3C9D !important;
  font-size: 12px !important;
  position: absolute;
  height: 25px;
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: 20px;
  display: inline-block;
}
</style>
