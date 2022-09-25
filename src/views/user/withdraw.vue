<!-- 余额提现 -->
<template>
  <div>
    <van-nav-bar
      title="余额提现"
      left-arrow
      fixed
      :border="false"
      @click-left="onClickLeft"
    />
    <div class="main">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-radio-group
          v-model="radio"
          checked-color="#1989fa"
          class="selectView"
        >
          <van-radio name="1">
            <!-- 支付宝 -->
            <div class="card">
              <div class="card_left" @click="zhifubaoAlertShow = true">
                <img
                  v-if="zhifubaoAccList.length != 0"
                  :src="require('../../assets/zhifubao.png')"
                  alt=""
                />
                <div v-if="zhifubaoAccList.length != 0" class="card_left_cont">
                  <p>{{ zhifubaoAccList[zhifubaoAccList.length-1].aliNo }}</p>
                </div>
              </div>
              
              <div
                @click="zhifubaoAlertShow = true"
                v-if="zhifubaoAccList.length == 0"
                class="def_card"
              >
                <img
                  :src="require('../../assets/zhifubao.png')"
                  style="width: 45px; height: 45px"
                  alt=""
                />
                <p class="card_left_cont" style="margin-top: 4px">
                  设置支付宝提现账号
                </p>
              </div>
              <div class="card_right">
                <van-icon name="arrow" />
              </div>
            </div>
            <p class="cardTip">手续费: 1元/笔</p>
          </van-radio>
          <div class="line10"></div>

          <van-radio name="0">
            <!-- 银行卡 -->
            <div class="card">
              <div class="card_left" @click="gonext('card')">
                <img
                  v-if="card.length != 0"
                  :src="
                    require('../../assets/bankIcon/BANK_' +
                      card.logimg +
                      '.png')
                  "
                  alt=""
                />
                <div v-if="card.length != 0" class="card_left_cont">
                  <p>{{ card.bankName }}</p>
                  <span
                    >{{ card.cardType }}&nbsp;&nbsp;|&nbsp;&nbsp;尾号{{
                      card.cardNo | cardNoEnd
                    }}</span
                  >
                </div>
              </div>
              <div
                @click="gonext('card')"
                v-if="card.length == 0"
                class="def_card"
              >
                <img src="../../assets/logo.png" alt="" />
                <p>未设置默认提现卡</p>
              </div>
              <div class="card_right">
                <van-icon name="arrow" />
              </div>
            </div>
            <p class="cardTip">手续费: 2元/笔</p>
          </van-radio>
                 <div class="line10"></div>

        </van-radio-group>

        <div class="content">
          <p>提现金额</p>
          <div class="money">
            <!-- <span>￥</span> -->
            <van-field
              clearable
              v-model="balance"
              label-width="30px"
              type="number"
              placeholder="请输入提现金额，最低100元"
              readonly
            >
              <span slot="label">￥</span>
            </van-field>
          </div>
          <!-- <div class="allMoney"></div> -->
        </div>
     
        <div class="submit theme-linear-bg" @click="submit()">确认提现</div>
      </van-pull-refresh>
    </div>
    <div class="withdraw_tips"></div>
    <confirmorcancel
      ref="Dialog"
      src="../../assets/withdrawbg.png"
      but="4"
      type="withdraw"
      @bottomClose="close"
    />
    <van-popup v-model="show" position="bottom" :style="{ height: '65%' }">
      <van-password-input
        :value="paypass"
        info="支付密码为 6 位数字"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </van-popup>
    <van-dialog
      v-model="defDialog"
      title=""
      show-cancel-button
      confirmButtonText="确定"
      confirmButtonColor="#FB933F"
      @confirm="gonext('card')"
    >
      <div class="pop_title">
        <img src="../../assets/logo.png" alt="" />
        <div>
          <h3>提醒</h3>
          <p>暂无默认银行卡，请前往添加</p>
        </div>
      </div>
    </van-dialog>

    <!--弹出框，赋予chargeBtn事件-->
    <van-dialog
      v-model="zhifubaoAlertShow"
      title="填写支付宝账号"
      show-cancel-button
      @confirm="zhifubaofinish()"
    >
      <!--输入框-->
      <van-field
        v-model="zhifubaoAcc"
        rows="1"
        autosize
        type="textarea"
        placeholder="只能添加实名信息为本人的支付宝账号"
      />
      
    </van-dialog>
  </div>
</template>

<script>
import confirmorcancel from "@/components/confirm/alert";
import {
  NavBar,
  PullRefresh,
  Icon,
  Field,
  PasswordInput,
  Popup,
  NumberKeyboard,
  Dialog,
  RadioGroup,
  Radio,
} from "vant";
import {
  userInfoQuery,
  getAccountQuery,
  bankDefault,
  withdraw,
  paypassAuth,
  getAliAccount,
  addAliAccount,
  getUserAccount,
} from "@/api/user";
import { bankIconQuery } from "@/api/card/card";

export default {
  data() {
    return {
      card: [],
      userId: "",
      token: "",
      isLoading: false,
      money: "",
      withdrawFee: 0,
      balance: 0,
      show: false,
      paypass: "", // 支付密码
      showKeyboard: true,
      phone: "",
      brandId: this.global.brandId,
      defDialog: false,
      start: "",
      zhifubaoAlertShow: false,
      zhifubaoAcc: "",
      radio: "1",
      zhifubaoAccList: [],
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Dialog.Component.name]: Dialog.Component,
    confirmorcancel,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  created() {
    this.userId = localStorage.getItem("userId");
    this.token = localStorage.getItem("token");
    this.phone = localStorage.getItem("phone");
    this.getCard();
    this.getAlipay();
    this.getUserInfo();
    this._getUserAccount();
  },
  methods: {
    zhifubaofinish() {
      if (this.zhifubaoAcc == "") {
        this.$toast({ message: "请填写支付宝账号", position: "bottom" });
        return;
      }
      addAliAccount(this.zhifubaoAcc).then((res) => {
        if (res.resp_code == "000000") {
          this.getAlipay();
        }
      });
    },
    onClickLeft() {
      window.history.back();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.getCard();
      }, 500);
    },
    // 页面跳转
    gonext(item) {
      this.$router.push({
        name: "myCard",
        params: {
          active: JSON.stringify(1),
          type: JSON.stringify(1),
          title: JSON.stringify("选择银行卡"),
        },
      });
    },
    // 获取默认卡
    getCard() {
      bankDefault(this.userId).then((res) => {
        if (res.resp_code == "000000") {
          bankIconQuery().then((res1) => {
            if (res1.resp_code == "000000") {
              res1.result.map((item) => {
                if (res.result.bankName == item.bank_name) {
                  res.result.logimg = item.bank_acronym;
                }
              });
            } else {
              this.$toast({ message: res1.resp_message, position: "bottom" });
            }
            this.card = res.result;
          });
        } else {
          this.defDialog = true;
          return;
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    getAlipay() {
      getAliAccount().then((res) => {
        if (res.resp_code == "000000") {
          this.zhifubaoAccList = res.result;
        } else {
        }
      });
    },
    // 获取个人信息
    getUserInfo() {
      userInfoQuery(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.withdrawFee = res.result.withdrawFee;
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    // 获取账户资产

    _getUserAccount() {
      getUserAccount(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.balance = res.result.currentBalance;
        }
      });
    },

    getBalance() {
      getAccountQuery(this.token).then((res) => {
        if (res.resp_code == "000000") {
          this.balance = Number(res.result.balance);
        } else {
          this.$toast({ message: res.resp_message, position: "bottom" });
        }
      });
    },
    all() {
      this.money = this.balance;
    },
    close() {
      this.$router.push({ name: "home" });
    },
    // 确认提现
    submit() {
      if (this.radio == 1 && this.zhifubaoAccList.length == 0) {
        this.$toast({
          message: "请填写支付宝账号",
          position: "bottom",
        });
        return;
      }
      if (this.balance < 100) {
        this.$toast({
          message: "单次提现金额不能小于100元",
          position: "bottom",
        });
        return;
      }

      this.show = true;
      this.paypass = "";
      this.showKeyboard = true;
    },
    onInput(key) {
      this.paypass = (this.paypass + key).slice(0, 6);
      if (this.paypass.length == 6) {
        paypassAuth(this.token, this.paypass).then((res) => {
          if (res.resp_code == "000000") {
            withdraw(
              this.balance,
              this.radio,
              this.radio == 0 ? "" : this.zhifubaoAccList[this.zhifubaoAccList.length-1].aliNo
            ).then((res1) => {
              if (res1.resp_code == "000000") {
                this.showKeyboard = false;
                this.show = false;
                this.start = `${this.balance}元`;
                this.$refs.Dialog.disopen();
              } else {
                this.$toast({ message: res1.resp_message, position: "bottom" });
              }
            });
          } else {
            this.$toast({ message: res.resp_message, position: "bottom" });
          }
        });
      }
    },
    onDelete() {
      this.paypass = this.paypass.slice(0, this.paypass.length - 1);
    },
  },
};
</script>
<style scoped>
.main {
  padding-top: 50px;
  text-align: left;
  font-size: 14px;
}

.card {
  background: #ffffff;
  display: flex;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.card_left {
  display: flex;
  justify-items: left;
  align-items: center;
  color: #121212;
}

.card_left img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.card_left span {
  color: #666666;
}

.def_card {
  width: 100%;
  display: flex;
  align-items: left;
}

.def_card img {
  width: 36px;
  height: 36px;
}

.def_card p {
  line-height: 36px;
  margin-left: 10px;
}
.selectView {
  padding-left: 20px;
  background: #ffffff;
  /* padding: 20px 0 0; */
  /* width: 100%; */
  /* box-sizing: border-box; */
}
.content {
  background: #ffffff;
  padding: 20px 0 0;
  width: 100%;
  box-sizing: border-box;
}

.content p {
  padding: 0 20px;
}

.money {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(130, 130, 130, 0.1);
}

.money span {
  font-size: 24px;
}

.allMoney {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit {
  width: 320px;
  height: 45px;
  color: #ffffff;
  line-height: 45px;
  font-size: 16px;
  margin: 20px auto;
  text-align: center;
  border-radius: 8px;
  box-shadow: 1px 3px 5px 0px rgba(130, 130, 130, 0.2);
}

.paypass {
  width: 100%;
}

.pop_title {
  display: flex;
  align-content: left;
  padding: 10px;
}

.pop_title img {
  width: 46px;
  height: 46px;
}

.pop_title p {
  color: #999999;
  margin-left: 10px;
}

.withdraw_tips {
  height: 98px;
  width: 80%;
  background: url("../../assets/user/withdraw_tips.png") center no-repeat;
  background-size: 100% 100%;
  margin: 40px auto;
}
.card_right {
  margin-left: 40px;
}
.card_left_cont {
  width: 200px;
}
.cardTip {
  margin-left: 20px;
    color: #999999;

}
.line10{
    margin-left: -40px;
              margin-right: -40px;
              margin-top: 10px;
              height: 10px;
              background: #f3f5f7;
}
</style>
