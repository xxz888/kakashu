export default {
  back() {
    history.back(1)
  },
  output(item, type) {
  },
  notify(title, background) {
    this.notify({
      message: title,
      background: background,
      duration: 1000,
    });
  },
  /**判断是否是手机号**/
  isPhoneNumber(tel) {
    var reg = /^1[3-9]\d{9}$/
    return !reg.test(tel);
  }
}
