// --------------------------
// 多用户类
// 依赖apiutil.js
// --------------------------
function MutiUser () {

    // 类成员变量
    var cQQ            = '';
    var cWeiXin        = '';
    var cSinaWeiBo     = '';
    var cUserId        = '';
    var cUserNick      = '';
    var cUserWorkbench = '';
    var cUserSection   = '';
    var cUserDatelist  = '';

    return {
        /**
         * qq第三方登陆
         */
        qqLogin : function  (_callback) {
            var self = this;
            if ( cQQ === '') {
                cQQ = api.require('qq');
            }

            cQQ.login(function(ret,err){
                if ( ret.status) {
                    _callback(ret);
                    // var _userid = ret.openId.slice(0,10);
                    
                    // cQQ.getUserInfo(function(ret,err) {
                    //    if (ret.status) {
                    //         self.setUserId(_userid);
                    //         self.setUserNick(ret.info.nickname);
                    //         _callback(ret);
                    //    }else{
                    //         api.alert({msg:err.msg});
                    //    }
                    // });

                    
                }
            });
        },
        /**
         * 微博第三方登陆
         */
        weiboLogin : function  (_callback) {
            var self = this;

            if ( cSinaWeiBo === '') {
                cSinaWeiBo = api.require('sinaWeiBo');
            }
            cSinaWeiBo.cancelAuth(function(ret,err){
                if(ret.status){
                    api.alert({msg:'登出成功'});
                }else{
                    api.alert({msg:err.msg});
                }
            });
            
            cSinaWeiBo.auth(function(ret,err){
                if (ret.status) {
                    // alert('weibo auth:'+JSON.stringify(ret));
                    // alert('userid:'+ret.userID);
                    _callback(ret.userID);
                    
                    // self.setUserId(ret.userID);

                    // cSinaWeiBo.getUserInfo(function(ret,err){
                    //     alert('weibo getUserInfo:'+JSON.stringify(ret));
                    //     if (ret.status) {
                    //         self.setUserNick(ret.userInfo.name);
                            
                    //     }else{
                    //         api.alert({msg:err.msg});
                    //     }
                    // });
                }else{
                    api.alert({msg:'授权失败'+err.msg});
                }
            });
        },
        /**
         * 微信第三方登陆
         */
        weixinLogin : function  (_callback) {
            var self = this;

            if ( cWeiXin === '') {
                cWeiXin = api.require('weiXin');
            }
            cWeiXin.registerApp(
                function(ret,err){
                    if (ret.status) {
                        // alert('注册应用: ' + JSON.stringify(ret));

                        cWeiXin.auth(function(ret,err){ 
                            if(ret.status){
                                // alert('获取授权: ' + JSON.stringify(ret));
                               
                                cWeiXin.getUserInfo(function(ret,err){ 
                                    if(ret.status){
                                        // alert('获取用户信息: ' +JSON.stringify(ret));
                                        
                                        self.setUserId(ret.openid.slice(0,10));
                                        self.setUserNick(ret.nickname);

                                        _callback();
                                    }else{
                                        api.alert({msg: err.msg});
                                    }
                                });
                            }else{
                                api.alert({msg: err.msg});
                            }
                        });
                    } else{
                        api.alert({msg:err.msg});
                    }
                }
            );
        },
        /**
         * QQ分享
         * @return {[type]} [description]
         */
        qqShare : function () {
            var obj = api.require('qq');
            obj.shareNews({
                url:'http://www.xt-power.com',
                title:'智能家电',
                description:'来自APICloud',
                imgUrl:'http://www.xt-power.com/images/logo.gif'
            });
        },
        /**
         * 微博分享
         * @return {[type]} [description]
         */
        weiboShare : function () {
            // 如果这个用户有新浪key，就直接分享
            // 如果没有，就用新浪微博登陆，再分享
            var weiboShare = api.require('sinaWeiBo');
            weiboShare.sendRequest({
                contentType: 'text',
                text: '来自APICloud'
            },function(ret,err){
                if (ret.status) {
                    // api.alert({
                    //     title: '发表微博',
                    //     msg: '发表成功',
                    //     buttons: ['确定']
                    // });
                }else{
                    api.toast({msg:'请先登录'});
                };
            });
        },
        /**
         * 设置全局用户ID
         */
        setUserId : function  (_userid) {
            api.setPrefs({
                key: 'gUserId',
                value: _userid
            });
        },
        /**
         * 设置全局用户昵称
         */
        setUserNick : function (_nickname) {
            api.setPrefs({
                key: 'gUserNick',
                value: _nickname
            });
        },
        getUserId : function  (_callback) {
            if ( cUserId === '' ) {
                api.getPrefs({
                    key: 'gUserId'
                }, function(ret, err){
                    var v = ret.value;
                    _callback(v);
                    return v;
                });
            } else {
                _callback(cUserId);
                // return cUserId;
            }
        },
        getUserNick : function  (_callback) {
            if ( cUserNick === '' ) {
                api.getPrefs({
                    key: 'gUserNick'
                }, function(ret, err){
                    var v = ret.value;
                    _callback(v);
                    // alert('获得用户nickname: '+v);
                    return v;
                });
            } else {
                // return cUserNick;
                _callback(cUserNick);
            }
        },
        getUserWorkbenchTableName : function (_callback) {
            if ( cUserWorkbench === '' ) {
                this.getUserId(function  (_userid) {
                    cUserWorkbench = 'workbenchlist' + _userid;
                    _callback(cUserWorkbench);
                });
            } else {
                _callback(cUserWorkbench);
            }
        },
        getUserSectionTableName : function (_callback) {
            if ( cUserSection === '' ) {
                this.getUserId(function  (_userid) {
                    cUserSection = 'sectionlist' + _userid;
                    _callback(cUserSection);
                });
            } else {
                // return cUserSection;
                _callback(cUserSection);
            }
        },
        getUserDatelistTableName : function (_callback) {
            if (  cUserDatelist === '' ) {
                this.getUserId(function  (_userid) {
                    cUserDatelist = 'datelist' + _userid;
                    _callback(cUserDatelist);
                });
            } else {
                // return cUserDatelist;
                _callback(cUserDatelist);
            }
        }        
    } // end return

}