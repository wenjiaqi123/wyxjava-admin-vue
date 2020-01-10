import Vue from 'vue'
/**
 * 校验是否登录
 * @returns {boolean} true 表示登录
 */
const checkIsSign = function() {
  let sign = Vue.prototype.isSign;
  return sign;
}

export default {
  checkIsSign
}
