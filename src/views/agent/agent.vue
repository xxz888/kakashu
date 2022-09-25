<template>
  <div>
    <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="顶级代理" left-arrow
                 @click-left="onClickLeft">
      <template #right>
        <div class="agent_right_tip theme" @click="onClickRight()">规则说明</div>
      </template>
    </van-nav-bar>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="agent_top_bg theme_bg">
          <div class="left">
            <img src="../../assets/im_top_bs_logo.png" alt="">
          </div>
          <div class="right">
            <span>{{ gradeName }}</span>
            <p><span>当月补贴：</span> {{ amount | toFixed }}元</p>
          </div>
        </div>
        <div class="agent_cont">
          <div class="agent_sum">
            <ul>
              <li class="agent_sum_item">
                <div>当月激活(人)：<span class="theme">{{ sonActive.activationByTime }}</span></div>
                <div>当月达标(人)：<span class="theme">{{ sonActive.extensionByTime }}</span></div>
              </li>
              <li class="agent_sum_item">
                <div>总激活(人)：<span class="theme">{{ sonActive.activationAll }}</span></div>
                <div>总达标(人)：<span class="theme">{{ sonActive.extensionAll }}</span></div>
              </li>
            </ul>
          </div>
          <van-sticky :offset-top="46">
            <div class="agent_search">
              <van-search v-model="text" show-action background="none" placeholder="请输入手机号或者姓名" @search="onSearch">
                <template #action>
                  <div class="agent_search_btn" @click="onSearch">搜索</div>
                </template>
              </van-search>
            </div>
          </van-sticky>
          <div>
            <van-list v-model="isupLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <ul class="agent_list" v-if="sonList.length>0">
                <li class="agent_item" v-for="(item,index) in sonList" :key="index">
                  <div class="left">
                    <img src="../../assets/agent/img_icon.png" alt="">
                  </div>
                  <div class="cont">
                    <div class="title">{{ item.userName }}
                      <span :class="'agent_grade_'+item.gradeName ">
                        {{ item.gradeName }}
                      </span>
                    </div>
                    <span class="tips">ID:{{ item.userId }}</span>
                    <p>直接激活：<span class="theme">{{ item.firSize }}</span>人</p>
                  </div>
                  <div class="right">
                    <div class="phone">{{ item.phone |dataHidden }}</div>
                    <span class="tips">达标时间：{{ item.createTime }}</span>
                    <p class="title">直接实名：<span class="theme">{{ item.realSize }}</span>人</p>
                  </div>
                </li>
              </ul>
              <van-empty class="user_empty" v-else
                         :image="require('../../assets/user_empty.png')"/>
            </van-list>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  NavBar,
  Sticky,
  Search,
  PullRefresh,
  List,
  Empty,
} from 'vant';
import {newsQuery} from '@/api/showBrand'
import {
  agentSonQuery, agentUserQuery, agentGradeNameQuery, agentUserWagesQuery, agentSonRecordQuery
} from "@/api/agent";

export default {
  data() {
    return {
      brandId: localStorage.getItem('brandId'),
      userId: localStorage.getItem('userId'),
      phone: localStorage.getItem('phone'),
      text: "",
      isLoading: false,
      isupLoading: false,
      finished: false,
      sonList: [],
      size: 20,
      gradeName: '顶级代理',
      amount: 0,
      sonActive: {
        activationAll: "0",
        activationByTime: "0",
        extensionAll: "0",
        extensionByTime: "0",
      },
      fuwuList: []
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty
  },
  computed: {},
  created() {
    this._newsQuery()
    this._agentUserQuery()
    this._agentSonRecordQuery()
  },
  methods: {
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
    _newsQuery() {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    _agentUserQuery() {
      agentUserQuery(this.userId).then(res => {
        if (res.resp_code == "000000" && res.result) {
          this._agentGradeNameQuery(res.result.promotionLevelId)
          this._agentUserWagesQuery(res.result.promotionLevelId)
        }
      })
    },
    _agentGradeNameQuery(promotionLevelId) {
      agentGradeNameQuery(promotionLevelId).then(res => {
        if (res.resp_code == "000000") {
          this.gradeName = res.result.gradeName
        }
      })
    },
    _agentUserWagesQuery(promotionLevelId) {
      agentUserWagesQuery(this.userId, promotionLevelId).then(res => {
        if (res.resp_code == "000000") {
          this.amount = res.result
        }
      });
    },
    _agentSonRecordQuery() {
      agentSonRecordQuery(this.userId).then(res => {
        if (res.resp_code == "000000") {
          this.sonActive = res.result
        }
      })
    },
    goList(item, event) {
      event.cancelBubble = true;
      repaymentsupportbank(item.version).then(res => {
        if (res.resp_code == '000000') {
          this.bankList = res.result
          this.zhiciTrueFalseBy = true
        }
      })
    },
    _agentSonQuery() {
      this.isupLoading = true;
      this.finished = true;
      agentSonQuery(this.userId, this.text, '1', '99999').then(res => {
        this.sonList = [];
        if (res.resp_code == "000000") {
          if (res.result && res.result.length > 0) {
            this.sonList = res.result;
            this.isupLoading = false;
            this.size += 10
            if (this.size >= this.sonList.length) {
              this.finished = true;
            } else {
              this.finished = true;
            }
          } else {
            this.sonList = [];
            this.finished = true
            this.isupLoading = false;
          }
        } else {
          this.sonList = [];
        }
      });
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
        this._agentUserQuery()
        this._agentSonRecordQuery()
        this.isLoading = false;
      }, 1000);
    },
    onLoad() {  //上啦加载
      setTimeout(() => {
        this._agentSonQuery()
      }, 500);
    },
    onSearch() {
      this.size = 20
      this._agentSonQuery()
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

.agent_right_tip {
  font-size: 13px;
  background: #FFFFFF;
  border-radius: 10px 0px 0px 10px;
  padding: 2px 2px 2px 8px;
  margin-right: -16px;
}

.agent_top_bg {
  height: 140px;
  border-radius: 0 0 25px 25px;
  width: 100%;
  font-size: 17px;
  display: flex;
  color: #fff;
  padding: 27px 30px;
}

.agent_top_bg .left {
  width: 65px;
}

.agent_top_bg .left > img {
  height: 55px;
  width: 55px;
}

.agent_top_bg .right {
  flex: 1;
  padding-top: 5px;
}

.agent_top_bg .right p > span {
  font-size: 14px;
}

.agent_cont {
  padding: 0 10px;
  margin-top: -30px;
}

.agent_sum {
  width: 100%;
  padding: 10px 15px;
  background: #FFFFFF;
  border-radius: 10px;
}

.agent_sum_item {
  font-size: 13px;
  display: flex;
}

.agent_sum_item div {
  flex: 1;
  line-height: 24px;
}

.agent_item {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  display: flex;
  /* justify-content: space-between; */
}

.agent_item .cont {
  flex: 1;
}

.agent_item .right {
  flex: 1;
}

.agent_item .left {
  width: 50px;
}

.agent_item .left > img {
  height: 40px;
  width: 40px;
}

.agent_item .right {
  text-align: right;
}

.agent_item .tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.agent_item .phone {
  color: #666;
}

.agent_search {
  background: #fff;
  margin: 10px 0;
  border-radius: 10px;
}

.agent_search >>> .van-search {
  padding: 0;
}

.agent_search >>> .van-search__content {
  background: #fff;
  border-radius: 10px;
}

.agent_search_btn {
  color: #2574EA;
}

.agent_grade_达标代理 {
  display: inline-block;
  background: #9B3C9D;
  border-radius: 9px;
  padding: 0 8px;
  font-size: 11px;
  color: #fff;
  margin-left: 5px;
}

.agent_grade_普通代理 {
  display: inline-block;
  background: #0d18b3;
  border-radius: 9px;
  padding: 0 8px;
  font-size: 11px;
  color: #fff;
  margin-left: 5px;
}

.user_empty >>> .van-empty__image img {
  height: auto;
}

</style>
