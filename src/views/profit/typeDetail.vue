<template>
  <div style="background: #fff;">
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' :title="title" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="profit_type_top theme_bg">
          <div class="date">
            {{ yaer }}年{{ month }}月
          </div>
        </div>
        <div class="profit_share_cont">
          <div class="">
            <div class="profit_type_detail_top_bg">
              <div>日期</div>
              <div>姓名</div>
              <div>{{ swiping }}（元）</div>
              <div>分润（元）</div>
            </div>
          </div>
          <van-list v-model="isupLoading" :finished="finished" finished-text="" @load="onLoad">
            <ul class="profit_type_date" v-if='profitDetail.length >0'>
              <li class="item van-hairline--bottom" v-for="(item,index) in profitDetail" :key="index">
                <div class="type">{{ item.createTime }}</div>
                <div>{{ item.sourceName }}</div>
                <div>{{ item.orderAmount |toFixed }}</div>
                <div class="active">{{ item.amount |toFixed }}</div>
              </li>
            </ul>
            <van-empty class="user_empty" v-else
                       description="还没有获得分润 请前去立即推广哦">
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
  Icon,
  DropdownMenu,
  DropdownItem,
  Empty,
  Button,
  List
} from 'vant';
import {
  userDirectDetailQuery
} from "@/api/profit";
import { getTurnoverUser} from "@/api/user";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      isLoading: false,
      fuwuList: [],
      queryType: 1, //1:快捷,2:余额还款,3:空卡还款,6:花呗
      title: "刷卡",
      profitDetail: [],
      yaer: '',
      month: "",
      isupLoading: false,
      finished: false,
      size: 20
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [List.name]: List
  },
  computed: {
    swiping() {
      if (this.level == 1) {
        return '刷卡'
      } else if (this.level == 2) {
        return '还款'
      } else if (this.level == 3) {
        return '空卡'
      }else{
        return '金额'
      }
    }
  },
  created() {
    this.title = JSON.parse(this.$route.params.title)
    this.queryType = JSON.parse(this.$route.params.type)
    this.level = JSON.parse(this.$route.params.level)
    this.yaer = JSON.parse(this.$route.params.yaer)
    this.month = JSON.parse(this.$route.params.month)
    // this._userDirectDetailQuery()
    this._getTurnoverUser();
    
  
  },
  methods: {
    _getTurnoverUser(){
      var that = this;
      var type = '';
      if (this.level==1) {
        type = this.queryType ;
      }
      if (this.level==2) {
        type = this.queryType == 1 ? '11' : this.queryType == 2 ? '12' : this.queryType == 3 ? '13' :'14';
      }
      if (this.level==3) {
        type = this.queryType == 1 ? '11' : this.queryType == 2 ? '12' : this.queryType == 3 ? '13' :'14';
      }
    
      var dic = {
           types: [type],
           queryDate: String(this.yaer) + String(this.month),
           page:1,
           size:200
      };
      if (this.level==4) {
        dic.types = ['71','72','73','74'];
      }
       if (this.level==5) {
        dic.types = ['81','82','83','84'];
      }
      getTurnoverUser(dic).then(res=>{
         if (res.resp_code == '000000') {
           
            if (res.result.content.length > 0) {
              
              that.profitDetail = res.result.content
              that.isupLoading = false;
              if (that.profitDetail.length == that.size) {
                that.finished = false;
              } else if (that.size > that.profitDetail.length) {
                that.finished = true;
              } else {
                that.finished = true;
              }
              that.size += 10
            } else {
              
              that.profitDetail = [];
              that.finished = true
              that.isupLoading = true;
            }


            for (const item of that.profitDetail) {
              if (item.type != 71 && this.level==4) {
                item.sourceName = this.desensitizedName(item.sourceName);
              }
              if (item.type != 81 && this.level==5) {
                item.sourceName = this.desensitizedName(item.sourceName);
              }

            }
          }
      
      })
    },
    desensitizedName (fullName) {
        if (!fullName) {
            return "";
        }
        let str = fullName.substr(0, 1);
        for (let i = 0; i < fullName.length - 1; i++) {
            str += '*';
        }
        return str;
    },

    onClickLeft() {
      this.publicJs.back();
    },
    _userDirectDetailQuery() {
      userDirectDetailQuery(String(this.yaer) + String(this.month), this.queryType, this.level, this.size)
        .then(res => {
          if (res.resp_code == '000000') {
            if (res.result.length > 0) {
              this.profitDetail = res.result
              this.isupLoading = false;
              if (this.profitDetail.length == this.size) {
                this.finished = false;
              } else if (this.size > this.profitDetail.length) {
                this.finished = true;
              } else {
                this.finished = true;
              }
              this.size += 10
            } else {
              this.profitDetail = [];
              this.finished = true
              this.isupLoading = true;
            }
          }
        })
    },
    next(path, type) {
      this.$router.push({path: path});
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this._getTurnoverUser()
        this.isLoading = false;
      }, 1000);
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this._getTurnoverUser()
      }, 500);
    }
  }
}

</script>
<style scoped>
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.profit_type_detail_top_bg {
  background: #fff;
  padding: 3px;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  font-size: 14px;
  margin-bottom: 20px;
}

.profit_type_detail_top_bg div {
  flex: 1;
  text-align: center;
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

.profit_type_top .date {
  font-size: 17px;
  text-align: center;
  line-height: 44px;
  margin-bottom: 10px;
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
  line-height: 24px;
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
    text-align: center;
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
</style>
