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
          <img src="@/assets/home/information.png" alt="">
        </div>
      </div>
    </div>
    <div class="warpper_top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text="加载中...">
      <div>
        <div class="nav_box bgcont">
          <ul class="nav_list">
            <li class="nav_item right_border">
              <img src="../../assets/home/nav_quick_icon.png" @click="next('/online',8)" alt="">
              <div class="">在线收款</div>
            </li>
            <li class="nav_item" @click="next('/creditcard','2')">
              <img src="../../assets/home/nav_creditcard_icon.png" alt="">
              <div class="">智能还款</div>
            </li>
          </ul>
        </div>
        <div class="menu_box">
          <ul class="menu_list">
<!--            <li class="menu_item" @click="next('/agent',8)">-->
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

      

          </ul>
        </div>
        
        <div class="cont">
          <div class="news">
            <div class="left">
              <img src="../../assets/home/news_icon.png" alt="">
            </div>
            <div class="right" @click="next('/service',8)">
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
                  <img :src="image.imgurl" @click="huodong(image)"/>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
          <div class="skip">
            <div @click="$router.push('/sharePage')" class="skip_share">
              <h5>分享推广</h5>
              <p>推广越多/赚的越多</p>
            </div>
            <div @click="$router.push('/library')" class="skip_item">
              <h5>一键朋友圈</h5>
              <p>一键推广/省时省力</p>
            </div>
            <div @click="$router.push('/partnerBusiness')" class="skip_material">
              <h5>推广物料</h5>
              <p>应有尽有/丰富多彩</p>
            </div>
            <div @click="$router.push('/news')" class="skip_news">
              <h5>业内动态</h5>
              <p>了解动态/运筹帷幄</p>
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
import {
  PullRefresh, NoticeBar, Swipe, SwipeItem, Icon, Grid, GridItem, Image
} from 'vant';
import cardconfirm from '@/components/confirm/alert'
import tabbar from '@/components/tabbar'
import {getBanner, newsQuery, getBrandNews, getMessage} from '@/api/showBrand'
import {userJpushHistory, userInfoQuery,getVersionnumber} from '@/api/user'
import { formatTime } from "@/utils/util";

export default {
  data() {
    return {
      dot: false,
      token: localStorage.getItem('token'),
      phone: localStorage.getItem('phone'),
      userId: localStorage.getItem('userId'),
      isLoading: false,
      bannerListDef: [],
      fuwuList: [],
      newsList: [],
      serviceNum: [],
      msg: ''
    };
  },
  components: {
    [PullRefresh.name]: PullRefresh,
    [NoticeBar.name]: NoticeBar,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Image.name]: Image,
    tabbar,
    cardconfirm
  },
  created() {
    this.isRealname()
    this.getBanners(0)
    this._getBrandNews()
    this._newsQuery()
    //查询服务器版本号
    this._getVersion()
  },
  watch: {
    '$store.state.user.unread': value => {
      if (value > 0) {
        this.dot = true
      } else {
        this.dot = false
      }
    }
  },
  methods: {
        //中介代还
    zhongjiedaihuan() {
      this.$router.push({
        name: "profitAgent",
        params: { level: "1", title: "中介用户" },
      });
    },
        //团队管理
    teamManager() {
      this.$router.push({ name: "teamManager" });
    },
    _getVersion(){
      getVersionnumber(this.global.brandId).then(res=>{
        var h5Version =  localStorage.getItem("h5Version");
        if (!h5Version) {
           h5Version = 0
        }
        if (h5Version < res.result.h5Version) {
          localStorage.setItem("h5Version", res.result.h5Version);
          location.reload()
        }
      })
    },
    isRealname() {
      userInfoQuery(this.token).then(res => {
        if (res.resp_code == '000000') {
          if (res.result.realnameStatus != '1') {
            this.$dialog.confirm({
              title: '温馨提示',
              message: '您的账号未实名，为了保证正常使用功能请进行实名！',
              confirmButtonText: '去实名',
              cancelButtonText: '暂不实名'
            }).then(() => {
              this.$router.push({name: "faceRecognitionDetail"});
            })
          }
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    _newsQuery(type) {
      newsQuery(this.global.brandId, '功能跳转').then(res => {
        if (res.resp_code == '000000') {
          this.fuwuList = res.result.content
        }
      })
    },
    //--------查询用户留言-----------
    _getMessage() {
      getMessage(this.userId).then(res => {
        let serviceNum = []
        if (res.resp_code == '000000') {
          res.result.forEach(item => {
            if (item.type == 0) {
              serviceNum.push(item)
            }
          });
          this.serviceNum = [...new Set(serviceNum)]
          if (this.$store.state.user.unread < this.serviceNum.length) {
            let num = this.$store.state.user.unread += this.serviceNum.length
            this.$store.commit('Unread', num)
          } else {
            return
          }
        }
      })
    },
    _getBrandNews() {
      getBrandNews(localStorage.getItem('token'), 20).then(res => {
        if (res.resp_code == '000000') {
          if(res.result.content.length > 0){
            let showTime = localStorage.getItem("showTime")
            let today = new Date()
            today.setHours(0)
            if (showTime == null || parseInt(showTime) < today.getTime()){
              for(let index in res.result.content){
                if(res.result.content[index].btype == 'marquee' && res.result.content[index].endTime > formatTime(new Date())){
                  this.msg = res.result.content[index].content
                  this.$refs.platformMessage.disopen()
                  localStorage.setItem("showTime", new Date().getTime+'')
                  break
                }
              }
            }
          }
          this.getUserPush(res.result.content)
        }
      })
    },
    // 获取个人消息
    getUserPush(list) {
      userJpushHistory(localStorage.getItem('token'), 20).then(res => {
        if (res.resp_code == "000000") {
          this.newsList = [...res.result.content, ...list]
        } else {
          this.$toast({message: res.resp_message, position: 'bottom'})
        }
      })
    },
    huodong(item) {
      if (item.url) {
        window.open(item.url)
      } else {
        this.$toast({message: '暂无活动地址', position: 'bottom'})
      }
    },
    link(item) {
      let num = 0
      var ua = window.navigator.userAgent.toLowerCase();
      this.fuwuList.map((key) => {
        if (item == '办信用卡链接' && ua.match(/MicroMessenger/i) == 'micromessenger') {
          this.$toast({
            message: '请使用浏览器打开本页面或APP申请',
            position: 'bottom'
          })
          return
        }
        if (key.remark == item) {
          //var url = key.content + '?phone=' + this.phone + '&token=' + this.token + '&brandId=' + this.global.brandId + '&userId=' + this.userId + '&ip=' + this.global.ip + '&deviceId=' + localStorage.getItem('kd_webapp_deviceId')
         //修改办卡链接
         var url = 'https://m.hhrcard.com/credit/miniprogram/copartner/banklist?invitecode=15381379&oas=1&platform_id=1002';

          
          this.$router.push({
            name: 'appLink',
            params: {
              url: JSON.stringify(url),
              title: JSON.stringify(key.remark),
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
    next(path, type) {
      if (path == '/online' || path == '/creditcard') {
        userInfoQuery(this.token).then(res => {
          if (res.resp_code == '000000') {
            if (res.result.realnameStatus != '1') {
              this.$dialog.confirm({
                title: '温馨提示',
                message: '您的账号未实名，为了保证正常使用功能请进行实名！',
                confirmButtonText: '去实名',
                cancelButtonText: '暂不实名'
              }).then(() => {
                this.$router.push({name: "faceRecognitionDetail"});
              })
            } else {
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
                })
              }else if(type == '2'){
                this.$router.push({name: 'creditcard', params: {token: null}})
              }
            }
          } else {
            this.$toast({message: res.resp_message, position: 'bottom'})
          }
        })
      }else{
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
          })
        }else if(type == '2'){
          this.$router.push({name: 'creditcard'})
        }else{
          this.$router.push(path)
        }
      }
    },
    // 获取轮播图
    getBanners(type) {
      getBanner(this.global.brandId, type).then(res => {
        if (res.resp_code == '000000') {
          this.bannerListDef = res.result
        }
      })
    },
    showMsg(){
      this.$toast({message: '该功能暂未开放', position: 'bottom'})
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getBanners(0)
        this._getBrandNews()
        this._getMessage()
        // this._newsQuery()
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    },
    meiqia() {
      this.$router.push({name: 'service', params: {num: this.serviceNum.length}})
    }
  }
}
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
  width: 55px;
}

.home_header_title {
  font-size: 17px;
}

.tabbar_p {
  height: 50px;
  width: 100%;
}

.nav_box {
  height: 140px;
  width: 100%;
  padding: 20px 0;
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
  height: 40px;
  width: 40px;
}

.menu_box {
  padding: 33px 0;
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
  height: 34px;
  width: 34px;
}

.cont {
  padding: 0 10px;
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
  width: 68px;
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
  border-left: 2.5px solid #3AC461;
  padding: 0 10px;
}

.activity_bg img {
  border-radius: 5px;
  max-width: 100%;

}

.bg {
  background-image: url('../../assets/home/top_bg.png');
  /* background-color: #3AC461; */
  background-size: 100%;
}

.bgcont {
  background-image: url('../../assets/home/top_bg.png');
  background-size: 100%;
  background-position: 0px -46px;

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
  background: url('../../assets/home/skip_share.png') no-repeat;
  background-size: 100%;
}

.skip_item {
  background: url('../../assets/home/skip_item.png') no-repeat;
  background-size: 100%;
}

.skip_material {
  background: url('../../assets/home/skip_material.png') no-repeat;
  background-size: 100%;
}

.skip_news {
  background: url('../../assets/home/skip_news.png') no-repeat;
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
