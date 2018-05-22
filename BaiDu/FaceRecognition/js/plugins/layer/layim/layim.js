/*

 @Name: layui WebIM 1.0.0
 @Author：贤心
 @Date: 2014-04-25
 @Blog: http://sentsin.com
 
 */

; !function (win, undefined) {
    var chat = $.connection.chatHub;    //定义聊天Hub  
    var mychat = new Array();   //用于记录未及时阅读的信息
    var timer;

    var config = {
        msgurl: '',
        chatlogurl: '',
        aniTime: 200,
        right: -232,
        api: {  //读取数据已经通过ajax动态读取。
            friend: 'friend.json', //好友列表接口，无用
            group: 'group.json', //群组列表接口 ，无用
            chatlog: 'chatlog.json', //聊天记录接口，无用
            groups: 'groups.json', //群组成员接口，无用
            sendurl: '' //发送消息接口
        },
        user: { //当前用户信息
            name: name,
            face: headIcon
        },
        //自动回复内置文案，也可动态读取数据库配置
        autoReplay: [],
        chating: {},
        hosts: (function () {
            var dk = location.href.match(/\:\d+/);
            dk = dk ? dk[0] : '';
            return 'http://' + document.domain + dk + '/';
        })(),
        json: function (url, data, callback, error) {
            return $.ajax({
                type: 'POST',
                url: url,
                data: data,
                dataType: 'json',
                success: callback,
                error: error
            });
        },
        stopMP: function (e) {
            e ? e.stopPropagation() : e.cancelBubble = true;
        }
    }, dom = [$(window), $(document), $('html'), $('body')], xxim = {};

    //信息提醒功能：如图标闪动
    run = function (type) {
        var xxim_bottom_mymsg = $("#xximmm #xxim_mymsg").find("i");

        var chatLen = 0;
        //if (type == "one") {
        $("#xximmm .xxim_childnode[type='one']").each(function () {
            var id = $(this).attr('data-id');
            //var t;
            //debugger;
            if (mychat["one_" + id] != null) {
                if (mychat["one_" + id].length > 0) {
                    chatLen += mychat["one_" + id].length;
                    //debugger;
                    //列表上的头像闪动，消息数量
                    if ($(this).children('.badge').length > 0)
                        $(this).children('.badge').html(mychat["one_" + id].length);
                    else
                        $(this).append('<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + mychat["one_" + id].length + '</span>');

                } else {
                    $(this).children('.badge').remove();
                }
            } else {
                $(this).children('.badge').remove();
            }

        });

        //聊天窗上操作
        $("#layim_chatbox #layim_chatmore .layim_chatlist li[type='one']").each(function () {
            var id = $(this).attr('data-id');
            if (mychat["one_" + id] != null) {
                if (mychat["one_" + id].length > 0) {
                    if ($(this).children('.badge').length > 0)
                        $(this).children('.badge').html(mychat["one_" + id].length);
                    else
                        $('<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + mychat["one_" + id].length + '</span>').insertAfter($(this).find('span:first-child'));
                    $(this).append();

                } else {
                    $(this).children('.badge').remove();
                }
            } else {
                $(this).children('.badge').remove();
            }
        });
        // }
        // else if (type == "group") {
        $("#xximmm .xxim_childnode[type='group']").each(function () {
            var id = $(this).attr('data-id');
            if (mychat["group_" + id] != null) {
                if (mychat["group_" + id].length > 0) {
                    chatLen += mychat["group_" + id].length;
                    //debugger;
                    //列表上的头像闪动，消息数量
                    if ($(this).children('.badge').length > 0)
                        $(this).children('.badge').html(mychat["group_" + id].length);
                    else
                        $(this).append('<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + mychat["group_" + id].length + '</span>');

                } else {
                    $(this).children('.badge').remove();
                }
            } else {
                $(this).children('.badge').remove();
            }

        });

        //聊天窗上操作
        $("#layim_chatbox #layim_chatmore .layim_chatlist li[type='group']").each(function () {
            var id = $(this).attr('data-id');
            if (mychat["group_" + id] != null) {
                if (mychat["group_" + id].length > 0) {
                    if ($(this).children('.badge').length > 0)
                        $(this).children('.badge').html(mychat["group_" + id].length);
                    else
                        $('<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + mychat["group_" + id].length + '</span>').insertAfter($(this).find('span:first-child'));
                    $(this).append();

                } else {
                    $(this).children('.badge').remove();
                }
            } else {
                $(this).children('.badge').remove();
            }
        });
        //}

        if (chatLen > 0) {
            clearInterval(timer);
            timer = setInterval(function () {
                if (xxim_bottom_mymsg.is(":hidden")) {
                    xxim_bottom_mymsg.show();    //如果元素为隐藏,则将它显现
                } else {
                    xxim_bottom_mymsg.hide();     //如果元素为显现,则将其隐藏
                }
            }, 500);
        }
        else {
            clearInterval(timer);
            xxim_bottom_mymsg.show();
        }

    };

    //主界面tab
    xxim.tabs = function (index) {
        var node = xxim.node;
        node.tabs.eq(index).addClass('xxim_tabnow').siblings().removeClass('xxim_tabnow');
        node.list.eq(index).show().siblings('.xxim_list').hide();
        if (node.list.eq(index).find('li').length === 0) {
            xxim.getDates(index);
        }
    };

    //节点
    xxim.renode = function () {
        var node = xxim.node = {
            tabs: $('#xxim_tabs>span'),
            list: $('.xxim_list'),
            online: $('.xxim_online'),
            setonline: $('.xxim_setonline'),
            onlinetex: $('#xxim_onlinetex'),
            xximon: $('#xxim_on'),
            layimFooter: $('#xxim_bottom'),
            xximHide: $('#xxim_hide'),
            xximSearch: $('#xxim_searchkey'),
            searchMian: $('#xxim_searchmain'),
            closeSearch: $('#xxim_closesearch'),
            layimMin: $('#layim_min')
        };
    };

    //主界面缩放
    xxim.expend = function () {
        var node = xxim.node;
        if (xxim.layimNode.attr('state') !== '1') {
            xxim.layimNode.stop().animate({ right: config.right }, config.aniTime, function () {
                node.xximon.addClass('xxim_off');
                try {
                    localStorage.layimState = 1;
                } catch (e) { }
                xxim.layimNode.attr({ state: 1 });
                node.layimFooter.addClass('xxim_expend').stop().animate({ marginLeft: config.right }, config.aniTime / 2);
                node.xximHide.addClass('xxim_show');
            });
        } else {
            xxim.layimNode.stop().animate({ right: 1 }, config.aniTime, function () {
                node.xximon.removeClass('xxim_off');
                try {
                    localStorage.layimState = 2;
                } catch (e) { }
                xxim.layimNode.removeAttr('state');
                node.layimFooter.removeClass('xxim_expend');
                node.xximHide.removeClass('xxim_show');
            });
            node.layimFooter.stop().animate({ marginLeft: 0 }, config.aniTime);
        }
    };

    //初始化窗口格局
    xxim.layinit = function () {
        //debugger;
        var node = xxim.node;

        //主界面
        try {

            if (!localStorage.layimState) {
                config.aniTime = 0;
                localStorage.layimState = 1;
            }
            if (localStorage.layimState === '1') {
                xxim.layimNode.attr({ state: 1 }).css({ right: config.right });
                node.xximon.addClass('xxim_off');
                node.layimFooter.addClass('xxim_expend').css({ marginLeft: config.right });
                node.xximHide.addClass('xxim_show');
            }

            //闪动提醒
            run("one");

        } catch (e) {
            layer.msg(e.message, 5, -1);
        }
    };

    //聊天窗口
    xxim.popchat = function (param) {
        var node = xxim.node, log = {};

        log.success = function (layero) {
            //layer.setMove();

            xxim.chatbox = layero.find('#layim_chatbox');
            log.chatlist = xxim.chatbox.find('.layim_chatmore>ul');

            log.chatlist.html('<li data-id="' + param.id + '" type="' + param.type + '"  id="layim_user' + param.type + param.id + '"><span>' + param.name + '</span><em>×</em></li>')
            xxim.tabchat(param, xxim.chatbox);

            //最小化聊天窗
            xxim.chatbox.find('.layer_setmin').on('click', function () {
                var indexs = layero.attr('times');
                layero.hide();
                node.layimMin.text(xxim.nowchat.name).show();
            });

            //关闭窗口
            xxim.chatbox.find('.layim_close').on('click', function () {
                var indexs = layero.attr('times');
                layer.close(indexs);
                xxim.chatbox = null;
                config.chating = {};
                config.chatings = 0;
            });

            //关闭某个聊天
            log.chatlist.on('mouseenter', 'li', function () {
                $(this).find('em').show();
            }).on('mouseleave', 'li', function () {
                $(this).find('em').hide();
            });
            log.chatlist.on('click', 'li em', function (e) {
                var parents = $(this).parent(), dataType = parents.attr('type');
                var dataId = parents.attr('data-id'), index = parents.index();
                var chatlist = log.chatlist.find('li'), indexs;

                config.stopMP(e);

                delete config.chating[dataType + dataId];
                config.chatings--;

                parents.remove();
                $('#layim_area' + dataType + dataId).remove();
                if (dataType === 'group') {
                    $('#layim_group' + dataType + dataId).remove();
                }

                if (parents.hasClass('layim_chatnow')) {
                    if (index === config.chatings) {
                        indexs = index - 1;
                    } else {
                        indexs = index + 1;
                    }
                    xxim.tabchat(config.chating[chatlist.eq(indexs).attr('type') + chatlist.eq(indexs).attr('data-id')]);
                }

                if (log.chatlist.find('li').length === 1) {
                    log.chatlist.parent().hide();
                }
            });

            //聊天选项卡
            log.chatlist.on('click', 'li', function () {
                var othis = $(this), dataType = othis.attr('type'), dataId = othis.attr('data-id');
                xxim.tabchat(config.chating[dataType + dataId]);
            });

            //发送热键切换
            log.sendType = $('#layim_sendtype'), log.sendTypes = log.sendType.find('span');
            $('#layim_enter').on('click', function (e) {
                config.stopMP(e);
                log.sendType.show();
            });
            log.sendTypes.on('click', function () {
                log.sendTypes.find('i').text('')
                $(this).find('i').text('√');
            });

            xxim.transmit();
        };

        log.html = '<div class="layim_chatbox" id="layim_chatbox">'
            + '<h6>'
            + '<span class="layim_move"></span>'
            + '    <a href="' + param.url + '" class="layim_face" target="_blank"><img src="' + param.face + '" ></a>'
            + '    <a href="' + param.url + '" class="layim_names" target="_blank">' + param.name + '</a>'
            + '    <span class="layim_rightbtn">'
            + '        <i class="layer_setmin"></i>'
            + '        <i class="layim_close"></i>'
            + '    </span>'
            + '</h6>'
            + '<div class="layim_chatmore" id="layim_chatmore">'
            + '    <ul class="layim_chatlist"></ul>'
            + '</div>'
            + '<div class="layim_groups" id="layim_groups"></div>'
            + '<div class="layim_chat">'
            + '    <div class="layim_chatarea" id="layim_chatarea">'
            + '        <ul class="layim_chatview layim_chatthis"  id="layim_area' + param.type + param.id + '"></ul>'
            + '    </div>'
            + '    <div class="layim_tool">'
            + '        <i class="layim_addface" title="发送表情"></i>'
            + '        <a href="javascript:;"><i class="layim_addimage" title="上传图片"></i></a>'
            + '        <a href="javascript:;"><i class="layim_addfile" title="上传附件"></i></a>'
            + '        <a href="" target="_blank" class="layim_seechatlog"><i></i>聊天记录</a>'
            + '    </div>'
            + '    <textarea class="layim_write" id="layim_write"></textarea>'
            + '    <div class="layim_send">'
            + '        <div class="layim_sendbtn" id="layim_sendbtn">发送<span class="layim_enter" id="layim_enter"><em class="layim_zero"></em></span></div>'
            + '        <div class="layim_sendtype" id="layim_sendtype">'
            + '            <span><i>√</i>按Enter键发送</span>'
            + '            <span><i></i>按Ctrl+Enter键发送</span>'
            + '        </div>'
            + '    </div>'
            + '</div>'
            + '</div>';


        if (config.chatings < 1) {
            layer.open({
                type: 1,
                title: false,
                area: ['620x', '492px'],
                move: '.layim_chatbox .layim_move',
                moveType: 1,
                shade: 0,
                closeBtn: false,
                scrollbar: false,
                offset: [(($(window).height() - 493) / 2) + 'px', ''],
                content: log.html,
                success: function (layero) {
                    log.success(layero);
                }
            });
        } else {
            log.chatmore = xxim.chatbox.find('#layim_chatmore');
            log.chatarea = xxim.chatbox.find('#layim_chatarea');

            log.chatmore.show();

            log.chatmore.find('ul>li').removeClass('layim_chatnow');
            log.chatmore.find('ul').append('<li data-id="' + param.id + '" type="' + param.type + '" id="layim_user' + param.type + param.id + '" class="layim_chatnow"><span>' + param.name + '</span><em>×</em></li>');

            log.chatarea.find('.layim_chatview').removeClass('layim_chatthis');
            log.chatarea.append('<ul class="layim_chatview layim_chatthis" id="layim_area' + param.type + param.id + '"></ul>');

            xxim.tabchat(param);
        }

        //群组
        log.chatgroup = xxim.chatbox.find('#layim_groups');
        if (param.type === 'group') {
            log.chatgroup.find('ul').removeClass('layim_groupthis');
            log.chatgroup.append('<ul class="layim_groupthis" id="layim_group' + param.type + param.id + '"></ul>');
            xxim.getGroups(param);
        }
        //点击群员切换聊天窗
        log.chatgroup.on('click', 'ul>li', function () {
            xxim.popchatbox($(this));
        });
    };

    //定位到某个聊天队列
    xxim.tabchat = function (param) {
        //debugger;
        var node = xxim.node, log = {}, keys = param.type + param.id;
        xxim.nowchat = param;

        xxim.chatbox.find('#layim_user' + keys).addClass('layim_chatnow').siblings().removeClass('layim_chatnow');
        xxim.chatbox.find('#layim_area' + keys).addClass('layim_chatthis').siblings().removeClass('layim_chatthis');
        xxim.chatbox.find('#layim_group' + keys).addClass('layim_groupthis').siblings().removeClass('layim_groupthis');

        xxim.chatbox.find('.layim_face>img').attr('src', param.face);
        xxim.chatbox.find('.layim_face, .layim_names').attr('href', param.href);
        xxim.chatbox.find('.layim_names').text(param.name);

        xxim.chatbox.find('.layim_seechatlog').attr('href', config.chatlogurl + param.id);

        log.groups = xxim.chatbox.find('.layim_groups');
        if (param.type === 'group') {
            log.groups.show();
        } else {
            log.groups.hide();
        }

        $('#layim_write').focus();
        //debugger;
        //定位到某个聊天之后，检查是否存在还未读信息，如果是未读，则通知服务器标志为已读，因为已经定位到了，信息已经看到了
        if (mychat[param.type + "_" + param.id] != null && mychat[param.type + "_" + param.id].length > 0) //存在未读信息，通知服务器
        {
            //向服务器发送已经查看信息通知:延迟加载
            chat.server.sendReadLater(param.type, param.id, mychat[param.type + "_" + param.id].join(","));
        }
    };

    //弹出聊天窗
    xxim.popchatbox = function (othis) {
        //debugger;
        var node = xxim.node, dataId = othis.attr('data-id'), param = {
            id: dataId, //用户ID
            type: othis.attr('type'),
            name: othis.find('.xxim_onename').text(),  //用户名
            face: othis.find('.xxim_oneface').attr('src'),  //用户头像
            href: 'profile.html?user=' + dataId //用户主页
        }, key = param.type + dataId;
        if (!config.chating[key]) {
            xxim.popchat(param);
            config.chatings++;
        } else {
            xxim.tabchat(param);
        }
        config.chating[key] = param;

        var chatbox = $('#layim_chatbox');
        if (chatbox[0]) {
            node.layimMin.hide();
            chatbox.parents('.layui-layer-content').parents('.layui-layer').show();
            //chatbox.parents('.xubox_layer').show();
        }
    };

    //请求群员
    xxim.getGroups = function (param) {
        //debugger;
        var keys = param.type + param.id, str = '',
        groupss = xxim.chatbox.find('#layim_group' + keys);
        groupss.addClass('loading');

        $.ajax("AjaxHandle/OAHandler.ashx", {
            data: {
                groupid: param.id,
                method: "GetWebIMGroupUser"
            },
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型	
            timeout: 8000,
            success: function (datas) {

                if (datas.status === 1) {
                    var ii = 0, lens = datas.data.length;
                    if (lens > 0) {
                        for (; ii < lens; ii++) {
                            str += '<li data-id="' + datas.data[ii].id + '" type="one"><img src="' + datas.data[ii].headIcon + '" class="xxim_oneface"><span class="xxim_onename">' + datas.data[ii].name + '</span></li>';
                        }
                    } else {
                        str = '<li class="layim_errors">没有群员</li>';
                    }

                } else {
                    str = '<li class="layim_errors">' + datas.msg + '</li>';
                }

                groupss.removeClass('loading');
                groupss.html(str);
            },
            error: function (xhr, type, errorThrown) {
                groupss.removeClass('loading');
                groupss.html('<li class="layim_errors">请求异常</li>');
            }
        });


    };

    //事件
    xxim.event = function () {
        var node = xxim.node;

        //主界面tab
        node.tabs.eq(0).addClass('xxim_tabnow');
        node.tabs.on('click', function () {
            var othis = $(this), index = othis.index();
            xxim.tabs(index);
        });

        //列表展收
        node.list.on('click', 'h5', function () {
            var othis = $(this), chat = othis.siblings('.xxim_chatlist'), parentss = othis.parent();
            if (parentss.hasClass('xxim_liston')) {
                chat.hide();
                parentss.removeClass('xxim_liston');
            } else {
                chat.show();
                parentss.addClass('xxim_liston');
            }
        });

        //设置在线隐身
        node.online.on('click', function (e) {
            config.stopMP(e);
            node.setonline.show();
        });
        node.setonline.find('span').on('click', function (e) {
            var index = $(this).index();
            config.stopMP(e);
            if (index === 0) {
                node.onlinetex.html('在线');
                node.online.removeClass('xxim_offline');
            } else if (index === 1) {
                node.onlinetex.html('隐身');
                node.online.addClass('xxim_offline');
            }
            node.setonline.hide();
        });

        node.xximon.on('click', xxim.expend);
        node.xximHide.on('click', xxim.expend);

        //搜索
        node.xximSearch.keyup(function () {
            var val = $(this).val().replace(/\s/g, '');
            if (val !== '') {
                node.searchMian.show();
                node.closeSearch.show();
                //此处的搜索ajax参考xxim.getDates
                node.list.eq(3).html('<li class="xxim_errormsg">没有符合条件的结果</li>');
            } else {
                node.searchMian.hide();
                node.closeSearch.hide();
            }
        });
        node.closeSearch.on('click', function () {
            $(this).hide();
            node.searchMian.hide();
            node.xximSearch.val('').focus();
        });

        //弹出聊天窗
        config.chatings = 0;
        node.list.on('click', '.xxim_childnode', function () {
            var othis = $(this);
            xxim.popchatbox(othis);
        });

        //点击最小化栏
        node.layimMin.on('click', function () {
            $(this).hide();

            $('#layim_chatbox').parents('.layui-layer-content').parents('.layui-layer').show();
            //$('#layim_chatbox').parents('.xubox_layer').show();
        });


        //document事件
        dom[1].on('click', function () {
            node.setonline.hide();
            $('#layim_sendtype').hide();
        });
    };

    //请求列表数据    
    xxim.getDates = function (index) {

        var node = xxim.node, myf = node.list.eq(index);
        myf.addClass('loading');
        $.ajax("AjaxHandle/OAHandler.ashx", {
            data: {
                index: index,
                method: "GetWebIMData"
            },
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型	
            timeout: 8000,
            success: function (datas) {
                //debugger
                if (datas.status === 1) {
                    var i = 0, myflen = datas.data.length, str = '', item;
                    if (index === 0) {  //好友：按部门来显示用户
                        if (myflen > 1) {
                            for (; i < myflen; i++) {
                                str += '<li data-id="' + datas.data[i].id + '" class="xxim_parentnode">'
                                    + '<h5><i></i><span class="xxim_parentname">' + datas.data[i].name + '</span><em class="xxim_nums">（' + datas.data[i].nums + '）</em></h5>'
                                    + '<ul class="xxim_chatlist">';
                                item = datas.data[i].item;
                                for (var j = 0; j < item.length; j++) {
                                    str += '<li data-id="' + item[j].id + '" class="xxim_childnode" type="' + (index === 0 ? 'one' : 'group') + '"><img src="' + item[j].face + '" class="xxim_oneface"><span class="xxim_onename">' + item[j].name + '</span>';
                                    if (item[j].cout > 0) {
                                        str += '<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + item[j].cout + '</span>';

                                        //未读消息暂
                                        if (mychat["one_" + item[j].fromuser] == null && mychat["one_" + item[j].fromuser] == undefined) {
                                            mychat["one_" + item[j].fromuser] = new Array();
                                        }

                                        if (item[j].msgids != null) {
                                            for (var k = 0; k < item[j].msgids.length; k++) {
                                                mychat["one_" + item[j].fromuser].push(item[j].msgids[k].id);
                                            }
                                        }
                                    }
                                    str += '</li>';
                                }
                                str += '</ul></li>';
                            }
                            myf.html(str);
                        } else {
                            myf.html('<li class="xxim_errormsg">没有任何数据</li>');
                        }
                    } else if (index === 1) //群组：显示用户组
                    {
                        //debugger;
                        if (myflen > 0) {
                            for (; i < myflen; i++) {
                                str += '<li data-id="' + datas.data[i].id + '" class="xxim_childnode xxim_group" type="' + (index === 0 ? 'one' : 'group') + '"><img src="' + datas.data[i].face + '" class="xxim_oneface"><span class="xxim_onename">' + datas.data[i].name + '</span>';
                                if (datas.data[i].cout > 0) {
                                    str += '<span class="badge" style="color:#fff;padding-left:4px;background-color:red;margin-top:5px;">' + datas.data[i].cout + '</span>';

                                    //未读消息暂
                                    if (mychat["group_" + datas.data[i].id] == null && mychat["group_" + datas.data[i].id] == undefined) {
                                        mychat["group_" + datas.data[i].id] = new Array();
                                    }

                                    if (datas.data[i].msgids != null) {
                                        for (var k = 0; k < datas.data[i].msgids.length; k++) {
                                            mychat["group_" + datas.data[i].id].push(datas.data[i].msgids[k].id);
                                        }
                                    }
                                }
                                str += '</li>';
                            }
                            myf.html(str);
                        } else {
                            myf.html('<li class="xxim_errormsg">没有任何数据</li>');
                        }
                    } else {    //历史聊天
                        str += '<li class="xxim_liston">'
                                    + '<ul class="xxim_chatlist">';
                        for (; i < myflen; i++) {
                            str += '<li data-id="' + datas.data[i].id + '" class="xxim_childnode" style="padding:0px 10px;" type="one"><img src="' + datas.data[i].headIcon + '"  class="xxim_oneface"><span  class="xxim_onename">' + datas.data[i].Name + '</span><em class="xxim_time">' + datas.data[i].sendtime + '</em></li>';
                        }
                        str += '</ul></li>';

                        myf.html(str);
                    }

                } else {
                    myf.html('<li class="xxim_errormsg">' + datas.msg + '</li>');
                }
                myf.removeClass('loading');
            },
            error: function (xhr, type, errorThrown) {
                myf.html('<li class="xxim_errormsg">请求失败</li>');
                myf.removeClass('loading');
            }
        });

    };

    //渲染骨架
    xxim.view = (function () {
        //debugger;
        var xximNode = xxim.layimNode = $('<div id="xximmm" class="xxim_main">'
                + '<div class="xxim_top" id="xxim_top">'
                + '  <div class="xxim_search"><i></i><input id="xxim_searchkey" /><span id="xxim_closesearch">×</span></div>'
                + '  <div class="xxim_tabs" id="xxim_tabs"><span class="xxim_tabfriend" title="好友"><i></i></span><span class="xxim_tabgroup" title="群组"><i></i></span><span class="xxim_latechat"  title="最近聊天"><i></i></span></div>'
                + '  <ul class="xxim_list" style="display:block"></ul>'
                + '  <ul class="xxim_list"></ul>'
                + '  <ul class="xxim_list"></ul>'
                + '  <ul class="xxim_list xxim_searchmain" id="xxim_searchmain"></ul>'
                + '</div>'
                + '<ul class="xxim_bottom" id="xxim_bottom">'
                + '<li class="xxim_online" id="xxim_online">'
                    + '<i class="xxim_nowstate"></i><span id="xxim_onlinetex">在线</span>'
                    + '<div class="xxim_setonline">'
                        + '<span><i></i>在线</span>'
                        + '<span class="xxim_setoffline"><i></i>隐身</span>'
                    + '</div>'
                    + '<div style="clear:both;"></div>'
                + '</li>'
                + '<li class="xxim_mymsg" id="xxim_mymsg" title="消息提醒"><i></i><a href="javascript:void(0);"></a></li>'
                + '<li class="xxim_seter" id="xxim_seter" title="设置">'
                    + '<i></i>'
                    + '<div class="">'

                    + '</div>'
                + '</li>'
                + '<li class="xxim_hide" id="xxim_hide"><i></i></li>'
                + '<li id="xxim_on" class="xxim_icon xxim_on"></li>'
                + '<div class="layim_min" id="layim_min"></div>'
            + '</ul>'
        + '</div>');
        dom[3].append(xximNode);

        xxim.renode();
        xxim.getDates(0);
        xxim.event();
        xxim.layinit();
    }());

    //Hub向服务器发送消息
    $.connection.hub.start().done(function () {
        //消息传输
        xxim.transmit = function () {

            var node = xxim.node, log = {};
            node.sendbtn = $('#layim_sendbtn');
            node.imwrite = $('#layim_write');

            //发送消息
            log.send = function () {
                var data = {
                    content: node.imwrite.val(),
                    id: xxim.nowchat.id,
                    sign_key: '', //密匙
                    _: +new Date
                };

                if (data.content.replace(/\s/g, '') === '') {
                    layer.tips('说点啥呗！', '#layim_write', 2);
                    node.imwrite.focus();
                } else {
                    //debugger;
                    var fromuser, touser, content, sendtime, type;
                    fromuser = userid; //当前登录用户的ID
                    type = xxim.nowchat.type
                    touser = xxim.nowchat.id;   //对方用户的ID
                    if (type === "group") {
                        touser = "";
                        $("#layim_groupgroup" + xxim.nowchat.id + " li").each(function () {
                            touser += "," + $(this).attr('data-id');
                        });
                    }

                    content = node.imwrite.val();   //消息内容
                    sendtime = DateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");//发送时间

                    var keys = xxim.nowchat.type + xxim.nowchat.id;
                    //向服务器发送
                    chat.server.sendMessage(xxim.nowchat.id, fromuser, touser, content, sendtime, type);
                    //chat.server.addToGroups("Interaction");

                    //聊天信息显示模版
                    log.html = function (param, type) {
                        return '<li class="' + (type === 'me' ? 'layim_chateme' : '') + '">'
                            + '<div class="layim_chatuser">'
                                + function () {
                                    if (type === 'me') {
                                        return '<span class="layim_chattime">' + param.time + '</span>'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<img src="' + param.face + '" >';
                                    } else {
                                        return '<img src="' + param.face + '" >'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<span class="layim_chattime">' + param.time + '</span>';
                                    }
                                }()
                            + '</div>'
                            + '<div class="layim_chatsay">' + param.content + '<em class="layim_zero"></em></div>'
                        + '</li>';
                    };

                    log.imarea = xxim.chatbox.find('#layim_area' + keys);

                    //添加我的信息
                    log.imarea.append(log.html({
                        time: DateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),
                        name: config.user.name,
                        face: config.user.face,
                        content: node.imwrite.val()
                    }, 'me'));
                    node.imwrite.val('').focus();
                    log.imarea.scrollTop(log.imarea[0].scrollHeight);

                }
            };

            node.sendbtn.on('click', log.send);

            node.imwrite.keyup(function (e) {
                if (e.keyCode === 13) {
                    log.send();
                }
            });

        };

    });

    //接收消息
    chat.client.ReceiveMessage = function (nowchat_id, fromuser, touser, content, sendtime, type, id_json) {
        //debugger;
        var back_json = eval('(' + id_json + ')');
        if (back_json.touser.length > 0) {   //一对一私聊
            for (var i = 0; i < back_json.touser.length; i++) {
                if (back_json.touser[i].userid == userid) { //如果是给当前用户发信息，则接收处理
                    var node = xxim.node, log = {};

                    var keys = type + nowchat_id;    //接收的时候，Key即为类型+发者人ID
                    //聊天信息显示模版
                    log.html = function (param, type) {
                        return '<li class="' + (type === 'me' ? 'layim_chateme' : '') + '">'
                            + '<div class="layim_chatuser">'
                                + function () {
                                    if (type === 'me') {
                                        return '<span class="layim_chattime">' + param.time + '</span>'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<img src="' + param.face + '" >';
                                    } else {
                                        return '<img src="' + param.face + '" >'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<span class="layim_chattime">' + param.time + '</span>';
                                    }
                                }()
                            + '</div>'
                            + '<div class="layim_chatsay">' + param.content + '<em class="layim_zero"></em></div>'
                        + '</li>';
                    };
                    //debugger;
                    if (xxim.chatbox != undefined && xxim.chatbox.find('#layim_area' + keys) != undefined && xxim.chatbox.find('#layim_area' + keys) != null) {

                        if (type === "one") {   //一对一私聊时处理
                            keys = type + fromuser;    //接收的时候，Key即为类型+发者人ID

                            //当前处理激活的聊天
                            var act_chat_id = xxim.chatbox.find('.layim_chatlist .layim_chatnow').attr('data-id'); //当前激活的聊天ID

                            if (act_chat_id == fromuser)    //与发送者的ID一样，说明当前正在与其进行聊天
                            {
                                log.imarea = xxim.chatbox.find('#layim_area' + keys);

                                //显示对方回复/发送的信息
                                log.imarea.append(log.html({
                                    time: sendtime,
                                    name: xxim.nowchat.name,
                                    face: xxim.nowchat.face,
                                    content: content
                                }));

                                if (log.imarea.length > 0) {
                                    log.imarea.scrollTop(log.imarea[0].scrollHeight);
                                }

                                //向服务器发送已经查看信息通知
                                chat.server.sendRead(type, fromuser, back_json.touser[i].id);
                            } else {  //否则，将用数组记录，以便真正查看信息时，再通知服务标记为已读
                                if (mychat[type + "_" + fromuser] == null && mychat[type + "_" + fromuser] == undefined) {
                                    mychat[type + "_" + fromuser] = new Array();
                                }
                                mychat[type + "_" + fromuser].push(back_json.touser[i].id);
                            }
                        } else {    //群聊
                            //debugger;
                            if (userid != fromuser)    //自己发送的消息，不用接收显示。已在发送时显示
                            {
                                log.imarea = xxim.chatbox.find('#layim_area' + keys);

                                //显示对方回复/发送的信息
                                log.imarea.append(log.html({
                                    time: sendtime,
                                    name: back_json.name,
                                    face: back_json.headIcon,
                                    content: content
                                }));

                                if (log.imarea.length > 0) {
                                    log.imarea.scrollTop(log.imarea[0].scrollHeight);
                                }

                                //向服务器发送已经查看信息通知
                                chat.server.sendRead(type, fromuser, back_json.touser[i].id);
                            } else {  //否则，将用数组记录，以便真正查看信息时，再通知服务标记为已读
                                if (mychat[type + "_" + nowchat_id] == null && mychat[type + "_" + nowchat_id] == undefined) {
                                    mychat[type + "_" + nowchat_id] = new Array();
                                }
                                mychat[type + "_" + nowchat_id].push(back_json.touser[i].id);
                            }
                        }

                        //闪动提醒
                        run(type);
                    } else {  //找不到，说明未打开与发送方的聊天框，应该做相应处理，比如图标闪之类的
                        //alert("未打开聊天框");
                        if (mychat[type + "_" + fromuser] == null && mychat[type + "_" + fromuser] == undefined) {
                            mychat[type + "_" + fromuser] = new Array();
                        }
                        mychat[type + "_" + fromuser].push(back_json.touser[i].id);
                        //闪动提醒
                        run(type);
                    }
                }
            }
        }
    };

    //标识阅读之后，返回消息
    chat.client.Readed = function (type, fromuser, ids) {
        //debugger;
        if (fromuser != "" && fromuser != undefined && fromuser != null) {
            var arr_id = ids.split(',');

            if (mychat[type + "_" + fromuser] != null && mychat[type + "_" + fromuser] != undefined) {
                for (var i = 0; i < arr_id.length; i++) {
                    for (var j = 0; j < mychat[type + "_" + fromuser].length; j++) {
                        if (arr_id[i] == mychat[type + "_" + fromuser][j]) {
                            mychat[type + "_" + fromuser].splice(j, 1);
                        }
                    }
                }
            }

            //闪动提醒
            run(type);
        }
    }

    //延迟接收消息
    chat.client.ReadLater = function (type, fromuser, ids, data) {
        //debugger;
        var node = xxim.node, log = {};
        var keys = type + fromuser;    //接收的时候，Key即为类型+发者人ID

        var jsonData = eval("(" + data + ")");

        for (var k = 0; k < jsonData.length; k++) {
            if (userid == jsonData[k].touser) {
                if (fromuser != "" && fromuser != undefined && fromuser != null) {
                    var arr_id = ids.split(',');
                    if (mychat[type + "_" + fromuser] != null && mychat[type + "_" + fromuser] != undefined) {
                        for (var i = 0; i < arr_id.length; i++) {
                            for (var j = 0; j < mychat[type + "_" + fromuser].length; j++) {
                                if (arr_id[i] == mychat[type + "_" + fromuser][j]) {
                                    mychat[type + "_" + fromuser].splice(j, 1);
                                }
                            }
                        }
                    }
                    //邦定聊天记录
                    //聊天信息显示模版

                    log.html = function (param, type) {
                        return '<li class="' + (type === 'me' ? 'layim_chateme' : '') + '">'
                            + '<div class="layim_chatuser">'
                                + function () {
                                    if (type === 'me') {
                                        return '<span class="layim_chattime">' + param.time + '</span>'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<img src="' + param.face + '" >';
                                    } else {
                                        return '<img src="' + param.face + '" >'
                                               + '<span class="layim_chatname">' + param.name + '</span>'
                                               + '<span class="layim_chattime">' + param.time + '</span>';
                                    }
                                }()
                            + '</div>'
                            + '<div class="layim_chatsay">' + param.content + '<em class="layim_zero"></em></div>'
                        + '</li>';
                    };
                    //debugger;
                    if (xxim.chatbox != undefined && xxim.chatbox.find('#layim_area' + keys) != undefined && xxim.chatbox.find('#layim_area' + keys) != null) {
                        log.imarea = xxim.chatbox.find('#layim_area' + keys);

                        //显示对方回复/发送的信息
                        if (type == "group") {
                            log.imarea.append(log.html({
                                time: jsonData[k].sendtime,
                                name: jsonData[k].Name,
                                face: jsonData[k].headIcon,
                                content: jsonData[k].content
                            }));
                        } else {
                            log.imarea.append(log.html({
                                time: jsonData[k].sendtime,
                                name: xxim.nowchat.name,
                                face: xxim.nowchat.face,
                                content: jsonData[k].content
                            }));
                        }

                        if (log.imarea.length > 0) {
                            log.imarea.scrollTop(log.imarea[0].scrollHeight);
                        }

                    }
                    //闪动提醒
                    run(type);
                }
            }
        }
    }

    //下线通知:名字颜色变灰
    chat.client.OffLine = function (uid) {
        $("#xximmm .xxim_childnode[type='one']").each(function () {
            if ($(this).attr('data-id') == uid) {
                $(this).find(".xxim_onename").css("color", "#676a6c");
            }
        });
    };

    //上线通知:名字颜色变黑色
    chat.client.OnLine = function (uid) {
        //alert(uid + "上线");
        //debugger;
        $("#xximmm .xxim_childnode[type='one']").each(function () {
            if ($(this).attr('data-id') == uid) {
                $(this).find(".xxim_onename").css("color", "#000000");
            }
        });
    };

    DateFormat = function (date, fmt) { //author: meizz 
        var o = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                    //日 
            "h+": date.getHours(),                   //小时 
            "m+": date.getMinutes(),                 //分 
            "s+": date.getSeconds(),                 //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

}(window);



