<template>
  <div class="home">
    <van-nav-bar
      class=""
      style="background: none"
      :border="false"
      title="收益中心"
      @click-left="onClickLeft"
    />
    <div class="warpper_top"></div>

    <div class="titleBg">
      <div class="flex jc-sb">
        <div class="ml-16">
          <div class="ketixian">可提现(元)</div>
          <div class="ketixianjine"> {{ balance }}</div>
        </div>

        <div class="shouyiguize fcc mt-30" @click='onClickRight'>
          <img
            src="../../assets/agent/路径 13147@2x.png"
            style="
              width: 9px;
              height: 11px;
              margin-right: 5px;
              transform: scale(0.8);
            "
            alt=""
          />
          收益规则
        </div>
      </div>

      <div class="flex ml-16 mt-10">
        <div class="shouyi ml-16">{{'当日收益：' +  (todayRebate  )}}</div>
        <div class="shouyi ml-16">{{'当月收益：' +  (monthRebate  ) }}</div>
      </div>
    </div>

    <div class="flex jc-sa btnClass" style="background: #fff">
      <div class="lijitixian fcc" @click="next('/withdraw',8)">立即提现</div>
      <div class="mibu fcc" @click="next('creditLose',11)">弥补</div>
    </div>

    <div>
      <!-- <div class="profit_home_top theme_bg">
        <div class="item">
          <div class="userAvatar">
            <img class='appLogo' 
                 src="../../assets/agent/img_icon.png" alt=""/>

          </div>
          <div class="userdata">
            <p>{{ user.nickname }}</p>
            <p class="userid">ID： {{ user.userid }}</p>
          </div>
        </div>
        <div class="item">
          <div class="schedule">
            <h3>{{ userAccount.totalBalance | toFixed }}</h3>
            <p class="allRebate">累计总收益（元）</p>
          </div>
        </div>
        <div class="item item_view">
          <div class="right_border">
            <p>{{ userAccount.curMonthTotal |toFixed }}</p>
            <p class="userid">当月收益（元）</p>
          </div>
          <div class="right_border">
            <p>{{ userAccount.todayTotal |toFixed }}</p>
            <p class="userid">当日收益（元）</p>
          </div>
          <div>
            <p>{{ userAccount.currentBalance |toFixed }}</p>
            <p class="userid">可提现金额（元）</p>
          </div>
        </div>
        <div class="item">
          <div class="withdrawal " @click="withdraw()">立即提现</div>
        </div>
      </div> -->
      <div class="profit_home_cont_box">
        <div class="profit_home_cont">
          <ul>
            <li class="item" @click="next('profitShare')">
              <img
                class="img60"
                src="../../assets/profit/组 17843@2x.png"
                alt=""
              />
              <p class="mt-25">推广收益</p>
            </li>

            <li class="item" @click="next('profitType', 2,'刷卡')">
              <img
                class="img60"
                src="../../assets/profit/组 17844@2x.png"
                alt=""
              />
              <p class="mt-25">刷卡分润</p>
            </li>
            <li class="item" @click="next('profitType', 12,'还款')">
              <img
                class="img60"
                src="../../assets/profit/组 17845@2x.png"
                alt=""
              />
              <p class="mt-25">还款分润</p>
            </li>

            <li class="item" @click="next('profitRecord',4,'达标奖励')">
              <img
                class="img60"
                src="../../assets/profit/组 17848@2x.png"
                alt=""
              />
              <p class="mt-25">达标奖励</p>
            </li>
            <li class="item" @click="next('/profitCashback',8,'刷卡')">
              <img
                class="img60"
                src="../../assets/profit/组 17847@2x.png"
                alt=""
              />
              <p class="mt-25">自用返现</p>
            </li>
            <li class="item" @click="next('profitType',3,'空卡')">
              <img
                class="img60"
                src="../../assets/profit/组 17846@2x.png"
                alt=""
              />
              <p class="mt-25">空卡分润</p>
            </li>

            <!-- <li class="item" @click="next('profitCashback',10)">
              <img src="../../assets/profit/vipcommission.png" alt="">
              <p>直推首还奖</p>
            </li>
            <li class="item" @click="next('profitCashback',0)">
              <img src="../../assets/profit/standard_subsidy_icon.png" alt="">
              <p>直推激活奖</p>
            </li>
            <li class="item" @click="next('profitType',3)">
              <img src="../../assets/profit/subsidy.png" alt="">
              <p>平级管理奖</p>
            </li> -->

            <li class="item" @click="next('profitUser', 1)">
              <img
                class="img60"
                src="../../assets/profit/组 17849@2x.png"
                alt=""
              />
              <p class="mt-25">直推激活奖</p>
            </li>
            <li
              class="item"
              @click="next('withdrawRecord',9,'提现记录')"
            >
              <img
                class="img60"
                src="../../assets/profit/组 17850@2x.png"
                alt=""
              />
              <p class="mt-25">提现记录</p>
            </li>
            <!-- <li class="item" @click="next('profitUser',1)">
              <img src="../../assets/profit/user_icon.png" alt="">
              <p>我的直推</p>
            </li> -->
            <!-- <li class="item" @click="next('shouyiguize', 22)">
              <img src="../../assets/profit/rule_icon.png" alt="">
              <p>收益规则</p>
            </li> -->
            <li class="item " @click="next('profitType1',4,'增值收益')">
              <img
                class="img60"
                src="../../assets/profit/组 17851@2x.png"
                alt=""
              />
              <p class="mt-25">增值收益</p>
            </li>

            
          </ul>
        </div>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>


<script>
import { NavBar, PullRefresh, Icon } from "vant";
import { newsQuery, getMessage } from "@/api/showBrand";
import { userQuotaQuery } from "@/api/creditManage";
import { getAccountQuery, getSumrebater ,getAccountSum ,getUserAccount} from "@/api/user";
import tabbar from "@/components/tabbar";

export default {
  data() {
    return {
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
      phone: localStorage.getItem("phone"),
      isLoading: false,
      fuwuList: [],
      balance: '',
      monthRebate: '',
      todayRebate: '',
      userAvatar: "",
      allRebate: '',
      user: {},
      userAccount: {},
      totalPay:""
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    tabbar,
  },
  created() {
    // user/app/user/account
    this._newsQuery();
    // this._getAccountQuery();

    //获取用户的帐户信息
    this._getUserAccount();
    // this._getSumrebater();
    this._getMessage();
  },
  activated() {
    this._getMessage();
    this._newsQuery();
    this._getAccountQuery();
    // this._getSumrebater();
  },
  methods: {
    zhituijihuoAction(){
      this.$toast({
          message: "敬请期待",
          position: "bottom",
        });
    },
    onClickRight(){
   this.$router.push({
        name: "appLink",
        params: {
          url: JSON.stringify(
            "https://dingcard.oss-cn-shanghai.aliyuncs.com/profita.png"
          ),
          title: JSON.stringify("咔咔鼠代理机制及优势"),
          type: "2",
        },
      });
    },
    onClickLeft() {
      this.publicJs.back();
    },
    //弥补
    mibu(){

    },
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then((res) => {});
    },
    _newsQuery() {
      newsQuery(this.global.brandId, "功能跳转").then((res) => {
        if (res.resp_code == "000000") {
          this.fuwuList = res.result.content;
        }
      });
    },
    _getAccountQuery() {
      getAccountSum(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.balance = res.result.usableWithdrawAmount;
          this.monthRebate = res.result.monthRebate;
          this.todayRebate = res.result.todayRebate;

        }
      });
    },
    _getSumrebater() {
      getSumrebater(this.userId).then((res) => {
        if (res.resp_code == "000000") {
          this.monthRebate = res.result.monthRebate;
          this.todayRebate = res.result.todayRebate;
        }
      });
    },
      _getUserAccount() {
      getUserAccount(this.token).then((res) => {
        if (res.resp_code == "000000") {
        
          this.balance = res.result.currentBalance;
          this.monthRebate = res.result.curMonthTotal;
          this.todayRebate = res.result.todayTotal;
          this.totalPay = res.result.totalPay;
        }
      });
    },


    
    next(path, type, title) {
      if (title == 0) {
        //如果点击提现按钮判断实名状态。未实名直接退出登录
        if (
          localStorage.getItem("realnameStatus") != 1 &&
          localStorage.getItem("realnameStatus") != null
        ) {

          this.$router.push({name: "faceRecognitionDetail"});

          // this.$toast({ message: "请去APP实名后登录", position: "bottom" });
          // let did = localStorage.getItem("did");
          // localStorage.clear();Cookies.remove('token');
          // sessionStorage.clear();
          // if (did) {
          //   localStorage.setItem("did", did);
          // }
          // this.$router.push({ name: "login" });
        } else {
          if (type == 8 && path != "profitRecord") {
            this.$router.push({ path: path });
          }
          
          else if (type == 11) {
            this.$router.push({
              name: path,
              params: { type: JSON.stringify(type) },
            });
          } else {
            this.$router.push({
              name: path,
              params: {
                level: JSON.stringify(type),
                title: JSON.stringify(title),
              },
            });
          }
        }
      } else {
        if (type == 8 && path != "profitRecord") {
          this.$router.push({ path: path });
        } 
        
        else if (type == 11) {
          this.$router.push({
            name: path,
            params: { type: JSON.stringify(type) },
          });
        } else {
          this.$router.push({
            name: path,
            params: {
              level: JSON.stringify(type),
              title: JSON.stringify(title),
              totalPay:JSON.stringify(this.totalPay),

            },
          });
        }
      }
    },
    link(item) {
      let num = 0;
      this.fuwuList.map((key) => {
        if (key.title == item) {
          var url = key.content;
          this.$router.push({
            name: "appLink",
            params: {
              url: JSON.stringify(url),
              title: JSON.stringify(key.title),
              type: "2",
            },
          });
          return;
        } else {
          num++;
        }
      });
      if (num == this.fuwuList.length) {
        this.$toast({
          message: "敬请期待",
          position: "bottom",
        });
      }
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
.home {
  height: 100vh;

  background: rgba(249, 250, 254, 0.39);
}
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #ffffff !important;
}

.profit_home_top {
  width: 100%;
  padding: 10px 17px;
  font-size: 15px;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}

.home_box {
}

.profit_home_top .item {
  display: flex;
  padding-bottom: 15px;
}

.item > .userAvatar {
  flex: 1;
}

.item > .userdata {
  padding-top: 5px;
  flex: 4;
  font-size: 14px;
}

.userid {
  font-size: 12px;
  margin-top: 5px;
  color: rgb(241, 223, 119);
}

.profit_home_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;
}

.profit_home_top .item .amount {
  font-size: 32px;
}

.profit_home_top .item .profit_amount {
  font-size: 20px;
}

.profit_home_top .item .right {
  position: relative;
}

.profit_home_top .item .right .btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.profit_home_top .item .right .btn span {
  display: inline-block;
  border-radius: 13px;
  font-size: 15px;
}

.withdrawal {
  background: #65d385;
  margin-right: 10px;
  margin: 0px auto;
  width: 200px;
  height: 35px;
  border-radius: 5px;
  line-height: 35px;
  text-align: center;
}

.profit_home_top .item .right .btn .makeup {
  border: 1px solid #ffffff;
  padding: 2px 9px;
}

.profit_home_cont {
  width: 100%;
  border-radius: 15px;
  background: #fff;
  padding-bottom: 20px;
}

.profit_home_cont_box {
  margin-left: 16px;
  width: calc(100% - 32px);
  margin-top: 16px;
  background: #fff;
  border-radius: 20px;
}

.profit_home_cont .title {
  font-size: 14px;
  color: #333;
}

.profit_home_cont .title > img {
  height: 11px;
  width: 18px;
  vertical-align: middle;
}

.profit_home_cont .title span {
  vertical-align: middle;
  padding-left: 5px;
}

.profit_home_cont > ul {
  display: flex;
  flex-wrap: wrap;
}

.profit_home_cont .item {
  width: 33%;
  text-align: center;
  margin: 15px 0px;
  position: relative;
}

.profit_home_cont .item > img {
}

.profit_home_cont .item > p {
  font-size: 12px;
  color: #333;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 40px;
  bottom: 0;
}

.item_view div {
  font-size: 16px;
  text-align: center;
  flex: 1;
}

.appLogo {
  height: 55px;
  width: 55px;
  border-radius: 50%;
}

.schedule {
  color: #fff;
  background: url("../../assets/profit/schedule.png") no-repeat;
  background-size: 100%;
  width: 200px;
  height: 110px;
  margin: 0px auto;
  text-align: center;
  padding-top: 65px;
}

.allRebate {
  margin-top: 5px;
  font-size: 13px;
}
.btnClass {
  margin-top: -10px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: 16px;
  width: calc(100% - 32px);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.titleBg {
  margin-left: 16px;
  width: calc(100% - 32px);
  height: 150px;
  background: url("../../assets/agent/组 17842@2x.png") no-repeat;
  background-size: cover;
  border-radius: 15px;
}
.ketixian {
  margin-top: 16px;
  margin-left: 16px;
  height: 19px;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 17px;
  color: #ffffff;
  opacity: 0.8;
}
.ketixianjine {
  margin-top: 7px;
  margin-left: 16px;
  height: 36px;
  font-size: 30px;
  font-family: DIN-Bold;
  line-height: 35px;
  color: #ffffff;
  opacity: 1;
}
.shouyiguize {
  width: 80px;
  height: 25px;
  background: rgba(205, 135, 207, 0.39);
  opacity: 0.6;
  border-radius: 14px 0px 0px 14px;
  font-size: 11px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 28px;
  color: #ffffff;
  opacity: 1;
}
.shouyi {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.8;
}
.lijitixian {
  width: 163px;
  height: 44px;
  background: linear-gradient(180deg, #da8cdc 0%, #ad53af 100%);
  opacity: 1;
  border-radius: 24px;

  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #ffffff;
  opacity: 1;
}

.mibu {
  width: 163px;
  height: 44px;
  border: 1px solid #9b3c9d;
  opacity: 1;
  border-radius: 24px;

  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #9b3c9d;
  opacity: 1;
}

.img60 {
  width: 60px;
  height: 60px;
}
</style>
