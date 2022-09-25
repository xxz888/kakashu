<template>
  <div class="home">
    <!-- 头部导航 -->
    <div class="home_header bg ">
      <div class="home_header_item">
      </div>
      <div class="home_header_title">首页</div>
      <div class="home_header_item" @click="meiqia">
        <div class="home_header_right">
          <span v-show="$store.state.user.unread" class="dot">{{ $store.state.user.unread }}</span>
          <img src="@/assets/home/分组@2x.png" alt="">
        </div>
      </div>
    </div>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="nav_box bgcont ">
          <ul class="nav_list">
            <li class="nav_item right_border">
              <img src="../../assets/gn1.png" @click="next('/online',8)" alt="">
            </li>

             <li class="nav_item" @click="kongkaClick">
              <img src="../../assets/gn2.png" alt="">
            </li>


            <li class="nav_item" @click="next('/creditcard','1')">
              <img src="../../assets/gn3.png" alt="">
            </li>
          </ul>
        </div>
        <div class="menu_box">
              <ul class="menu_list">
<!--            <li class="menu_item" @click="next('/agent',8)">-->
            <li class="menu_item" @click="huabeiAction">
              <img src="../../assets/组 17823@2x.png" alt="">
              <div class="mt--5">花呗收款</div>
            </li>
            <li class="menu_item" @click="zhongjiedaihuan">
              <img src="../../assets/组 17824@2x.png" alt="">
              <div class="mt--5">中介代还</div>
            </li>
            <li class="menu_item" @click="cardApply">
              <img src="../../assets/组 17822@2x.png" alt="">
              <div class="mt--5">在线办卡</div>
            </li>
            <li class="menu_item" @click="zengzhiAction">
              <img src="../../assets/组 17825@2x.png" alt="">
              <div class="mt--5">增值业务</div>
            </li>

      

          </ul>



          <ul class="menu_list mt-10">
            <li class="menu_item" @click="teamManager">
              <img src="../../assets/组 17829@2x.png" alt="">
              <div class="mt--5">团队管理</div>
            </li>
            <li class="menu_item" @click="next('/agent', 8)">
              <img src="../../assets/组 17828@2x.png" alt="">
              <div class="mt--5">顶级代理</div>
            </li>
            <li class="menu_item" @click="next('/credit', 8)">
              <img src="../../assets/组 17827@2x.png" alt="">
              <div class="mt--5">信用管理</div>
            </li>
            <li class="menu_item" @click="operationVideo()">
              <img src="../../assets/组 17826@2x.png" alt="">
              <div class="mt--5">操作视频</div>
            </li>
          </ul>
        </div>
        
          <!-- <ul class="menu_list mt-30">
            <li class="menu_item" @click="teamManager">
              <img src="../../assets/home/menu_rep_icon.png" alt="">
              <div class="">团队管理</div>
            </li>
            <li class="menu_item" @click="zhongjiedaihuan">
              <img src="../../assets/home/menu_profit_icon.png" alt="">
              <div class="">中介代还</div>
            </li>
            <li class="menu_item" @click="link('办信用卡链接')">
              <img src="../../assets/home/menu_creditcard_icon.png" alt="">
              <div class="">信用卡办卡</div>
            </li>
            <li class="menu_item" @click="next('/huabei')">
              <img src="../../assets/home/menu_agnet_icon.png" alt="">
              <div class="">花呗收款</div>
            </li>
          </ul> -->
        <div class="cont">
          <div class="news">
            <div class="left">
              <img src="../../assets/组 17813@2x.png" alt="">
            </div>
            <div class="right" @click="toMessage">
              <van-notice-bar :scrollable="false" background="none" class="home_notivce">
                <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                  <van-swipe-item v-for="(item,index) in newsList" :key='index'>
                    <div class="new_swipe">
                      <span>发布日期 {{ item.createTime }}</span>
                      <div class="van-ellipsis">{{ item.content }}</div>
                    </div>
                  </van-swipe-item>
                </van-swipe>
              </van-notice-bar>
            </div>
            <div class="icon">
              <van-icon class="icon_icon" size="16" name="arrow"/>
            </div>
          </div>
          <div class="activity_box">
            <div>
              <van-swipe class="activity_bg" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(image, index) in bannerListDef" :key="index">
                  <img  :src="image.imgurl" @click="clickSwipeItem(image)"/>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
          <div class="skip">
            <div @click="$router.push('/sharePage')" class="skip_share">
       
            </div>
            <div @click="$router.push('/library')" class="skip_item">
        
            </div>
            <div @click="kongkaClick" class="skip_material">
       
            </div>
            <div @click="kongkaClick" class="skip_news">
       
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="tabbar_p"></div>



    <cardconfirm ref="platformMessage" but='1' :src='require("@/assets/alert/alert.png")'
                 :zi='msg'/>
    <tabbar></tabbar>
  </div>
</template>

<script>
import { PullRefresh, NoticeBar, Swipe, SwipeItem, Icon, Dialog } from "vant";
import tabbar from "@/components/tabbar";
import { userInfoQuery } from "@/api/user";
import {
  getBanner,
  newsQuery,
  getBrandNews,
  getMessage,
} from "@/api/showBrand";
// import guide from "@/components/guide/guide";
import Cookies from "js-cookie";
import cardconfirm from '@/components/confirm/alert'

export default {
  data() {
    return {
      dot: false,
      shougonggao: false,
      token: localStorage.getItem("token"),
      phone: localStorage.getItem("phone"),
      userId: localStorage.getItem("userId"),
      isLoading: false,
      bannerListDef: [],
      fuwuList: [],
      newsList: [],
      serviceNum: [],
      msg:''
    };
  },
  components: {
    [PullRefresh.name]: PullRefresh,
    [NoticeBar.name]: NoticeBar,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    tabbar,
    [Dialog.Component.name]: Dialog.Component,
    cardconfirm
    
  },
  created() {
    this.getBanners(0);
    this._getBrandNews();
    this._newsQuery();
    this._getMessage();
    this.isSealname();
  },
  activated() {
    this._getMessage();
  },
  beforeRouteEnter(to, from, next) {
    //如果上个页面是绑卡页面或者登录页面执行下面方法
    if (from.name == "depositCardAdd" || from.name == "login") {
      next((vm) => {
        vm.isSealname();
      });
    }
    next();
  },
  watch: {
    "$store.state.user.unread": (value) => {
      //监听存储的客服消息客服按钮判断显示状态
      if (value > 0) {
        this.dot = true;
      } else {
        this.dot = false;
      }
    },
  },
  methods: {
    //点击公告
    clickSwipeItem(item) {
      // window.location.href= 'https://mp.weixin.qq.com/s/QWriPiQ2tcx_aeBFiV2m3Q';
      var url =
      item.id == 10 ? 'https://kashijian.oss-cn-hangzhou.aliyuncs.com/banner1.png' :
      item.id == 12 ? 'https://kashijian.oss-cn-hangzhou.aliyuncs.com/banner2.png' :
      item.id == 13 ? 'https://kashijian.oss-cn-hangzhou.aliyuncs.com/banner3.png' :
      (item.title.indexOf('喜报') || item.title == '') ? 'https://kashijian.oss-cn-hangzhou.aliyuncs.com/banner4.png' : ''
      this.$router.push({
        name: "appLink",
        params: {
          url: JSON.stringify(
            url
          ),
          title: item.title,
          type: "2",
        },
      });
    },
    //团队管理
    teamManager() {
      this.$router.push({ name: "teamManager" });
    },
    //操作视频
    operationVideo() {
      this.$router.push({ name: "operationVideo" });
    


      
    },
    //消息
    toMessage(){
  this.$router.push({ name: "message" });
    },
    
    //空卡
    kongkaClick() {
      this.$toast({ message: "敬请期待", position: "bottom" });
    },
    hdt() {
      this.$toast("暂未开放");
    },
    //花呗
    huabeiAction() {
      this.$router.push({ name: "huabei" });
    },
    //中介代还
    zhongjiedaihuan() {
      this.$router.push({
        name: "profitAgent",
        params: { level: "1", title: "中介用户" },
      });
    },
    //风控
    zengzhiAction() {
        this.$router.push({ name: "Addserve" });
    },
    isSealname() {
      // 判断存储在本地的实名状态如果已实名开始判断认证状态
      if (
        localStorage.getItem("realnameStatus") != 1 &&
        localStorage.getItem("realnameStatus") != null
      ) {
        this.$router.push({ name: "faceRecognitionDetail" }); //实名认证
      } else {
        this._getUserMessage();
      }
    },
    //-----------获得用户信息-----------
    _getUserMessage() {
      userInfoQuery(localStorage.getItem("token")).then((res) => {
        if (res.resp_code == "000000") {
          if (res.result.verificationStatus == 0) {
            // this.$dialog
            //   .confirm({
            //     title: "温馨提示",
            //     message:
            //       "恭喜您注册实名成功，请认证信用卡，首刷认证后可获得10元奖励",
            //     confirmButtonText: "开始认证",
            //     cancelButtonText: "下次认证",
            //   })
            //   .then(() => {
            //     this.$store.commit("guide");
            //   });
          } else {
            this.$store.commit("closeGuide");
          }
        }
      });
    },
    _newsQuery(type) {
      newsQuery(this.global.brandId, "功能跳转").then((res) => {
        if (res.resp_code == "000000") {
          this.fuwuList = res.result.content;
        }
      });
    },
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then((res) => {
        let serviceNum = [];
        if (res.resp_code == "000000") {
          res.result.forEach((item) => {
            if (item.type == 0) {
              serviceNum.push(item);
            }
          });
          this.serviceNum = [...new Set(serviceNum)];
          if (this.$store.state.user.unread < this.serviceNum.length) {
            let num = (this.$store.state.user.unread += this.serviceNum.length);
            this.$store.commit("Unread", num);
          } else {
            return;
          }
        }
      });
    },
    _getBrandNews() {
      getBrandNews(this.token, 20).then((res) => {
        if (res.resp_code == "000000") {
          this.newsList = res.result.content;

          if (res.result.content.length != 0) {
            var endTime = this.dateToTimestamp(res.result.content[0].endTime);
            var currentTime = Date.parse(new Date());

            var isshow;
            var valueId;
            if (localStorage.getItem("kd_l_isshow")) {
              isshow = localStorage.getItem("kd_l_isshow").split("||")[0];
              valueId = localStorage.getItem("kd_l_isshow").split("||")[1];
            }

            if (
              isshow == 1 &&
              valueId == res.result.content[0].id &&
              res.result.content[0].btype == "androidVersion"
            ) {
            } else {
              this.$dialog
                .alert({
                  messageAlign: "left",
                  title: res.result.content[0].title,
                  message: res.result.content[0].content,
                  theme: "round-button",
                })
                .then(() => {
                  var value = "1||" + res.result.content[0].id;
                  localStorage.setItem("kd_l_isshow", value);
                });
            }
          }
        }
      });
    },
    dateToTimestamp(dateStr) {
      if (!dateStr) {
        return "";
      }
      let newDataStr = dateStr.replace(/\.|\-/g, "/");
      let date = new Date(newDataStr);
      let timestamp = date.getTime();
      return timestamp;
    },
    cardApply() {
      this.$router.push("/card/apply");
    },
    reloadVC(){
      location.reload()
    },
    link1() {
      this.$router.push({
        name: "appLink",
        params: {
          url: JSON.stringify(
            "https://mp.weixin.qq.com/s/zxjORAQFlk0X4R9Y0n_-qw"
          ),
          title: JSON.stringify("关于卡德世界收购公告"),
          type: "0",
        },
      });
    },
    link(item) {
      let num = 0;
      var ua = window.navigator.userAgent.toLowerCase();
      this.fuwuList.map((key) => {
        if (item == "信用卡办卡") {
          this.$toast({
            message: "网申渠道更新",
            position: "bottom",
          });
          return;
        }
        if (key.title == item) {
          var url =
            key.content +
            "?phone=" +
            this.phone +
            "&token=" +
            this.token +
            "&brandId=" +
            this.global.brandId +
            "&userId=" +
            this.userId +
            "&ip=" +
            this.global.ip +
            "&deviceId=" +
            localStorage.getItem("kd_webapp_deviceId");
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
    next(path, type) {
      // 判断存储在本地的实名状态如果已实名开始判断认证状态
      if (
        localStorage.getItem("realnameStatus") != 1 &&
        localStorage.getItem("realnameStatus") != null
      ) {
        this.$router.push({ name: "faceRecognitionDetail" }); //实名认证
      } else {
        if (type == 8) {
          this.$router.push({ path: path });
        } else if (type == 1) {
          this.$router.push({
            path: path,
            query: {
              phone: this.phone,
              token: this.token,
              brandId: this.global.brandId,
              userId: this.userId,
              ip: this.global.ip,
              type: "h5",
              deviceId: localStorage.getItem("did"),
            },
          });
        }
      }
    },
    // 获取轮播图
    getBanners(type) {
      getBanner(this.global.brandId, type).then((res) => {
        if (res.resp_code == "000000") {
          this.bannerListDef = res.result;
        }
      });
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getBanners(0);
        this._getBrandNews();
        this._getMessage();
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
    meiqia() {
      this.$router.push({
        name: "service",
        params: { num: this.serviceNum.length },
      });
    },
  },
};
</script>
<style scoped>
.ke {
  font-size: 13px;
}

.home {
  height: 100vh;
  background: #fff;
}

.home_header {
  display: flex;
  justify-content: space-between;
  border: none;
  width: 100%;
  align-items: center;
  padding: 0 14px;
  box-sizing: border-box;
  height: 46px;
  position: fixed;
  z-index: 999;
  color: #fff;
}

.home_header img {
  width: 20px;
  margin-right: 8px;
}

.home_header_item {
  display: flex;
  align-items: center;
  font-size: 11px;
  padding-top: 5px;
}

.home_header_title {
  font-size: 17px;
  color: #333;
}

.tabbar_p {
  height: 50px;
  width: 100%;
}

.nav_box {
  margin-top: 20px;
  height: 100px;
  width: 100%;
  color: #fff;
  font-size: 13px;
}

.nav_list {
  display: flex;
}

.nav_item {
  flex: 1;
  text-align: center;
}

.nav_item img {
  height: 50px;
}

.menu_box {
  width: 100%;
  border-radius: 30px 30px 0px 0px;
  margin-top: -30px;
  position: relative;
  z-index: 111;
  background: #fff;
}

.menu_list {
  display: flex;
  font-size: 12px;
  color: #333;
}

.menu_item {
  flex: 1;
  text-align: center;

}

.menu_item img {
  height: 68px;
  width: 68px;
}

.cont {
  padding: 10px 10px;
  margin-top: 15px;
  background: #fff;
}

.news {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background: #F5F5F5;
  border-radius: 10px;
  display: flex;
  height: 50px;
  font-size: 12px;
}

.news .left img {
  width: 20px;
  margin-top: 5px;
  max-width: 100%;
}

.news .left {
}

.news .right {
  flex: 1;
}

.news .icon {
  width: 20px;
  position: relative;
}

.news .icon .icon_icon {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 16px;
  color: #666;
}

.home_notivce {
  height: 35px;
}

.new_swipe span {
  color: #999;
  font-size: 12px;
  line-height: 12px;
}

.new_swipe div {
  color: #666;
  font-size: 13px;
  line-height: 13px;
}

.new_swipe p {
  font-size: 14px;
  color: #333;
  line-height: 20px;
}

.notice-swipe {
  height: 46px;
}

.activity_title {
  padding: 15px 10px;
}

.activity_title > span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: inline-block;
  border-left: 2.5px solid #9B3C9D;
  padding: 0 10px;
}

.activity_bg img {
  border-radius: 5px;
  max-width: 100%;

}

.bg {
  /* background-image: url('../../assets/home/top_bg.png'); */
  background-color: #fff;
  background-size: 100%;
}

.bgcont {
  /* background-image: url('../../assets/home/top_bg.png'); */
  background-size: 100%;
  margin-left: 16px;
  width: calc(100% - 32px);
}

.skip {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.skip div {
  width: 47%;
  height: 70px;
  margin: 5px 0px;
  font-size: 12px;
  color: #fff;
  padding-left: 15px;
  padding-top: 15px;
}

.skip h5 {
  font-size: 15px;
  margin-bottom: 2px;
}

.skip_share {
  background: url('../../assets/组 17830@2x.png') no-repeat;
  background-size: 100%;
}

.skip_item {
  background: url('../../assets/组 17831@2x.png') no-repeat;
  background-size: 100%;
}

.skip_material {
  background: url('../../assets/组 17833@2x.png') no-repeat;
  background-size: 100%;
}

.skip_news {
  background: url('../../assets/组 17832@2x.png') no-repeat;
  background-size: 100%;
}

.home_header_right {
  position: relative;
}

.home_header_right .dot {
  top: -5px;
  right: 0px;
  position: absolute;
  color: #fff;
  display: inline-block;
  background-color: red;
  font-size: 10px;
  text-align: center;
  line-height: 12px;
  padding: 0px 3.5px;
  height: 12px;
  border-radius: 6px;
}
</style>
