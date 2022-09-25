<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="推广收益" left-arrow
                 @click-left="onClickLeft">
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_share_top theme_bg">
          <ul>
            <li class="item">
              <div class="left">
                <div class="title">推广总收益（元）</div>
                <div class="amount">{{ profit.totalRebate |toFixed }}</div>
              </div>
              <div class="right"></div>
            </li>
            <li class="item">
              <div class="left">
                <div class="title">当日收益（元）</div>
                <div class="profit_amount">{{ profit.todayRebate |toFixed }}</div>
              </div>
              <div class="right">
                <div class="title">当月收益（元）</div>
                <div class="profit_amount">{{ profit.monthRebate |toFixed }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="profit_share_cont">
          <div class="user" @click="next('/profitProfit',8)">
            <div class="left">
              <div>当日认证(人)：<span class="theme">{{ profit.todayAuth }}</span></div>
              <div>当日激活(人)：<span class="theme">{{ profit.todayActive }}</span></div>
            </div>
            <div class="right">
              <div>当月认证(人)：<span class="theme">{{ profit.monthAuth }}</span></div>
              <div>当月激活(人)：<span class="theme">{{ profit.monthActive }}</span></div>
              <van-icon class="right_right" name="arrow"/>
            </div>
          </div>
          <div class="table">
            <div class="title">
              已注册<span class="theme">{{ profit.totalRegister }}人</span>
              已实名<span class="theme">{{ profit.totalRealName }}人</span>
              直推激活<span class="theme">{{ profit.direct1ActiveCount }}人</span>
              间推激活<span class="theme">{{ profit.direct2ActiveCount }}人</span>
              二级间推激活<span class="theme">{{ profit.direct3ActiveCount }}人</span>
            </div>
            <ul class="list">
              <li class="zero theme_bg ">
                <div class="name">收益率</div>
                <div>认证</div>
                <div>激活</div>
              </li>
              <li class="one">
                <div class="name">直推</div>
                <div class="theme">{{ verifyConfig[0] | toFixed }}元/人</div>
                <div class="theme">{{ Directlyrecommended }}元/人</div>
              </li>
              <li class="two">
                <div class="name">间推</div>
                <div class="theme">{{ verifyConfig[1] | toFixed }}元/人</div>
                <div class="theme">{{ Indirectrecommended }}元/人</div>
              </li>
              <li class="three">
                <div class="name">二级间推</div>
                <div class="theme">{{ verifyConfig[2] | toFixed }}元/人</div>
                <div class="theme">{{ Secondaryindirectrecommendation }}元/人</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {NavBar, PullRefresh, Icon} from 'vant';
import {newsQuery} from '@/api/showBrand'
import {userShareProfitQuery, active} from "@/api/profit";
import {toFixed} from '@/common/filters/filters'
import { getTurnoverTotal, getTotalCurrent,getStatistics } from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      fuwuList: [],
      profit: {
        direct1ActiveCount: 0,
        direct2ActiveCount: 0,
        direct3ActiveCount: 0,
        monthActive: 0,
        monthAuth: 0,
        monthRealName: 0,
        monthRebate: 0,
        todayActive: 0,
        todayAuth: 0,
        todayRealName: 0,
        todayRebate: 0,
        totalRealName: 0,
        totalRebate: 0,
        totalRegister: 0,
      },
      activeConfig: [[], [], []],
      verifyConfig: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon
  },
  computed: {
    Directlyrecommended() {
      for (let i = 0; i < this.activeConfig[0].length; ++i) {
        if (this.profit.direct1ActiveCount <= this.activeConfig[0][i].maxNum) {
          return this.activeConfig[0][i].amount.toFixed(2)
        }
      }
      return ''
    },
    Indirectrecommended() {
      for (let i = 0; i < this.activeConfig[1].length; ++i) {
        if (this.profit.direct2ActiveCount <= this.activeConfig[1][i].maxNum) {
          return this.activeConfig[1][i].amount.toFixed(2)
        }
      }
      return ''
    },

    Secondaryindirectrecommendation() {
      for (let i = 0; i < this.activeConfig[2].length; ++i) {
        if (this.profit.direct3ActiveCount <= this.activeConfig[2][i].maxNum) {
          return this.activeConfig[2][i].amount.toFixed(2)
        }
      }
      return ''
    }
  },
  created() {
    // this._newsQuery()
    // this._userShareProfitQuery()
    this.getActiveConfig()
    this._getTotalCurrent();
    this._getStatistics();
  },
  methods: {
    _getStatistics(){
      getStatistics().then((res) => {
        
        if (res.resp_code == "000000") {
           this.profit.totalRegister = res.result.firstCount +   res.result.secondCount +  res.result.thirdCount;
           this.profit.totalRealName = res.result.firstRealnameCount +   res.result.secondRealnameCount +  res.result.thirdRealnameCount;
           this.profit.direct1ActiveCount = res.result.firstActivationCount ;
           this.profit.direct2ActiveCount = res.result.secondActivationCount;
           this.profit.direct3ActiveCount = res.result.thirdActivationCount ;

        }
        
        })
    },
      _getTotalCurrent() {
      var that = this;
      var dic = {
        types: ["51", "52", "53","61", "62", "63",],
      };
      getTotalCurrent(dic).then((res) => {
        if (res.resp_code == "000000") {
            var monthProfitTotal51 = 0;
            var monthProfitTotal52 = 0;
            var monthProfitTotal53 = 0;
            var monthProfitTotal61 = 0;
            var monthProfitTotal62 = 0;
            var monthProfitTotal63 = 0;


            var todayProfitTotal51 = 0;
            var todayProfitTotal52 = 0;
            var todayProfitTotal53 = 0;
            var todayProfitTotal61 = 0;
            var todayProfitTotal62 = 0;
            var todayProfitTotal63 = 0;

            var totayCount51 = 0;
            var totayCount52 = 0;
            var totayCount53 = 0;
            var totayCount61 = 0;
            var totayCount62 = 0;
            var totayCount63 = 0;

            var monthCount51 = 0;
            var monthCount52 = 0;
            var monthCount53 = 0;
            var monthCount61 = 0;
            var monthCount62 = 0;
            var monthCount63 = 0;


           if (res.result.T51 && res.result.T51.totayCount) {
              totayCount51 = res.result.T51.totayCount;
            }
            if (res.result.T52 && res.result.T52.totayCount) {
              totayCount52 = res.result.T52.totayCount;
            }
            if (res.result.T53 && res.result.T53.totayCount) {
              totayCount53 = res.result.T53.totayCount;
            }

            if (res.result.T61 && res.result.T61.totayCount) {
              totayCount61 = res.result.T61.totayCount;
            }            
            if (res.result.T62 && res.result.T62.totayCount) {
              totayCount62 = res.result.T62.totayCount;
            }
            if (res.result.T63 && res.result.T63.totayCount) {
              totayCount63 = res.result.T63.totayCount;
            }


            if (res.result.T51 && res.result.T51.monthCount) {
              monthCount51 = res.result.T51.monthCount;
            }
            if (res.result.T52 && res.result.T52.monthCount) {
              monthCount52 = res.result.T52.monthCount;
            }
            if (res.result.T53 && res.result.T53.monthCount) {
              monthCount53 = res.result.T53.monthCount;
            }

            if (res.result.T61 && res.result.T61.monthCount) {
              monthCount61 = res.result.T61.monthCount;
            }            
            if (res.result.T62 && res.result.T62.monthCount) {
              monthCount62 = res.result.T62.monthCount;
            }
            if (res.result.T63 && res.result.T63.monthCount) {
              monthCount63 = res.result.T63.monthCount;
            }





            if (res.result.T51 && res.result.T51.todayProfitTotal) {
              todayProfitTotal51 = res.result.T51.todayProfitTotal;
            }
            if (res.result.T51 && res.result.T51.monthProfitTotal) {
              monthProfitTotal51 = res.result.T51.monthProfitTotal;
            }
  
            
            
            if (res.result.T52 && res.result.T52.todayProfitTotal) {
              todayProfitTotal52 = res.result.T52.todayProfitTotal;
            }
            if (res.result.T52 && res.result.T52.monthProfitTotal) {
              monthProfitTotal52 = res.result.T52.monthProfitTotal;
            }   

            if (res.result.T53 && res.result.T53.todayProfitTotal) {
              todayProfitTotal53 = res.result.T53.todayProfitTotal;
            }
            if (res.result.T53 && res.result.T53.monthProfitTotal) {
              monthProfitTotal53 = res.result.T53.monthProfitTotal;
            }   

           if (res.result.T61 && res.result.T61.todayProfitTotal) {
              todayProfitTotal61 = res.result.T61.todayProfitTotal;
            }
            if (res.result.T61 && res.result.T61.monthProfitTotal) {
              monthProfitTotal61 = res.result.T61.monthProfitTotal;
            }   
            
            
            if (res.result.T62 && res.result.T62.todayProfitTotal) {
              todayProfitTotal62 = res.result.T62.todayProfitTotal;
            }
            if (res.result.T62 && res.result.T62.monthProfitTotal) {
              monthProfitTotal62 = res.result.T62.monthProfitTotal;
            }   


            if (res.result.T63 && res.result.T63.todayProfitTotal) {
              todayProfitTotal63 = res.result.T63.todayProfitTotal;
            }
            if (res.result.T63 && res.result.T63.monthProfitTotal) {
              monthProfitTotal63 = res.result.T63.monthProfitTotal;
            }   

            //当日收益
            this.profit.todayRebate = todayProfitTotal51 + todayProfitTotal52 + todayProfitTotal53 + todayProfitTotal61 + todayProfitTotal62 + todayProfitTotal63;
            //当月收益
            this.profit.monthRebate = monthProfitTotal51 + monthProfitTotal52 + monthProfitTotal53 + monthProfitTotal61 + monthProfitTotal62 + monthProfitTotal63;
            //推广总收益
            this.profit.totalRebate =  this.profit.todayRebate + this.profit.monthRebate;
            //当日认证人数
            this.profit.todayAuth = totayCount51 + totayCount52 + totayCount53;
            //当日激活人数
            this.profit.todayActive = totayCount61 + totayCount62 + totayCount63;
             //当月认证人数
            this.profit.monthAuth = monthCount51 + monthCount52 + monthCount53;
            //当月激活人数
            this.profit.monthActive = monthCount61 + monthCount62 + monthCount63;
       }
      });
    },
    getActiveConfig() {
      active().then(res => {
        if (res.resp_code == "000000") {
          res.result.forEach(config => {
            if (config.level == 1) this.activeConfig[0].push({maxNum: config.maxNum, amount: config.amount})
            else if (config.level == 2) this.activeConfig[1].push({maxNum: config.maxNum, amount: config.amount})
            else this.activeConfig[2].push({maxNum: config.maxNum, amount: config.amount})
          })
          for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < this.activeConfig[i].length - 1; ++j) {
              for (let k = j + 1; k < this.activeConfig[i].length; ++k) {
                if (this.activeConfig[i][j].maxNum > this.activeConfig[i][k].maxNum) {
                  let config = this.activeConfig[i][j]
                  this.activeConfig[i][j] = this.activeConfig[i][k]
                  this.activeConfig[i][k] = config
                }
              }
            }
          }
          for (let i = 0; i < res.verify.length - 1; ++i) {
            for (let j = i + 1; j < res.verify.length; ++j) {
              if (res.verify[i].level > res.verify[j].level) {
                let ver = res.verify[i]
                res.verify[i] = res.verify[j]
                res.verify[j] = ver
              }
            }
          }
          res.verify.forEach(config => {
            this.verifyConfig.push(config.amount)
          })
        }
      })
    },
    onClickLeft() {
      this.publicJs.back();
    },
    _newsQuery() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _userShareProfitQuery() {
      userShareProfitQuery().then(res => {
        if (res.resp_code == '000000') {
          this.profit = res.result
        }
      })
    },
    next(path, type) {
      if (type == 8) {
        this.$router.push({path: path});
      } else if (type == 1) {
        this.$router.push({
          path: path,
          query: {
            'phone': this.phone,
            'token': this.token,
            'brandId': this.global.brandId,
            'userId': this.userId,
            'ip': this.global.ip,
            'type': 'h5',
            'deviceId': localStorage.getItem('kd_webapp_deviceId')
          }
        });
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
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

.profit_share_top .item {
  display: flex;
  padding-bottom: 20px;
}

.profit_share_top .item > div {
  flex: 1;
  text-align: center;
}

.profit_share_top .item .title {
  font-size: 13px;
  line-height: 30px;
  font-weight: 300;

}

.profit_share_top .item .amount {
  font-size: 32px;
}

.profit_share_top .item .profit_amount {
  font-size: 20px;
}

.profit_share_top .item .right {
  position: relative;
}

.profit_share_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.user {
  background: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 13px;
  color: #333;
  display: flex;
}

.user .left, .right {
  flex: 1;
  line-height: 24px;
  position: relative;
}

.right .right_right {
  font-size: 20px;
  color: #666;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 20px;
}

.table {
  padding: 15px 10px;
  background: #fff;
  font-size: 14px;
  margin-top: 10px;
  border-radius: 10px;
}

.table .title {
  padding: 0 30px 20px 30px;
  text-align: center;
}

.list {
  width: 100%;
}

.list li {
  font-size: 14px;
  line-height: 39px;
  display: flex;
  text-align: center;
}

.list li div {
  flex: 1;
}

.list li .name {
  font-size: 17px;
}

.zero {
  color: #fff;
  border-radius: 10px 10px 0 0;
}

.one {
  background: rgba(255, 150, 48, 0.12);
}

.two {
  background: rgba(255, 150, 48, 0.24);
}

.three {
  background: rgba(255, 150, 48, 0.12);
  border-radius: 0 0 10px 10px;
}

</style>
