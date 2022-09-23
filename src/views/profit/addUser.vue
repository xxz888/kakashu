<template>
  <div class="login">
      <van-nav-bar class="agent_nav theme_bg" style="background: none;" :border='false' title="增加用户" left-arrow @click-left="onClickLeft"> </van-nav-bar>
     <div class="warpper_top"></div>
    <div class="top">
      <img class="login_logo" src="@/assets/logo.png" alt="">
      <p>心有多大 舞台就有多大</p>
    </div>
    <div class="cont">
      <ul class="list">
        <li class="item">
        

          <div class="input">
            <div class="bgInputDiv">
              <van-field v-model="phone" type="number" clearable placeholder="请输入手机号" maxlength="11"/>
            </div>
          </div>
        </li>

        <li class="item " v-show="active">
          <div class="input ">
            <div class="bgInputDiv">
              <van-field v-model="smsCode" clearable type="number" placeholder="请输入短信验证码" maxlength="6">
                <template #button>
                  <div class="sms" @click="message == '发送验证码' ? getCode() : ''">
                    {{ message }}
                  </div>
                </template>
              </van-field>
            </div>
          </div>
        </li>

        <!-- 密码登录 -->
        <div v-show="!active">
          <li class="item ">
            <div class="input">
              <div class="bgInputDiv">
                <van-field v-model="password" clearable type="password" placeholder="请输入密码">
                </van-field>
              </div>
            </div>
          </li>
          <p class="forget"><span @click="forget">忘记密码?</span></p>
        </div>
        <!-- 密码登录 -->
      </ul>
      <div class="btn" @click="registerParent">添加用户</div>

    </div>
  </div>
</template>

<script>
import {Field,NavBar} from "vant";
import Cookies from "js-cookie";
import {smsSend, smsLogin, userLogin, register,authPhone,registerParent} from "@/api/login";
import md5 from 'js-md5';

export default {
  data() {
    return {
      active: true,
      brandId: this.global.brandId,
      password: '',
      phone: "",
      smsCode: "",
      num: 60,
      message: "发送验证码",
      preUserPhone: '',
      regPwd: ''
    };
  },
  components: {
    [Field.name]: Field,
    [NavBar.name]: NavBar,

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
     onClickLeft() {
      this.publicJs.back();
    },
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

      authPhone(this.phone).then(res => {
        
        if (res.resp_message.indexOf('未注册') > -1) {
              smsSend(this.brandId, this.phone).then((res) => {
            if (res.resp_code == "000000") {
              this.time();
              this.$toast({message: res.resp_message, position: "bottom"});
            }
          })
        } else if (res.resp_message.indexOf('已注册') > -1) {
               this.$toast({message: res.resp_message, position: "bottom"});
        }
      })
    },
    //注册
    registerParent() {
      if (this.smsCode == "") {
        this.$toast({message: "请先获取输入验证码", position: "bottom"});
        return;
      }
     registerParent(this.phone, this.smsCode).then(res => {
        if (res.resp_code == "000000") {
          this.$router.push({  
            name: "faceRecognitionDetail",//实名认证
            query: { empowerToken: res.result,isBackAgentView:'1'},
          });
          this.$toast({message: "注册成功", position: "bottom"});
        }
      }, err => {
        this.$toast({message: "注册失败", position: "bottom"});
      })

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
<style scoped >
.agent_nav >>> .van-nav-bar__title.van-ellipsis {
  color: #fff;
}

.agent_nav >>> .van-icon {
  color: #FFFFFF !important;
}

.forget {
  margin-top: 12px;
  color: #4cc566;
  font-size: 12px;
  text-align: right;
}

.active {
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
  background:#4cc566;
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
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  background: #4cc566;
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
.bgInputDiv{
  width: 100%;
border: 1px solid #ECECEC;
opacity: 1;
border-radius: 4px;
background: #F7F7F7;
}
.switchover {
  display: flex;
  margin-bottom: 10px;

  span {
    flex: 1;
    text-align: center;
  }
}
/deep/ .van-cell{
  background: transparent;
}
</style>
