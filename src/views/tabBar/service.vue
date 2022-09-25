<template>
  <div>
    <van-nav-bar
      class="contact_nav"
      :border="false"
      title="客服中心"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="main">
      <div class="item">
        <h4 class="kefu">直接推荐人</h4>
        <a :href="'tel:' + prepreUserPhone">
          <p class="teler zi">
            手机号：{{ prepreUserPhone | dataHidden }}
            <img
              class="tel"
              src="../../assets/contact/phone_btn_online_icon.png"
              alt=""
            />
          </p>
          <p class="zi">
            直接推荐人是使用咔咔鼠的直接引导人,他可以为您提供咔咔鼠功能使用说明，推广引导等服务。
          </p>
        </a>
      </div>
      <div class="item online" @click="meiqia">
        <p class="online">
          <van-icon
            name="chat-o"
            size="20px"
            :dot="$store.state.user.unread != 0"
          />
          在线客服
        </p>
        <p class="zi">
          服务时间：每天9:00-21:00
          <van-tag type="warning">&nbsp;点击进入&nbsp;</van-tag>
        </p>
      </div>
      <div class="item">
        <div>
          <span class="kefu">微信客服：</span>
        </div>
        <p class="zi pp" style="margin-top:15px">
          客服小贝:card-time
          <span @click="copyShaneWxServe('card-time')" style="color: red"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复制微信号</span
          >
        </p>
        <p class="zi pp">
          客服小淇:cardtime01
          <span @click="copyShaneWxServe('cardtime01')" style="color: red"
            >&nbsp;&nbsp;&nbsp;&nbsp;复制微信号</span
          >
        </p>
        <p class="zi pp">
          客服小琪:cardtime02
          <span @click="copyShaneWxServe('cardtime02')" style="color: red"
            >&nbsp;&nbsp;&nbsp;&nbsp;复制微信号</span
          >
        </p>
      </div>



      <div class="item" >
        <div>
          <h4 class="kefu">官方统一热线：</h4>
          <a :href="'tel:' + '4008877555'">
            <p class="teler zi">
              电话：4008877555
              <img
                class="tel"
                src="../../assets/contact/phone_btn_online_icon.png"
                alt=""
              />
            </p>
          </a>
        </div>
      </div>
      <div class="item">
        <div class="liu" @click="leave()">
          <span class="kefu">客服留言: </span>
          <span><van-badge :content="num" v-show="num" /></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar, Icon, Tag, Badge } from "vant";
import { brandQuery } from "@/api/showBrand";
import { preUserQuery } from "@/api/user";

export default {
  data() {
    return {
      prepreUserPhone: "13336816566",
      brandPhone: "13336816566",
      num: "",
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [Badge.name]: Badge,
  },
  created() {
    this.num = this.$route.params.num;
    this._preUserQuery();
    this.getBrand();
  },
  methods: {

    copyShaneWxServe(phone) {
      var input = document.createElement("input"); // 直接构建input
      input.value = phone; // 设置内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$toast({ message:"微信号"+phone+ "已成功复制到粘贴板", position: "bottom" });
      window.location.href = "weixin://";

    },
    meiqia() {
      _MEIQIA("init");
      _MEIQIA("showPanel");
    },
    leave() {
      this.$router.push({ name: "leave" });
    },
    getBrand() {
      brandQuery(this.global.brandId).then((res) => {
        if (res.resp_code == "000000") {
          this.brandList = res.result;
          this.brandPhone = res.result.brandPhone;
        } else {
          this.$toast({ message: res.data.resp_message, position: "bottom" });
        }
      });
    },
    _preUserQuery() {
      preUserQuery(this.global.brandId, localStorage.getItem("phone")).then(
        (res) => {
          if (res.resp_code == "000000") {
            this.prepreUserPhone = res.result.preUserPhone;
          }
        }
      );
    },
    onClickLeft() {
      window.history.back();
      return;
    },
  },
};
</script>
<style scoped>
.van-tag--warning {
  padding: 2px;
  position: absolute;
  bottom: 3px;
  right: -15px;
  font-size: 11px;
  background-color: #9B3C9D;
}

.online {
  color: #000;
  text-align: center;
  font-weight: 400;
  vertical-align: middle;
  font-size: 15px;
}

.kefu {
  font-size: 18px;
  font-weight: 600;
  margin-right: 5px;
  color: #000;
}

.item {
  padding: 15px;
  margin: 20px auto;
  box-shadow: 0px 1px 15px 1px #e7e7e7;
  font-size: 15px;
  border-radius: 5px;
}

.tel {
  float: right;
}

.teler {
  padding: 5px 0px;
}

.zi {
  position: relative;
  color: rgb(123, 123, 123);
  font-size: 14px;
  margin-top: 5px;
  font-weight: 400;
}

.item img {
  width: 22px;
}
.item .pp {
  height: 35px;
}

.main {
  padding: 60px 25px 0px 25px;
  background-color: #fff;
  height: 100vh;
}

>>> .contact_nav {
  background: linear-gradient(180deg, #9B3C9D 0%, #9B3C9D 100%) !important;
}

>>> .van-nav-bar__title,
>>> .van-nav-bar__arrow {
  color: #fff;
}

.liu {
  display: flex;
  justify-content: space-between;
}
</style>
