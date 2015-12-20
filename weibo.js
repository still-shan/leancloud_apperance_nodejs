var weibo = require('weibo');

// change appkey to yours
var appkey = '260656014';
var secret = 'f9bd5f25740487159be1c52c883d7775';
var oauth_callback_url = 'http://127.0.0.1/callback';
weibo.init('weibo', appkey, secret, oauth_callback_url);
// 传说access_token的有效期应该是1天？
var user = { blogtype: 'weibo',
  oauth_callback: 'http://127.0.0.1/callback',
  code: '7ea6af8646b5d9825cd483cedabdfb92',
  access_token: '2.00hYRkpC0QXgdR2f173eecd8hNhIBB' 
}

/*
 * 发图片微博并且通过评论@指定的用户
 * @param {object} weiboData, 要提交的微博数据
 *  - {string} atuser, 需要被@的用户
 *  - {string} text, 微博的文字内容
 *  - {Buffer} image, 图片的字节
 * @param {function(error, result)} callback, 回调函数
 */
function postAndComment(weiboData, callback){
  weibo.upload(user, {status: weiboData.text, visible: 0}, {data: weiboData.image}, function(err, ret){
    if(!err){
      var mid = ret.mid;
      var _comment = '@' + weiboData.atuser;
      weibo.comment_create(user, mid, {comment: _comment,comment_ori: 1}, function(err, ret){
        if(!err){
          callback(null, ret);
        }else
          callback(err, null);
      });
    }else
      callback(err, null);
  });
}

module.exports = postAndComment;

/*
> user
{ blogtype: 'weibo',
  oauth_callback: 'http://127.0.0.1/callback',
  code: '0de1a87c00a19b34613442aa920ac648',
  access_token: '2.00hYRkpC9S3DVE203bceb0140FaZub' 
}
*/

/*
//1.get the authorization url
user['oauth_callback'] = oauth_callback_url;
weibo.get_authorization_url(user, function(err,authorization_url){console.log(authorization_url)})

//2.request or open the authorization_url link in window
code = "request.query['code']"
user['code'] = code

//3.request the access_token
weibo.get_access_token(user, function(err,token){console.log(token.access_token, token.expires_in, token.uid);})
user['access_token'] = token.access_token

//4.requset the api after the user object had the value of 'access_token'
var cursor = {count: 20};
weibo.public_timeline(user, cursor, function (err, statuses) {
  if (err) {
    console.error(err);
  } else {
    console.log(statuses);
  }
});
*/
