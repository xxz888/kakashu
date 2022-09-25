<template>
  <div class="home">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="收益中心" 
                 @click-left="onClickLeft">
      <template #right>
        <div class="color_fff" @click="$router.push('/regulation')">收益规则</div>
      </template>
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_home_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">可提现（元）</div>
                <div class="amount">{{ balance |toFixed }}</div>
              </div>
              <div class="right">
                <div class="btn">
                  <span class="withdrawal theme " @click="next('/withdraw',8)">提现</span>
                  <span class="makeup" @click="next('creditLose',11)">弥补</span>
                </div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <div class="title">当日收益（元）</div>
                <div class="profit_amount">{{ Number(todayRebate) |toFixed }}</div>
              </div>
              <div class="right">
                <div class="title">当月收益（元）</div>
                <div class="profit_amount">{{ Number(monthRebate) |toFixed }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_home_cont_box">
          <div class="profit_home_cont">
            <div class="title">
              <img src="../../assets/profit/title_icon.png" alt="">
              <span>收益类型</span>
            </div>
            <ul>
              <li class="item" @click="next('/profitShare',8)">
                <img src="../../assets/profit/share_icon.png" alt="">
                <p>推广收益</p>
              </li>
              <li class="item" @click="next('profitType',1,'刷卡')">
                <img src="../../assets/profit/quick_icon.png" alt="">
                <p>刷卡分润</p>
              </li>
              <li class="item" @click="next('profitType',2,'还款')">
                <img src="../../assets/profit/peyment_icon.png" alt="">
                <p>还款分润</p>
              </li>
              <li class="item" @click="next('profitType',3,'空卡')">
                <img src="../../assets/profit/zero_icon.png" alt="">
                <p>空卡分润</p>
              </li>
              <li class="item" @click="next('profitRecord',4,'达标奖励')">
                <img src="../../assets/profit/upto_standard_icon.png" alt="">
                <p>达标奖励</p>
              </li>
              <li class="item" @click="next('/profitCashback',8)">
                <img src="../../assets/profit/cashback_icon.png" alt="">
                <p>返现</p>
              </li>
            </ul>
          </div>
          <div class="profit_home_cont">
            <div class="title">
              <img src="../../assets/profit/title_icon.png" alt="">
              <span>其他</span>
            </div>
            <ul>
              <li class="item" @click="next('profitUser',1,'直推用户')">
                <img src="../../assets/profit/user_icon.png" alt="">
                <p>直推用户</p>
              </li>
              <li class="item" @click="next('profitRecord',8,'提现记录')">
                <img src="../../assets/profit/withdrawal_icon.png" alt="">
                <p>提现记录</p>
              </li>
              <li class="item" @click="next('profitRecord',7,'弥补记录')">
                <img src="../../assets/profit/makeup_icon.png" alt="">
                <p>弥补记录</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-pull-refresh>
          <div class="tabbar_p"></div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon
} from 'vant';
import {
  newsQuery,
  getMessage
} from '@/api/showBrand'
import {
  userQuotaQuery
} from "@/api/creditManage";
import {
  getAccountQuery, getSumrebater
} from "@/api/user";
import tabbar from '@/components/tabbar'

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      fuwuList: [],
      balance: 0,
      monthRebate: 0,
      todayRebate: 0
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    tabbar
  },
  computed: {},
  created() {
    
    this._newsQuery()
    this._getAccountQuery()
    this._getSumrebater()
    this._getMessage()
  },
  activated() {
    this._getMessage()
    this._newsQuery()
    this._getAccountQuery()
    this._getSumrebater()
  },
  methods: {
    onClickLeft() {
      this.publicJs.back();
    },
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then(res => {
      })
    },
    _newsQuery() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _getAccountQuery() {
      getAccountQuery(this.token).then(res => {
        if (res.resp_code == '000000') {
          this.balance = res.result.balance
        }
      })
    },
    _getSumrebater() {
      getSumrebater(this.userId).then(res => {
        if (res.resp_code == '000000') {
          this.monthRebate = res.result.monthRebate
          this.todayRebate = res.result.todayRebate
        }
      })
    },
    next(path, type, title) {
      if (type == 8 && path != 'profitRecord') {
        this.$router.push({path: path});
      } else if (type == 11) {
        this.$router.push({name: path, params: {type: JSON.stringify(type)}});
      } else {
        this.$router.push({name: path, params: {level: JSON.stringify(type), title: JSON.stringify(title)}});
      }
    },
    link(item) {
      let num = 0
      this.fuwuList.map((key) => {
        if (key.title == item) {
          var url = key.content
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(url),
              title: JSON.stringify(key.title),
              type: "2"
            }
          });
          return
        } else {
          num++
        }
      })
      if (num == this.fuwuList.length) {
        this.$toast({
          message: '敬请期待',
          position: 'bottom'
        })
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    },
  }
}
</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}
.tabbar_p {
  height: 50px;
  width: 100%;
}
.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}
.home {
  height: 100vh;
  background: #fff;
}

.profit_home_top {
  width: 100%;
  padding: 10px 17px;
  font-size: 15px;
  color: #fff;
}

.profit_home_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_home_top .item > div {
  flex: 1;
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

.profit_home_top .item .right .btn .withdrawal {
  background: #fff;
  margin-right: 10px;
  padding: 3px 10px;
}

.profit_home_top .item .right .btn .makeup {
  border: 1px solid #FFFFFF;
  padding: 2px 9px;
}

.profit_home_cont_box {
  background: #fff;
  padding: 20px 15px;
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
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
}

.profit_home_cont .item {
  width: 25%;
  text-align: center;
  margin-bottom: 20px;
}

.profit_home_cont .item > img {
  height: 24px;
  width: 24px;
}

.profit_home_cont .item > p {
  font-size: 12px;
  color: #333;
  /* padding-top: px; */
}

</style>
