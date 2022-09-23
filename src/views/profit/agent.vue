<template>
  <div>
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
    <van-sticky :offset-top="46">
      <div class="profit_user_search">
        <div class="left">
          <van-search
            v-model="fullname"
            show-action
            background="#fff"
            placeholder="请输入手机号或者姓名"
            @search="onSearch"
          >
            <template #action>
              <div class="profit_user_search_btn" @click="onSearch">搜索</div>
            </template>
          </van-search>
        </div>
      </div>
    </van-sticky>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      loading-text="加载中..."
    >
      <div>
        <van-list v-model="isupLoading" :finished="finished" @load="onLoad">
          <ul class="profit_user_list" v-if="sonList.length > 0">
            <li
              class="profit_user_item_box"
              v-for="(item, index) in sonList"
              :key="index"
            >
              <div class="profit_user_item">
                <div class="left" @click="repayment(item)">
                  <img src="../../assets/agent/img_icon.png" alt="" />
                </div>
                <div class="cont" @click="repayment(item)">
                  <div class="title" v-if="item.fullname == null">
                    未实名<span class="tips"> {{ "(" + item.phon + ")" }}</span>
                  </div>
                  <div class="title" v-else>
                    {{ item.fullname }}
                    <span class="tips">{{ "(" + item.phone + ")" }}</span>
                  </div>
                  <span class="tips">{{ item | agentStatus }}</span>
                </div>
                <div class="right">
                  <div class="phone">
                    <a :href="'tel:' + item.phone">
                      <img src="../../assets/profit/phone_icon.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <van-empty class="user_empty" v-else description="暂无数据">
          </van-empty>
        </van-list>
      </div>
    </van-pull-refresh>
    <van-popup v-model="statusTrueFalseBy" position="right" class="user_status">
      <div class="user_status_box">
        <ul>
          <li
            class="user_status_item van-hairline--bottom"
            :class="item.status == status ? 'activeStatus' : ''"
            v-for="(item, index) in statusLsit"
            :key="index"
            @click="statusSel(item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
    </van-popup>

    <div class="add_btn theme-linear-bg" @click="addCard()">
      <van-icon name="add-o" />
      <span>添加用户</span>
    </div>
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
  Icon,
  Popup,
  Button,
} from "vant";
import { newsQuery } from "@/api/showBrand";
import { getEmpowerUser, empowerToken } from "@/api/profit";

export default {
  data() {
    return {
      brandId: localStorage.getItem("brandId"),
      userId: localStorage.getItem("userId"),
      phone: localStorage.getItem("phone"),
      isLoading: false,
      isupLoading: false,
      finished: false,
      sonList: [],
      size: 100,
      page: 1,
      level: 1,
      title: "中介用户",
      status: "0",
      statusLsit: [
        { status: "0", title: "全部" },
        { status: "1", title: "已注册" },
        { status: "2", title: "已实名" },
        { status: "4", title: "已认证" },
        { status: "3", title: "已激活" },
      ],
      statusTrueFalseBy: false,
      fullname: "",
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Empty.name]: Empty,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Button.name]: Button,
  },
  computed: {},
  created() {
    this.title = JSON.parse(this.$route.params.title);
    this.level = JSON.parse(this.$route.params.level);
    this._getEmpowerUser();
  },
  methods: {
    addCard() {
      this.$router.push({
        name: "addUser",
        query: {},
      });
    },
    onClickLeft() {
      this.publicJs.back();
    },
    statusName(val) {
      var name = "";
      if (val == 0) {
        name = "全部";
      } else if (val == 1) {
        name = "已注册";
      } else if (val == 2) {
        name = "已实名";
      } else if (val == 3) {
        name = "已激活";
      } else if (val == 4) {
        name = "已认证";
      }
      return name;
    },
    next(path, type) {
      this.$router.push({ path: path });
    },
    _getEmpowerUser() {
      getEmpowerUser(this.page, this.size, this.fullname).then((res) => {
        this.sonList = [];
        if (res.resp_code == "000000") {
          if (res.result.length > 0) {
            this.sonList = res.result;
            this.isupLoading = false;
            if (this.sonList.length == this.size) {
              this.finished = false;
            } else if (this.size > this.sonList.length) {
              this.finished = true;
            } else {
              this.finished = true;
            }
            this.size += 10;
          } else {
            this.sonList = [];
            this.finished = true;
            this.isupLoading = true;
          }
        } else {
          this.sonList = [];
        }
      });
    },
    //立即还款
    repayment(item) {
      empowerToken(item.id).then((res) => {
        if (res.resp_code == "000000") {
          if (res.resp_message == "获取成功" || res.resp_message == "操作成功") {
            this.$router.push({
              name: "creditcard",
              query: { empowerToken: res.result },
            });
          }
          if (res.resp_message == "未实名") {
            this.$router.push({
              name: "faceRecognitionDetail", //实名认证
              query: { empowerToken: res.result, isBackAgentView: "1" },
            });
          }

          if (res.resp_message == "未绑定储蓄卡") {
            this.$router.push({
              name: "depositCardAdd",
              params: { type: 1 },
              query: { empowerToken: res.result, isBackAgentView: "1",realname:item.fullname},
            }); //绑卡页面
          }
        }
      });
    },
    userStatus(item) {
      var title = "";
      if (item.activeSatatus == 1 && this.status == 4) {
        title = "已认证";
      } else if (item.activeSatatus == 1 && this.status == 2) {
        title = "已实名";
      } else if (item.activeSatatus == 1) {
        title = "已激活";
      } else {
        if (item.realNameStatus == 0) {
          title = "实名中";
        } else if (item.realNameStatus == 1 && this.status == 4) {
          title = "已认证";
        } else if (item.realNameStatus == 1) {
          title = "已实名";
        } else if (item.realNameStatus == 2) {
          title = "实名失败";
        } else if (item.realNameStatus == 3) {
          title = "已注册";
        }
      }
      return title;
    },
    userStatusC(item) {
      var status = "";
      if (item.activeSatatus == 1 && this.status == 4) {
        status = "4";
      } else if (item.activeSatatus == 1 && this.status == 2) {
        status = "4";
      } else if (item.activeSatatus == 1) {
        status = "4";
      } else {
        if (item.realNameStatus == 0) {
          status = "0";
        } else if (item.realNameStatus == 1 && this.status == 4) {
          status = "4";
        } else if (item.realNameStatus == 1) {
          status = "1";
        } else if (item.realNameStatus == 2) {
          status = "2";
        } else if (item.realNameStatus == 3) {
          status = "3";
        }
      }
      return status;
    },
    statusSel(item) {
      this.status = item.status;
      this.statusTrueFalseBy = false;
      this.onSearch();
    },
    // 下拉刷新
    onRefresh() {
      this.page = 1;
      setTimeout(() => {
        this.$toast("刷新成功");
        this._getEmpowerUser();
        this.isLoading = false;
      }, 1000);
    },
    onLoad() {
      //上啦加载
      this.page = 1;
      setTimeout(() => {
        this._getEmpowerUser();
      }, 500);
    },
    onSearch() {
      this.size = 20;
      this._getEmpowerUser();
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

.profit_user_list {
  padding: 0 10px;
}

.profit_user_item_box {
  padding: 10px 15px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 13px;
}

.profit_user_item {
  display: flex;
}

.profit_user_item .cont {
  /* flex: 1; */
}

.profit_user_item .cont .title > span {
  font-size: 11px;
  display: inline-block;
  padding: 0 6px;
  border-radius: 5px;
}

.userStatus_1 {
  border: 1px solid #cccccc;
  background: #e8e8e8;
  color: #333333;
}

.userStatus_3 {
  border: 1px solid #cccccc;
  background: #e8e8e8;
  color: #999999;
}

.userStatus_0,
.userStatus_2,
.userStatus_4 {
  border: 1px solid #ffaf78;
  background: #ffefdd;
  color: #4cc566;
}

.profit_user_item .right {
  flex: 1;
}

.profit_user_item .left {
  width: 50px;
}

.profit_user_item .left > img {
  height: 40px;
  width: 40px;
  margin-top: 10px;
}

.profit_user_item .right {
  text-align: right;
}

.profit_user_item .tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.profit_user_item .phone {
  margin-top: 15px;
  color: #666;
}

.profit_user_item .phone span {
  vertical-align: middle;
}

.profit_user_item .phone img {
  height: 32px;
  width: 32px;
  vertical-align: middle;
  margin-left: 5px;
}

.agent_search {
  background: #fff;
  margin: 10px 0;
  border-radius: 10px;
}

.profit_user_search {
  display: flex;
  padding: 10px;
  font-size: 14px;
  background: #f5f5f5;
}

.profit_user_search .left {
  flex: 1;
}

.profit_user_search .right {
  width: 60px;
  text-align: right;
  line-height: 34px;
}

.profit_user_search .right img {
  height: 6px;
  width: 8px;
  vertical-align: middle;
  margin-left: 5px;
}

.profit_user_search >>> .van-search {
  padding: 0;
  border-radius: 10px;
}

.profit_user_search >>> .van-search__content {
  background: #fff;
  border-radius: 10px;
}

.profit_user_search_btn {
  color: #2574ea;
}

.agent_grade_name {
  display: inline-block;
  background: #4cc566;
  border-radius: 9px;
  padding: 0 8px;
  font-size: 11px;
  color: #fff;
  margin-left: 5px;
}

.user_empty >>> .van-empty__image img {
  height: auto;
}

.profit_user_transaction {
  background: rgba(255, 150, 48, 0.06);
  padding: 8px 15px;
  font-size: 11px;
  color: #333;
  display: flex;
  border-radius: 10px;
}

.profit_user_transaction div {
  flex: 1;
  line-height: 20px;
}

>>> .user_status.van-popup--right {
  top: 160px !important;
  right: 10px;
  border-radius: 3px;
}

.user_status_box {
  font-size: 14px;
}

.user_status_item {
  padding: 10px 15px;
  text-align: center;
}

.activeStatus {
  background: #4cc566;
  color: #fff;
}
.add_btn {
  color: #fff;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.add_btn span {
  padding-left: 5px;
}
</style>
