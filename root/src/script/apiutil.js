var isDebug = true;

var gEvents = {
    // 全部事件
    finalprocess : 'finalprocess',
    initdb : 'initdb',
    unzipWidget : 'unzipWidgetdone',
    cmsphone : 'cmsphone',
    sencedb : 'sencedb',
    sencedbquery : 'sencedbquery',
    deleteSenceItem : 'deleteSenceItem',
    initLedlist : 'initLedlist',
    ledlistlocalquery : 'ledlistlocalquery',
    synclocaldone : 'synclocaldone'
}

// 判断当前系统是否为ios
// true
// false
function isIOS() {
    var systemType = api.systemType;
    if (systemType == 'ios') {
        return true;
    }
    else {
        return false;
    }

}

// 封装alert
// 等到发版时直接设置isDebug = false就可以避免输出alert
function uDebugAlert(msg)
{
    if(isDebug)
    {
        alert(msg);
    }
}

// 初始化创建表
// dbname 数据库名
// tablename 表名
// cols 表结构
// ------------------------------------
// var sence_cols = 'id integer primary key autoincrement, title varchar(50), mac varchar(50)';
// var userLedlist = 'ledlist' + count;
// initDB('led', userLedlist, gEvents.initLedlist, sence_cols);
function initDB(dbname, tablename, event, cols)
{
    var db = api.require('db');
    var sql = 'create table if not exists ';
        sql += tablename;
        sql += ' (';
        sql += cols;
        sql += ')';

    db.executeSql({
        name: dbname,
        sql: sql
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('创建表成功'+tablename);
        } else{
            // api.alert({msg:'表重复啊'+tablename});
            // api.alert({msg:'创建表失败：'+err.msg});
            
        }

        api.sendEvent({
            name: event,
            extra:{key1:''}
        });
    });
}

// 初始化创建表
// dbname 数据库名
// tablename 表名
// cols 表结构
// ------------------------------------
// var sence_cols = 'id integer primary key autoincrement, title varchar(50), mac varchar(50)';
// var userLedlist = 'ledlist' + count;
// initDB('led', userLedlist, gEvents.initLedlist, sence_cols);
function initDBLite(dbname, tablename, eventType, cols, db)
{
    var sql = 'create table if not exists ';
        sql += tablename;
        sql += ' (';
        sql += cols;
        sql += ')';

    db.executeSql({
        name: dbname,
        sql: sql
    }, function(ret, err){
        if(ret.status){
            // alert('创建表成功:'+tablename);
        } else{
            // api.alert({msg:'表重复啊'});
            // api.alert({msg:'创建表失败:'+err.msg});
        }
        api.sendEvent({
            name: eventType,
            extra:{key1:''}
        });
    });
}

// 表中插入数据
// dbname 数据库名
// tablename 表名
// item json对象
// ------------------------------------
// var item = {title: _name};
// insertDBJson('led', 'sencelist', item);
function insertDBJson(dbname, tablename, item, _eventType)
{
    var db = api.require('db');
    var _eventType = _eventType || '';
    
    // var timestep = Date.parse(new Date());

    var insert;
    insert = 'insert into ';
    insert += tablename;
    insert += ' (';
    for(var key in item)
    {
        insert += key;
        insert += ', ';
    }
    insert=insert.substring(0,insert.length-2);
    insert += ') values(';
    for(var key in item)
    {
        insert += '"';
        insert += item[key];
        insert += '"';
        insert += ', ';
    }
    insert=insert.substring(0,insert.length-2);
    insert += ')';

    
    db.executeSql({
        name: dbname,
        sql: insert
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('插入成功');
            api.sendEvent({
                name: _eventType,
                extra:{key1:''}
            });
        } else{
            uDebugAlert(err.msg);
        }
    });
}

// 表中插入数据
// 不再打开数据库
// dbname 数据库名
// tablename 表名
// item json对象
function insertDBJsonLite(dbname, tablename, item, db)
{
    var insert;
    insert = 'insert into ';
    insert += tablename;
    insert += ' (';
    for(var key in item)
    {
        insert += key;
        insert += ', ';
    }
    insert=insert.substring(0,insert.length-2);
    insert += ') values(';
    for(var key in item)
    {
        insert += '"';
        insert += item[key];
        insert += '"';
        insert += ', ';
    }
    insert=insert.substring(0,insert.length-2);
    insert += ')';

    
    db.executeSql({
        name: dbname,
        sql: insert
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('插入成功');
        } else{
            uDebugAlert(err.msg);
        }
        
    });
    
}

// 更新数据库
// dbname 数据库名
// tablename 表名
// item json对象
// item对象里必须要有id字段
function updateDBJson(dbname, tablename, eventType, item)
{
    var db = api.require('db');
    // var timestep = Date.parse(new Date());

    var updateStr;
    
    updateStr = 'update ';
    updateStr += tablename;
    updateStr += ' set ';
    for(var key in item)
    {
        updateStr += key;
        updateStr += ' = "';
        updateStr += item[key];
        updateStr += '", ';
    }
    updateStr=updateStr.substring(0,updateStr.length-2);
    updateStr += ' where id = "';
    updateStr += item.id;
    updateStr += '"';
    
    
    db.executeSql({
        name: dbname,
        sql: updateStr
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('更新成功');
            var data = ret.data;
            api.sendEvent({
                name: eventType,
                extra:{key1:data}
            });
        } else{
            uDebugAlert(err.msg);
        }
    });
}

// 直接更新数据库
// 不再打开
// dbname 数据库名
// tablename 表名
// item json对象
// item对象里必须要有id字段
function updateDBJsonLite(dbname, tablename, item, eventType, db)
{
    var updateStr;
    
    updateStr = 'update ';
    updateStr += tablename;
    updateStr += ' set ';
    for(var key in item)
    {
        updateStr += key;
        updateStr += ' = "';
        updateStr += item[key];
        updateStr += '", ';
    }
    updateStr=updateStr.substring(0,updateStr.length-2);
    updateStr += ' where id = "';
    updateStr += item.id;
    updateStr += '"';
    
    db.executeSql({
        name: dbname,
        sql: updateStr
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('更新成功');
            var data = ret.data;
            api.sendEvent({
                name: eventType,
                extra:{key1:data}
            });
        } else{
            uDebugAlert(err.msg);
        }
    });
}

// 删除数据库条目
// dbname 数据库名
// tablename 表名
// item json对象
function deleteDBJson(dbname, tablename, eventType, item)
{
    var db = api.require('db');
    // var timestep = Date.parse(new Date());

    var deleteStr;
    
    deleteStr = 'DELETE FROM ';
    deleteStr += tablename;
    deleteStr += ' where id = "';
    deleteStr += item.id;
    deleteStr += '"';
    
    // uDebugAlert(deleteStr);

    
    db.executeSql({
        name: dbname,
        sql: deleteStr
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('删除成功');
            // alert('删除成功·'); 
            // var data = ret.data;
            // api.sendEvent({
            //     name: eventType,
            //     extra:{key1:data}
            // });
        } else{
            uDebugAlert(err.msg);
        }
    });
}

// 删除数据库条目
// dbname 数据库名
// tablename 表名
// item json对象
function deleteDBJsonLite(dbname, tablename, item, db)
{
    var deleteStr;
    
    deleteStr = 'DELETE FROM ';
    deleteStr += tablename;
    deleteStr += ' where id = "';
    deleteStr += item.id;
    deleteStr += '"';
    
    // uDebugAlert(deleteStr);

    
    db.executeSql({
        name: dbname,
        sql: deleteStr
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('删除成功');
            // var data = ret.data;
            // api.sendEvent({
            //     name: eventType,
            //     extra:{key1:data}
            // });
        } else{
            uDebugAlert(err.msg);
        }
    });
}

// 读取数据库中的全部数据
// dbname 数据库名
// tablename 表名
// eventType 广播类型
// eg:
// gLedlistName = 'ledlist' + gPhone;
// readDBAll('led', gLedlistName, gEvents.ledlistlocalquery);
// api.addEventListener({
//     name: gEvents.ledlistlocalquery
// }, function(ret, err){
//     if(ret){
//         gLocalLedListArray = ret.value.key1;
//         initLedList();
//     }
// });
function readDBAll(dbname, tablename, eventType)
{
    // if (eventType === gEvents.finalprocess) { setTimeout("finalprocess()", 1000);return;};
    var db = api.require('db');
    var select = 'select * from ' + tablename;
    var _readDBAllData;

    
    // uDebugAlert('数据库打开成功');
    db.selectSql({
        name:dbname,
        sql: select
    }, function(ret, err){
        if(ret.status){
            // if (eventType === gEvents.finalprocess) {uDebugAlert('最后查询数据库打开成功');};
            _readDBAllData = ret.data;
            // alert('readDBAll 查找数据'+JSON.stringify(_readDBAllData));
        }else{
            alert(JSON.stringify(err));
        };

        api.sendEvent({
            name: eventType,
            extra:{key1:_readDBAllData}
        });

    });
}

// 补救措施
function finalprocess() {
    var db = api.require('db');
    var tablename = 'applist';
    var dbname = 'feixunapp';

    var select = 'select * from ' + tablename;

    db.openDatabase({
        name: dbname
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('数据库打开成功');
            db.selectSql({
                name:dbname,
                sql: select
            }, function(ret, err){
                if(ret.status){
                    var data = ret.data;
                    api.sendEvent({
                        name: gEvents.finalprocess,
                        extra:{key1:data}
                    });
                }else{
                    uDebugAlert(JSON.stringify(err));
                };

                db.closeDatabase({
                    name:dbname
                }, function(ret, err){});
            });
        }else{
            api.alert({msg:err.msg});
        }
        
    });
}
// 读取数据库中的部分
// dbname 数据库名
// tablename 表名
// eventType 广播类型
function readDBWhere(dbname, tablename, whereObj, eventType)
{
    var db = api.require('db');

    var select = 'select * from ' + tablename + ' where ';
    for(var key in whereObj)
    {
        select += key;
        select += ' = "';
        select += whereObj[key];
        select += '", ';
    }
    select=select.substring(0,select.length-2);

    // uDebugAlert(select);

    db.openDatabase({
        name: dbname
    }, function(ret, err){
        if(ret.status){
            // uDebugAlert('数据库打开成功');
            db.selectSql({
                name:dbname,
                sql: select
            }, function(ret, err){
                if(ret.status){
                    var data = ret.data;
                    // alert(JSON.stringify(data));
                    api.sendEvent({
                        name: eventType,
                        extra:{key1:data}
                    });
                }else{
                };

                db.closeDatabase({
                    name:dbname
                }, function(ret, err){});
            });
        }else{
            api.alert({msg:err.msg});
        }
        
    });

}

// 读取数据库中的部分
// dbname 数据库名
// tablename 表名
// eventType 广播类型
function readDBWhereLite(dbname, tablename, whereObj, eventType, db)
{
    // var db = api.require('db');

    var select = 'select * from ' + tablename + ' where ';
    for(var key in whereObj)
    {
        select += key;
        select += ' = "';
        select += whereObj[key];
        select += '", ';
    }
    select=select.substring(0,select.length-2);

    db.selectSql({
        name:dbname,
        sql: select
    }, function(ret, err){
        var data = '';

        if(ret.status){
            data = ret.data;
            // alert('查找数据'+JSON.stringify(data));
            
        }else{
        }

        api.sendEvent({
            name: eventType,
            extra:{key1:data}
        });

    });
}

/**
 * TODO 
 * 交叉对比网络数据和本地数据
 * @param  {[type]} _dbname         数据库名称
 * @param  {[type]} _tablename      [description]
 * @param  {[type]} _cloudDateArray 在线数据
 * @param  {[type]} _LocalDateArray 本地数据
 * @return {[type]}                 [description]
 */
function crossSql (_dbname, _tablename,_cloudDateArray, _LocalDateArray) {
    var db = api.require('db');

    db.openDatabase({
        name: _dbname
    }, function(ret, err){
        if(ret.status){
            // 有时候可能没有查到本地有数据？
            // 每次本地没有查找到一次，就会多插入一次
            var isnew;
            for (var i = 0; i < _cloudDateArray.length; i++) {
                isnew = true;
                for (var j = 0; j < _LocalDateArray.length; j++) {
                    if ( _LocalDateArray[j].mac === _cloudDateArray[i] )
                    {
                        isnew = false;
                        _newItem = _LocalDateArray.splice(j,1);

                        // 使用本地数据
                        
                        break;
                    }
                }
                // 本地没有数据，使用网络数据
                // 并且本地插入数据
                if (isnew) {
                    // insertDBJsonLite(_dbname, gLedlistName, _device, db);
                    
                }
            }

            // _遍历完成后，删除本地数据中剩余的数据
            for (var i = 0; i < _LocalDateArray.length; i++)
            {
                // deleteDBJsonLite(_dbname, gLedlistName, _LocalDateArray[i], db);
            }

            db.closeDatabase({
                name:_dbname
            }, function(ret, err){
                if(ret.status){
                    // uDebugAlert('关闭数据库成功');
                }else{
                    api.alert({msg:'关闭数据库error'});
                }
            });
        }
    });
}

// 实际存储
function createFile(content, filename) {
    // 引入模块
    var fs = api.require('fs');
    var fd;

    // 创建文件
    fs.createFile({
        path: 'fs://'+filename+'.txt'
    },function(ret,err){
        var status = ret.status;
        if (status) {
            // api.alert({msg:'创建文件成功'});
            // 打开、写入文件
            fs.open({
                path: 'fs://'+filename+'.txt',
                flags: 'read_write'
            },function(ret,err){
                if (ret.status) {
                    // 成功打开文件，开始读取
                    fd = ret.fd;
                    fs.write({
                        fd:ret.fd,
                        data:content,
                        offset:0
                    },function(ret,err){
                        if (ret.status) {
                        }else{
                            api.alert({msg:err.msg});
                        }
                        // 写入后，不论是否成功，关闭文件
                        fs.close({
                            fd: fd
                        },function(ret,err){
                            if (ret.status) {
                                // api.alert({msg:'close操作成功'});
                            }else{
                                api.alert({msg:err.msg});
                            };
                        });
                    });
                    // fd = ret.fd;
                }else{
                    api.alert({msg:err.msg});
                }
            });
        }else {
            api.alert({msg:err.msg});
        };
    }); 
}

function queryMCM(type){
    api.showProgress({
        title: '加载中...',
        modal: true
    });

    if(type === 'all'){
        //client api
        var model = api.require('model');
        var query = api.require('query');
        model.config({
            appKey: '805C0BA1-BDDB-AC07-2E92-C2BC612E3F7C',
            host: 'https://d.apicloud.com'
        });

        //search
        query.createQuery(function(ret, err){
            if(ret && ret.qid){
                var queryId = ret.qid;
                query.limit({qid:queryId, value:100});
                model.findAll({class:"testapp", qid:queryId}, function(ret, err){
                    if(ret){
                        // var createdAt = new Date(ret[0].createdAt)
                        // alert(createdAt.getTime());
                        // //hide loading
                        // api.hideProgress();
                        api.sendEvent({
                            name: gEvents.mcmdone,
                            extra:{key1:ret}
                        });
                        
                    }else{
                        // alert(JSON.stringify(err));
                        api.sendEvent({
                            name: gEvents.mcmfail,
                            extra:{key1:ret}
                        });
                    }
                });
            }
        });
    }
}


/**
 * 计算出页面剩余高度
 * 输入数组，每个元素都是class值
 * 无法计算得出外边距大小，所以需要自己再添加
 */
function calcPageEmpty(_array) {
    var winHeight = document.body.clientHeight;
    var occupyHeight = 0;

    for (var i = 0; i < _array.length; i++) {
    
        occupyHeight += document.getElementsByClassName(_array[i])[0].offsetHeight;
        console.log(document.getElementsByClassName(_array[i])[0].offsetHeight);
    }
    
    // console.log(winHeight - occupyHeight);
    return winHeight - occupyHeight;
}

/**
 * 默认开关关闭
 * 刚开始每个对象都没有_status属性：undefined
 * 判断 undefined === 0 -> false 所以对其打开，然后对其添加_status属性
 */
function Switcher() {
    var _switcher;

    return {
        flip : function (_index) {
            // 默认关闭状态
            if (this._switcher[_index]._status === 0){
                this._switcher[_index].className = "switcher";
                this._switcher[_index]._status = 1;

                switcherOff(_index);
            } else {
                this._switcher[_index].className = "switcher on";
                this._switcher[_index]._status = 0;
                switcherOn(_index);
            }
        },
        init : function () {
            this._switcher = document.getElementsByClassName('switcher');
        },
        justOpen : function (_index) {
            this._switcher[_index].className = "switcher on";
            this._switcher[_index]._status = 0;
        },
        justClose : function(_index) {
            this._switcher[_index].className = "switcher";
            this._switcher[_index]._status = 1;
        }
    }
    
}
// 自己添加两个函数，避免用户忘记自己实现
function switcherOff(_index){}
function switcherOn(_index){}


// function getUserInfoFromDB (db, _dbname, _tablename, _eventType, _userItem, _callback) {
//     api.addEventListener({
//         name: _eventType
//     }, function(ret, err){
//         if(ret){
//             var user = ret.value.key1[0];
//             _callback(user);
//         }
//     });
    
//     readDBWhere(_dbname, _tablename, _userItem, _eventType);
// }