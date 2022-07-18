import request from '@/utils/request';

/**
 * 更新langCode cookie
 * @param {String} langCode
 */
export function updateLang(langCode) {
  return request({
    method: 'POST',
    url: '/api/updateLang',
    data: {
      langCode
    }
  });
}
