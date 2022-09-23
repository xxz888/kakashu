<template>
  <div class="login">
    <div class="top">
      <img class="login_logo" src="@/assets/login/login_logo.png" alt="">
      <p>心有多大 舞台就有多大</p>
    </div>
    <div class="cont">
      <ul class="list">
        <li class="item theme_border_b">
          <div class="switchover">
            <span :class="active ? 'active' : 'noactive'" @click="active = !active">注册账号</span>
            <span :class="!active ? 'active' : 'noactive'" @click="active = !active">密码登录</span>
          </div>

          <div class="input">
            <div class="right">
              <van-field v-model="phone" type="number" clearable placeholder="请输入手机号" maxlength="11"/>
            </div>
          </div>
        </li>

        <li class="item " v-show="active">
          <div class="input theme_border_b">
            <div class="">
              <van-field v-model="smsCode" clearable type="number" placeholder="请输入短信验证码" maxlength="6">
                <template #button>
                  <div class="sms" @click="message == '发送验证码' ? getCode() : ''">
                    {{ message }}
                  </div>
                </template>
              </van-field>
            </div>
          </div>

          <div class="input theme_border_b">
            <div class="">
              <van-field v-model="regPwd" clearable type="password" placeholder="请输入密码，6-16位数字字母组合">
              </van-field>
            </div>
          </div>

          <div class="input theme_border_b">
            <div class="">
              <van-field v-model="preUserPhone" clearable type="number" maxlength="11" placeholder="推荐人手机号">
              </van-field>
            </div>
          </div>
          <p v-if="geMeiqia" class="forget"><span @click="meiqia">收不到验证码?点我</span></p>

        </li>

        <!-- 密码登录 -->
        <div v-show="!active">
          <li class="item theme_border_b">
            <div class="input">
              <div class="">
                <van-field v-model="password" clearable type="password" placeholder="请输入密码">
                </van-field>
              </div>
            </div>
          </li>
          <p class="forget"><span @click="forget">忘记密码?</span></p>
        </div>
        <!-- 密码登录 -->
      </ul>


      <div class="btn" @click="confirm">立即登录</div>
      <div class="login_tips" @click="pull">
        登录即代表已同意 <span>《八色生活服务协议》</span>
      </div>
    </div>
  </div>
</template>

<script>
import {Field} from "vant";
import Cookies from "js-cookie";
import {smsSend, smsLogin, userLogin, register} from "@/api/login";

export default {
  data() {
    return {
      active: false,
      brandId: this.global.brandId,
      password: '',
      phone: "",
      smsCode: "",
      num: 60,
      message: "发送验证码",
      preUserPhone: '',
      regPwd: '',
      geMeiqia: window.eventBus.geMeiqia, //是否有美洽

    };
  },
  components: {
    [Field.name]: Field,
  },
  created() {
    this.phone = Cookies.get("kd_l_phone");
  },
  beforeRouteEnter: (to, from, next) => {
    if ((from.name == null || from.name == '') && localStorage.getItem('token')) { //判断从哪个页面进入如果有token 并且不是从退出登录进入 直接跳入主页
      next(vm => {
        vm.nextReplace()
      })
    }
    next()
  },
  methods: {
    nextReplace() {
      this.$router.replace({name: 'home'})
    },
    time() {
      let timer = setInterval(() => {
        this.message = "(" + this.num + ")秒";
        this.num--;
        if (this.num == 0) {
          clearInterval(timer);
          this.num = 60;
          this.message = "发送验证码";
        }
      }, 1000);
    },
    // 获取验证码
    getCode() {
      smsSend(this.brandId, this.phone).then((res) => {
        if (res.resp_code == "000000") {
          this.time();
          this.$toast({message: res.resp_message, position: "bottom"});
        }
      })
    },
    //注册
    regconfirm() {
      if (this.smsCode == "") {
        this.$toast({message: "请先获取输入验证码", position: "bottom"});
        return;
      }
      if (!this.regPwd) {
        this.$toast({message: "请设置密码", position: "bottom"});
        return;
      }
      //
      if (this.publicJs.isPhoneNumber(this.preUserPhone)) {
        this.$toast({message: "推荐人手机号码有误,请重填", position: "bottom"});
        return;
      }
      register(this.brandId, this.phone, this.smsCode, this.preUserPhone, this.regPwd).then(res => {
        if (res.resp_code == "000000") {
          this.active = false
          this.password = this.regPwd
          this.$toast({message: "注册成功", position: "bottom"});
        }
      }, err => {
        this.$toast({message: "注册失败", position: "bottom"});
      })

    },
    //跳转客服界面
    meiqia(){
      _MEIQIA('init')
      _MEIQIA('showPanel')
    },
    //登录
    confirm() {
      if (this.publicJs.isPhoneNumber(this.phone)) {
        this.$toast({message: "手机号码有误，请重填", position: "bottom"});
        return;
      }
      if (this.active) {
        this.regconfirm()
      } else {
        if (this.password == '') {
          this.$toast({message: "密码不能为空", position: "bottom"})
          return
        } else if (this.password.length < 6) {
          this.$toast({message: "密码不能小于6位", position: "bottom"})
          return
        }
        userLogin(this.phone, this.password, this.brandId).then(res => {
          if (res.resp_code == "000000") {
            localStorage.setItem("userId", res.result.id);
            localStorage.setItem("phone", res.result.phone);
            localStorage.setItem("token", res.result.userToken);
            localStorage.setItem("ip", this.global.ip);
            localStorage.setItem("userName", res.result.fullname);
            localStorage.setItem("loginT", true);
            localStorage.setItem('brandId', res.result.brandId)
            this.deviceId();
            Cookies.set("kd_l_phone", this.phone);

            sessionStorage.setItem("userName", res.result.fullname);
            sessionStorage.setItem("phone", res.result.phone);
            this.$router.push({name: "home"});
          }
        })
      }
    },
    deviceId() {
      const platform = Math.ceil(navigator.platform.length / 3);
      let str = "";
      let num = 0;
      const arr = returnCitySN["cip"].split(".");
      arr.forEach((item, i) => {
        if (i != arr.length - 1) {
          str += item + navigator.platform.substring(num, num + platform);
          num += platform;
        } else {
          str += item;
        }
      });
      localStorage.setItem("kd_webapp_deviceId", str);
    },
    pull() {
      this.$router.push({name: "pull"});
    },
    forget() {
      this.$router.push({name: 'userpassword'})
    }
  }
}
</script>
<style scoped lang='less'>
.forget {
  margin-top: 12px;
  color: #3AC461;
  font-size: 12px;
  text-align: right;
}

.active {
  // border-bottom: 2px solid#3AC461;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.noactive {
  color: #aaa;
}

.login_logo {
  width: 100px;
  margin-top: 80px;
  margin-bottom: 5px;
}

.theme {
  margin-right: 15px;
}

.login {
  background: #fff;
  height: 100vh;
}

.top {
  background: #3AC461;
  color: #fff;
  font-size: 15px;
  background-size: 100% 100%;
  height: 300px;
  width: 100%;
  text-align: center;
}

.cont {
  padding: 20px;
  font-size: 14px;
  background: #fff;
  width: 300px;
  border-radius: 5px;
  margin: 0px auto;
  margin-top: -70px;
}

.cont .item > span {
  line-height: 40px;
}

.cont .item .input {
  display: flex;
  margin-top: 20px;
}

.cont .list {
  padding-bottom: 40px;
}

.sms {
  color: #f63802;
}

.btn {
  width: 100%;
  line-height: 55px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  background: #3AC461;
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.1);
}

.login_tips {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-top: 40px;
  line-height: 40px;
}

.login_tips span {
  color: #2574ea;
}

.zc {
  margin-top: 5px;
  text-align: center;
  color: #2574ea;
}

.right {
  border-bottom: .1px solid rgba(204, 103, 10, 0);
}

.switchover {
  display: flex;
  margin-bottom: 10px;

  span {
    flex: 1;
    text-align: center;
  }
}
.noSms{
  margin-top: 15px;
}
</style>
