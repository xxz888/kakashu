<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="推广收益" left-arrow
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
        <ul class="profit_profit_cont">
          <li class="item" @click="next('profitUser',1,'直推用户')">
            <div class="left">
              <div class="level">直推</div>
              <div class="user">
                <p>{{ profit.direc1.registerCount }}人<span class="theme">已注册</span></p>
                <p>{{ profit.direc1.activeCount }}人<span class="theme">已激活</span></p>
              </div>
            </div>
            <div class="right">
              <div class="user">
                <p>{{ profit.direc1.authCount }}人<span class="theme">已认证</span></p>
                <p>{{ profit.direc1.rebate }}元<span class="profit_theme">推广收益</span></p>
              </div>
              <van-icon class="right_right" name="arrow"/>
            </div>
          </li>
          <li class="item" @click="next('profitUser',2,'间推用户')">
            <div class="left">
              <div class="level">间推</div>
              <div class="user">
                <p>{{ profit.direc2.registerCount }}人<span class="theme">已注册</span></p>
                <p>{{ profit.direc2.activeCount }}人<span class="theme">已激活</span></p>
              </div>
            </div>
            <div class="right">
              <div class="user">
                <p>{{ profit.direc2.authCount }}人<span class="theme">已认证</span></p>
                <p>{{ profit.direc2.rebate }}元<span class="profit_theme">推广收益</span></p>
              </div>
              <van-icon class="right_right" name="arrow"/>
            </div>
          </li>
          <li class="item" @click="next('profitUser',3,'二级间推用户')">
            <div class="left">
              <div class="level">二级间推</div>
              <div class="user">
                <p>{{ profit.direc3.registerCount }}人<span class="theme">已注册</span></p>
                <p>{{ profit.direc3.activeCount }}人<span class="theme">已激活</span></p>
              </div>
            </div>
            <div class="right">
              <div class="user">
                <p>{{ profit.direc3.authCount }}人<span class="theme">已认证</span></p>
                <p>{{ profit.direc3.rebate }}元<span class="profit_theme">推广收益</span></p>
              </div>
              <van-icon class="right_right" name="arrow"/>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <div class="level">总计</div>
              <div class="user">
                <p>{{ profit.total.registerCount }}人<span class="theme">已注册</span></p>
                <p>{{ profit.total.activeCount }}人<span class="theme">已激活</span></p>
              </div>
            </div>
            <div class="right">
              <div class="user">
                <p>{{ profit.total.authCount }}人<span class="theme">已认证</span></p>
                <p>{{ profit.total.rebate }}元<span class="profit_theme">推广收益</span></p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  PullRefresh,
  Icon, DropdownMenu, DropdownItem
} from 'vant';
import {
  profitSumQuery
} from "@/api/profit";
import { getTurnoverTotal ,getTurnoverUser,getRealtionUserCount} from "@/api/user";

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
      queryType: '9',
      profit: {
        direc1: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        direc2: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        direc3: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        total: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
      }
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  created() {
    this.getData();
    // this._profitSumQuery()
    this._getTurnoverTotal();
     this._getRealtionUserCount();
  },
  methods: {
    
    _getRealtionUserCount(){
      var dic = {
        queryDate: String(this.yaer) + String(this.month),
      };
      getRealtionUserCount(dic).then((res) => {
          if (res.resp_code == '000000') {
            if (res.result.L1 &&  res.result.L1.count) {
               this.profit.direc1.registerCount = res.result.L1.count;
            }else{
                this.profit.direc1.registerCount = 0;
            }
            if (res.result.L2 &&  res.result.L2.count) {
               this.profit.direc2.registerCount = res.result.L2.count;
            }else{
               this.profit.direc2.registerCount = 0;
            }
            if (res.result.L3 &&  res.result.L3.count) {
               this.profit.direc3.registerCount = res.result.L3.count;
            }else{
               this.profit.direc3.registerCount = 0;
            }

             this.profit.total.registerCount =  this.profit.direc1.registerCount + this.profit.direc2.registerCount + this.profit.direc3.registerCount;
             
          }
      });
    },
    //收益统计
    _getTurnoverTotal() {
      this.profit = {
        direc1: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        direc2: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        direc3: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
        total: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
      };

      var dic = {
        types: ["51", "52", "53","61", "62", "63",],
        queryDate: String(this.yaer) + String(this.month),
      };
      getTurnoverTotal(dic).then((res) => {
        if (res.resp_code == "000000") {
          if (JSON.stringify(res.result) != "{}") {
            var firstReamCount = 0;
            if (res.result.T51 && res.result.T51.count) {
              firstReamCount = res.result.T51.count;
            }
            var firstActive = 0;
            if (res.result.T61 && res.result.T61.count) {
               firstActive = res.result.T61.count;
            }

            var secondReamCount = 0;
            if (res.result.T52 && res.result.T52.count) {
              secondReamCount = res.result.T52.count;
            }
            var secondActive = 0;
            if (res.result.T62 && res.result.T62.count) {
               secondActive = res.result.T62.count;
            }

            var thirdReamCount = 0;
            if (res.result.T53 && res.result.T53.count) {
              thirdReamCount = res.result.T53.count;
            }
            var thirdActive = 0;
            if (res.result.T63 && res.result.T63.count) {
               thirdActive = res.result.T63.count;
            }
          







            var rebate51 = 0;
            var rebate52 = 0;
            var rebate53 = 0;

         
            var rebate61 = 0;
            var rebate62 = 0;
            var rebate63 = 0;


            if (res.result.T51 && res.result.T51.profitTotal) {
              rebate51 = res.result.T51.profitTotal;
            }
            if (res.result.T52 && res.result.T52.profitTotal) {
              rebate52 = res.result.T52.profitTotal;
            }
            if (res.result.T53 && res.result.T53.profitTotal) {
              rebate53 = res.result.T53.profitTotal;
            }


            if (res.result.T61 && res.result.T61.profitTotal) {
              rebate61 = res.result.T61.profitTotal;
            }
            if (res.result.T62 && res.result.T62.profitTotal) {
              rebate62 = res.result.T62.profitTotal;
            }
            if (res.result.T63 && res.result.T63.profitTotal) {
              rebate63 = res.result.T63.profitTotal;
            }

            /**
             *  this.profit = {
                  direc1: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
                  direc2: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
                  direc3: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
                  total: {amount: null, rebate: 0, registerCount: 0, realNameCount: 0, activeCount: 0, authCount: 0},
                };
             * 
             */
            this.profit.direc1.rebate =  (rebate51 + rebate61).toFixed(2);
            this.profit.direc1.authCount =  firstReamCount;
            this.profit.direc1.activeCount =  firstActive ;

            this.profit.direc2.rebate =  (rebate52 + rebate62).toFixed(2);
            this.profit.direc2.authCount =  secondReamCount ;
            this.profit.direc2.activeCount =  secondActive ;

            this.profit.direc3.rebate =  (rebate53 + rebate63).toFixed(2);
            this.profit.direc3.authCount =  thirdReamCount ;
            this.profit.direc3.activeCount =  thirdActive ;

            this.profit.total.rebate =  (rebate51 + rebate61 + rebate52 + rebate62 + rebate53 + rebate63).toFixed(2);
            this.profit.total.authCount = firstReamCount + secondReamCount + thirdReamCount;
            this.profit.total.activeCount = firstActive + secondActive + thirdActive;

          }
        }
      });

      
    },
 
    onClickLeft() {
      this.publicJs.back();
    },
    getData() {
      debugger
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
      this._getTurnoverTotal();
      this._getRealtionUserCount();
    },
    next(name, type, title) {
      this.$router.push({name: name, params: {level: JSON.stringify(type), title: JSON.stringify(title)}})
    },
    _profitSumQuery() {
      profitSumQuery(this.queryType, String(this.yaer) + String(this.month)).then(res => {
        if (res.resp_code == '000000') {
          this.profit = res.result
        }
      })
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

.profit_profit_cont {
  padding: 0 10px;
  margin-top: -20px;
}

.item {
  background: #fff;
  border-radius: 10px;
  padding: 20px 0px;
  display: flex;
  font-size: 15px;
  margin-bottom: 10px;
}

.item .left, .right {
  flex: 1;
}

.item .left {
  display: flex;
}

.item .right {
  position: relative;
}

.item .left .level {
  text-align: center;
  color: #666;
  line-height: 42px;
}

.item .left div {
  flex: 1;
}

.item .left, .right .user {
  font-size: 15px;
}

.item .left .user p > span {
  font-size: 11px;

}

.item .right .user {
  padding-left: 30px;
}

.item .right .user p > span {
  font-size: 11px;
}

.profit_theme {
  color: #9B3C9D;
}

.item .right .right_right {
  font-size: 20px;
  color: #666;
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 20px;
}

</style>
