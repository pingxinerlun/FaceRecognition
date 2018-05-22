
var lat = "0";
var lng = "0";


$(function () {
    $(".i-Checks").iCheck(
    {
        checkboxClass: "icheckbox_square-green",
        radioClass: "iradio_square-green",
        increaseArea: '20%'
    });

    var position_option = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 20000
    };
    navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError, position_option);

    //初始化
    initUploadify('uploadifive_post', 'textarea_post', CurrUser);
    initFacearea('facebtn_1', 72);//初始化“发表动态”区域的表情按钮
    initPostList(post_load_type);//初始化动态列表

    //可见范围
    $('#btn_access_select').click(function (event) {
        var e = $(this);
        var div_access_select = $('#div_access_select');
        if (div_access_select.css('display') == 'none')
            div_access_select.css({
                'top': e.offset().top + e.height() - 30,
                'left': e.offset().left + e.width() - div_access_select.width() - 50
            });
        div_access_select.slideToggle();
        event.stopPropagation();
    });

    //可见范围选择项
    $('#div_access_select input[name="rd_access"]').iCheck({
        checkboxClass: 'icheckbox_square-green',
        increaseArea: '0'
    }).on('ifChecked', function () {
        var e = $(this);
        var e_id = e.attr('id');
        if (e_id == 'cb_access_all2' || e_id == 'cb_access_self2') {
            $('#div_access_select .access-item input[name="rd_access"]').not(e).iCheck('uncheck');
        }
        else {
            $('#cb_access_all2,#cb_access_self2').iCheck('uncheck');
        }

        var checkeds = $('#div_access_select .access-item input[name="rd_access"]:checked');
        if (checkeds.length == 1) {
            $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;' + e.closest('.access-item').find('.access-name').html() + ' <span class="caret"></span>')
        }
        else if (checkeds.length > 1)
            $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;已选择' + checkeds.length + '项 <span class="caret"></span>');

    }).on('ifUnchecked', function () {
        var checkeds = $('#div_access_select .access-item input[name="rb_access"]:checked');
        if (checkeds.length == 0) {
            $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;可见范围 <span class="caret"></span>')
        }
    });

    //新动态提醒
    $('#new_post_alert').click(function () {
        $('#new_post_alert').hide();
        new_post_cnt = 0;
        post_load_type = 'all';
        $('#post_search_time_clear').trigger('click');
    });

    //发表动态的textarea自动高度
    $("#textarea_post").autoTextarea({ maxHeight: 160 });

    //发表动态的textarea 拖拽文件时显示附件框
    $("#textarea_post").bind('drop', function () {
        $("#post_area_1 .post-toolbars").slideDown();
        $('#post_area_1 .attach-area').slideDown();
    });

    //填写动态时显示相关按钮
    $("#textarea_post").click(function () {
        $("#post_area_1 .post-toolbars").slideDown();
    });

    $(document).click(function (e) {
        var elem = $(e.target);
        if (elem.closest('#div_access_select').length == 0)
            $('#div_access_select').slideUp();

        if (str_trim($("#textarea_post").val()) == "" && elem.closest('#post_area_1').length == 0)
            $("#post_area_1 .post-toolbars").slideUp();
    });

    //链接区域开关
    $('.post-toolbars .btn-link2').click(function () {
        $('.post-toolbars').parent().find('.attach-area').slideUp();
        $('.post-toolbars').parent().find('.link-area').slideToggle();
    });

    //标签框开关
    $(document).on('click', ".post-list .post-toolbar .btn-tag", function () {
        var e = $(this);
        e.closest('.post-toolbar').parent().find(".post-tag-edit").slideToggle();
        //event.stopPropagation();
    });

    //评论框开关
    $(document).on('click', ".post-list .post-toolbar .btn-comment", function () {
        var e = $(this);
        e.closest('.post-toolbar').next(".post-comment").slideToggle();
        //event.stopPropagation();
    });

    //评论发表按钮事件
    $(document).on('click', ".post-comment-add .comment-add-bars button", function () {
        var e = $(this);
        var content = '', post_id = '', reply_id = '0';
        var ctrl = e.closest('.post-comment-add').find('.form-control').first();
        content = ctrl.val();
        content = str_trim(content);
        if (content == "") {
            ctrl.closest('.form-group').addClass('.has-error');
            return;
        }
        ctrl.closest('.form-group').removeClass('.has-error');
        post_id = e.closest('.post-list').attr('post-id');
        var comment_item = e.closest('.comment-list-item');
        if (comment_item.length > 0) {
            reply_id = comment_item.attr('comment-id');
        }

        var attach_ids = getAttachIds(e.closest('.post-comment-add').find('.attach-area .file-item'))

        create_comment(post_id, ctrl.val(), reply_id, attach_ids);

        ctrl.val("");
        var attach_area = e.closest('.post-comment-add').find('.attach-area');
        attach_area.slideUp();
        attach_area.find('.file-item').remove();

        //评论数量+1
        var btn_comment = e.closest('.post-center').find('.post-toolbar .btn-comment');
        var obj_cnt = btn_comment.find('span.count');
        if (obj_cnt.length > 0) {
            obj_cnt.html(parseInt(obj_cnt.html()) + 1);
        }
        else {
            var html = '&nbsp;<span>';
            html = html + '<span class="count">1</span></span>';
            btn_comment.append(html);
        }

    });

    //标签点击事件
    $(document).on('click', '.post-tag span', function () {
        var e = $(this);
        tag_id = e.attr('tag-id');
        tag_name = e.html();
        $("#span-post-list").html("#" + tag_name + "#");
        initPostList('tag', true);
    });

    //点赞按钮事件
    $(document).on('click', '.post-toolbar .btn-like', function (event) {
        var e = $(this);
        var post_id = e.closest('.post-list').attr('post-id');
        if (!e.hasClass('active')) {
            $.ajax({
                url: 'AjaxHandle/OAHandler.ashx?method=post_like_add&id=' + post_id,
                success: function (re) {
                    if (re == '1') {
                        e.addClass('active');
                        e.attr('data-original-title', '取消赞');
                        Animation1(event, "+1", e.closest('.post-toolbar'));

                        var obj_cnt = e.find('span.count');
                        if (obj_cnt.length > 0) {
                            obj_cnt.html(parseInt(obj_cnt.html()) + 1);
                            var firt_span = e.find('span[data-toggle="tooltip"]');
                            var title_new = firt_span.attr('data-original-title').replace(" 赞过", "") + "、'+CurrName+' 赞过";
                            firt_span.attr('data-original-title', title_new);
                        }
                        else {
                            var html = '&nbsp;<span data-toggle="tooltip" data-placement="right" title="' + CurrName + ' 赞过">';
                            html = html + '<span class="count">1</span></span>';
                            e.append(html);
                            e.find('[data-toggle="tooltip"]').tooltip();
                        }

                    }
                }
            });
        }
        else {//取消赞
            $.ajax({
                url: 'AjaxHandle/OAHandler.ashx?method=post_like_del&id=' + post_id,
                success: function (re) {
                    if (re == '1') {
                        e.removeClass('active');
                        e.attr('data-original-title', '赞');
                        Animation1(event, "-1", e.closest('.post-toolbar'));

                        var obj_cnt = e.find('span.count');
                        var t = parseInt(obj_cnt.html()) - 1;
                        if (t == 0) obj_cnt.parent().html('');
                        else obj_cnt.html(t);
                        var firt_span = e.find('span[data-toggle="tooltip"]');
                        var reg = new RegExp('(、)?' + CurrName + '(、)?');
                        var title_new = firt_span.attr('data-original-title').replace('、' + CurrName + '、', '、').replace(reg, "");
                        if ($.trim(title_new) == "赞过") title_new = '';
                        firt_span.attr('data-original-title', title_new);

                    }
                }
            });
        }
    });

    //收藏按钮事件
    $(document).on('click', '.post-toolbar .btn-favor', function (event) {
        var e = $(this);
        var post_id = e.closest('.post-list').attr('post-id');
        if (!e.hasClass('active')) {
            $.ajax({
                url: 'AjaxHandle/OAHandler.ashx?method=post_favor_add&id=' + post_id,
                success: function (re) {
                    if (re == '1') {
                        e.addClass('active');
                        e.attr('data-original-title', '取消收藏');
                        Animation1(event, "+1", e.closest('.post-toolbar'));

                        var obj_cnt = e.find('span.count');
                        if (obj_cnt.length > 0) {
                            obj_cnt.html(parseInt(obj_cnt.html()) + 1);
                            var firt_span = e.find('span[data-toggle="tooltip"]');
                            var title_new = firt_span.attr('data-original-title').replace(" 收藏过", "") + "、" + CurrName + " 收藏过";
                            firt_span.attr('data-original-title', title_new);
                        }
                        else {
                            var html = '&nbsp;<span data-toggle="tooltip" data-placement="right" title="' + CurrName + ' 收藏过">';
                            html = html + '<span class="count">1</span></span>';
                            e.append(html);
                            e.find('[data-toggle="tooltip"]').tooltip();
                        }

                    }
                }
            });
        }
        else {//取消收藏
            $.ajax({
                url: 'AjaxHandle/OAHandler.ashx?method=post_favor_del&id=' + post_id,
                success: function (re) {
                    if (re == '1') {
                        e.removeClass('active');
                        e.attr('data-original-title', '收藏');
                        Animation1(event, "-1", e.closest('.post-toolbar'));

                        var obj_cnt = e.find('span.count');
                        var t = parseInt(obj_cnt.html()) - 1;
                        if (t == 0) obj_cnt.parent().html('');
                        else obj_cnt.html(t);
                        var firt_span = e.find('span[data-toggle="tooltip"]');
                        var reg = new RegExp('(、)?' + CurrName + '(、)?');
                        var title_new = firt_span.attr('data-original-title').replace('、' + CurrName + '、', '、').replace(reg, "");
                        if ($.trim(title_new) == "收藏过") title_new = '';
                        firt_span.attr('data-original-title', title_new);

                    }
                }
            });
        }
    });

    //评论删除按钮事件
    $(document).on('click', '.comment-list-item .comment-del', function () {
        deleteItem('post_comment', $(this).closest('.comment-list-item').attr("comment-id"));
    });

    //时光轴链接点击事件
    $(document).on('click', '.post-timeline a', function () {
        var e = $(this).parent();
        //layer.open({
        //    type: 1,
        //    title: e.attr('timeline-username') + '的时光轴(' + e.attr('timeline-date') + ')',
        //    content: $('#timeline_view') //这里content是一个DOM
        //});

        loadTimeLine(e.attr('timeline-user'), e.attr('timeline-date'), e.attr('timeline-date') + ' 23:59:59');

        $('#modal_timeline .modal-title').html(e.attr('timeline-username') + '的时光轴(' + e.attr('timeline-date') + ')');
        $('#modal_timeline').modal({
            backdrop: 'static'
        });
    });

    $('#ontall_menu_groups').off('click', 'a[group-id]').on('click', 'a[group-id]', function () {
        group_id = $(this).attr('group-id');
        group_name = $(this).find('span').html();
        post_load_type = "group";
        $('#post_search_time_clear').trigger('click');
    });

    $('#modal_post_access .modal-footer button').click(function () {
        var btn = $(this);
        btn.prop('disabled', true);
        var access_type = -1, access_groups = '';
        $('#modal_post_access .modal-body table input[name="iCheck"]:checked').each(function () {
            var e = $(this);
            var e_id = e.attr('id');
            if (e_id == 'cb_access_all') access_type = 0;
            else if (e_id == 'cb_access_self') access_type = 1;
            else {
                access_type = 2;
                var g_id = e.val();
                access_groups += (access_groups == '' ? g_id : ',' + g_id);
            }
        });
        if (access_type == -1) {
            $('#modal_alert_warning').find('.modal-title').html('请选择可见范围！');
            $('#modal_alert_warning').modal({ show: true });
            btn.prop('disabled', false);
            return;
        }

        post_save(access_type, access_groups);
    });

    //插入链接保存
    $('#btn_link_add').click(function () {
        var link_add = $(this).closest('.link-add');
        var link_site = $('#input_link_site').val();
        var link_title = $('#input_link_title').val();
        link_site = str_trim(link_site);
        link_title = str_trim(link_title);
        if (link_site == "") {
            $('#modal_alert_warning').find('.modal-title').html('请填写链接地址！');
            $('#modal_alert_warning').modal({ show: true });
            return;
        }
        if (link_title == "") link_title = link_site;
        var html = '<div class="link-item"><a data-site="' + link_site + '">' + link_title + '</a></div>';
        $(this).closest('.link-area').find('.link-list').append(html);
        $('#input_link_site').val('http://');
        $('#input_link_title').val('');
    });

    //按日期筛选动态
    $('#post_search_time').tooltip();
    $('#post_search_time').daterangepicker({
        minDate: '2015-01-01',
        showDropdowns: true,
        timePicker: false,
        autoApply: true,
        ranges: {
            '今天': [moment(), moment()],
            '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '本周': [moment().startOf('week'), moment().endOf('week')],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        drops: 'down'
    }, function (start, end, label) {
        var time_title = start.format('YYYY.M.D') + ' - ' + end.format('YYYY.M.D');
        $('#post_search_time span').html(time_title);
        $('#post_search_time_clear').show();
        //筛选动态
        post_start_date = start.format('YYYY-MM-DD'), post_end_date = end.add('days', 1).format('YYYY-MM-DD');
        initPostList(post_load_type, true);
    });

    //清除筛选按钮
    $('#post_search_time_clear').click(function () {
        $('#post_search_time span').html('');
        $(this).hide();
        $('#post_search_time').data('daterangepicker').setStartDate(moment());
        $('#post_search_time').data('daterangepicker').setEndDate(moment());
        post_start_date = '', post_end_date = '';
        initPostList(post_load_type, true);
    });

});

//初始化动态列表
function initPostList(post_load_type) {
    var load_id = autoId('loading');
    var loadHtml = '<div class="sk-spinner sk-spinner-three-bounce"><div class="sk-bounce1"></div><div class="sk-bounce2"></div><div class="sk-bounce3"></div></div>';
    
    var post_list = $("#home_post_list");
    
    var url = 'AjaxHandle/OAHandler.ashx?method=GetPosts';

    $.ajax({
        url: url,
        data: { start_date: post_start_date, end_date: post_end_date },
        cache: false,
        beforeSend: function () {
            post_list.append(loadHtml);
        },
        success: function (re) {
            var data = [];
            if (re != "")
                data = $.parseJSON(re);

            var list_html = creatPostListHtml(data);

            $('#' + load_id).remove();
            post_list.html(list_html);

            post_list.find('[data-toggle="tooltip"]').tooltip();
            post_list.find('.face-btn').each(function () {
                var e = $(this);
                initFacearea(e.attr('id'), 72);
            })
            post_list.find('textarea').each(function () {
                $(this).autoTextarea({ maxHeight: 120 });
                $(this).bind('drop', function () {
                    $(this).closest('.post-comment-add').find('.attach-area').slideDown();
                })
            });
            post_list.find('[name="uploadifive"]').each(function () {
                var e = $(this);
                var targetId = e.closest('.post-comment-add').find('textarea').attr('id');
                initUploadify(e.attr('id'), targetId, CurrUser);
            })

            post_list.find('.attach-view .image-list .img-viewer img').fakecrop({
                fill: false,
                wrapperWidth: 105
            });

            post_list.find('a[user-id]').each(function () {
                var e = $(this);
                var user_id = e.attr('user-id');
                if (user_id != '') {
                    loadUserInfoToTooltip(user_id, e)
                }
            });

            post_list.find('.post-text').textTruncate({
                limit: 200
            });


            post_list.find('input[data-token]').each(function () {
                var e = $(this);
                e.tokenfield({
                    showAutocompleteOnFocus: false,
                    beautify: false
                }).on('tokenfield:createdtoken', function (elem) {
                    var tag_names = e.tokenfield('getTokensList');
                    var post_id = e.closest('.post-list').attr("post-id");
                    saveTags(post_id, tag_names);
                }).on('tokenfield:removedtoken', function (elem) {
                    var tag_names = e.tokenfield('getTokensList');
                    var post_id = e.closest('.post-list').attr("post-id");
                    saveTags(post_id, tag_names);
                })
            });

        }
    })
}

//创建一条新动态
function creat_post() {
    var btn = $('#btn_post_save');
    btn.text("正在发表");
    btn.prop('disabled', true);

    var ctrl = $("#textarea_post");
    var con = ctrl.val();
    con = str_trim(con);

    if (con == "") {
        $('#modal_alert_warning').find('.modal-title').html('请填写动态内容！');
        $('#modal_alert_warning').modal({ show: true });
        ctrl.focus();
        btn.text("发表");
        btn.prop('disabled', false);
        return;
    }

    if (strlen(ctrl.val()) > 2000) {
        $('#modal_alert_warning').find('.modal-title').html('动态内容文字数不能超过2000(英文计半个字符)！');
        $('#modal_alert_warning').modal({ show: true });
        ctrl.focus();
        btn.text("发表");
        btn.prop('disabled', false);
        return;
    }

    //可见范围：仅自己/所有人
    var access_type = "-1";
    access_type = $('#div_access_select .access-item input[name="rd_access"]:checked').val();

    if (access_type == "-1" || access_type == undefined) {
        alert('请选择可见范围！');
        btn.text("发表");
        btn.prop('disabled', false);
        return;
    }

    post_save(access_type);
}

//根据id加载一条动态
function post_new_load(id) {
    if (id && id != "") {
        var load_id = autoId('loading');
        var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
        var post_list = $("#home_post_list");
        post_list.prepend(loadHtml);
        $.ajax({
            url: 'AjaxHandle/OAHandler.ashx?method=post_detail&id=' + id,
            cache: false,
            success: function (re) {
                var data = $.parseJSON(re);
                var list_html = creatPostListHtml(data);
                $("#" + load_id).remove();
                var top_posts = post_list.find('.post-list:has(".post-top-flag")');
                if (top_posts.length > 0) top_posts.last().next('hr').after(list_html);
                else post_list.prepend(list_html);

                if (data.length == 1) {
                    if (post_load_type == 'all' || post_load_type == 'group' || xm_tag_id != "0") {
                        post_load_cnt++;
                    }
                    else if (post_load_type == 'tag') {
                        if ((',' + data[0].tag_ids + ',').indexOf(',' + tag_id + ',') != -1) {
                            post_load_cnt++;
                        }
                    }
                }

                var this_post = $('.post-list[post-id="' + id + '"]', post_list);

                this_post.find('[data-toggle="tooltip"]').tooltip();
                this_post.find('.face-btn').each(function () {
                    var e = $(this);
                    initFacearea(e.attr('id'), 72);
                })
                this_post.find('textarea').each(function () {
                    $(this).autoTextarea({ maxHeight: 120 });
                })
                this_post.find('input[name="uploadifive"]').each(function () {
                    var e = $(this);
                    var targetId = e.closest('.post-comment-add').find('textarea').attr('id');
                    initUploadify(e.attr('id'), targetId, CurrUser);
                });

                this_post.find('.attach-view .image-list .img-viewer img').fakecrop({
                    fill: true,
                    wrapperWidth: 105
                });

                this_post.find('a[user-id]').each(function () {
                    var e = $(this);
                    var user_id = e.attr('user-id');
                    if (user_id != '') {
                        loadUserInfoToTooltip(user_id, e)
                    }
                });
                this_post.find('.post-text').textTruncate({
                    limit: 200
                });

                this_post.find('input[data-token]').each(function () {
                    var e = $(this);
                    e.tokenfield({
                        showAutocompleteOnFocus: false,
                        beautify: false
                    }).on('tokenfield:createdtoken', function (elem) {
                        var tag_names = e.tokenfield('getTokensList');
                        saveTags(id, tag_names);
                    }).on('tokenfield:removedtoken', function (elem) {
                        var tag_names = e.tokenfield('getTokensList');
                        var post_id = e.closest('.post-list').attr("post-id");
                        saveTags(post_id, tag_names);
                    });
                });
            }
        });
    }
}

//新增评论
function create_comment(post_id, content, reply_id, attach_ids) {
    $.ajax({
        url: 'AjaxHandle/OAHandler.ashx?method=post_comment_create',
        data: {
            content: content,
            post_id: post_id,
            reply_id: reply_id,
            attach_ids: attach_ids
        },
        success: function (re) {
            if (re > 0) {
                comment_new_load(re, post_id);
            }
        }
    });
}

//根据id加载一条评论
function comment_new_load(id, post_id) {
    if (id && id != "") {
        $.ajax({
            url: 'AjaxHandle/OAHandler.ashx?method=post_comment_detail&id=' + id,
            cache: false,
            success: function (re) {

                var data = []
                if (re != "")
                    data = $.parseJSON(re);
                if (data.length > 0) {

                    var list_html = creatPostCommentListHtml(data);
                    var a = $('table[post-id="' + post_id + '"]');
                    a.find('.post-comment-list').prepend(list_html);
                    a.find('[data-toggle="tooltip"]').tooltip();
                    a.find('a[user-id]').each(function () {
                        var e = $(this);
                        var user_id = e.attr('user-id');
                        if (user_id != '') {
                            loadUserInfoToTooltip(user_id, e)
                        }
                    });
                }
            }
        });
    }
}

//加载时光轴事件
function loadTimeLine(user_id, start_date, end_date) {
    var load_id = autoId('loading');
    var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
    $('#timeline1').after(loadHtml);

    var icons = { 'post': 'fa fa-pencil', 'post_comment': 'fa fa-comment', 'calendar': 'fa fa-calendar', 'mission': 'fa fa-tasks', 'mission_reply': 'fa fa-comments' };
    //随机颜色
    var colorArr = ["#007aff", "#f0ad4e", "#5bc0de", "#d9534f", "#60c560", "#009966", "#666699", "#330033", "#993300"];
    $.ajax({
        url: 'AjaxHandle/OAHandler.ashx?method=timeline_events',
        data: {
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            pageSize: 0
        },
        success: function (re) {
            var data = $.parseJSON(re);
            data.sort(function (a, b) {
                return moment(b.create_time) - moment(a.create_time);
            })
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<li>';
                html += '<div class="timeline-time">';
                var create_time = moment(data[i].create_time).format('YYYY.M.D h:mm:ss a');
                var time_str = create_time.split(' ');
                var time_str2 = (time_str[2] == 'am' ? '上午 ' : '下午 ') + time_str[1];
                time_str2 = time_str2.replace('上午 12', '上午 0').replace('下午 12', '上午 12');
                html += '<strong>' + time_str[0] + '</strong>' + time_str2;
                html += '</div>';
                html += '<div class="timeline-icon">';
                var n = Math.floor(Math.random() * colorArr.length + 1) - 1;
                html += '<div style="background: ' + colorArr[n] + '">';

                if (data[i].eType.indexOf("OA_") != -1) html += 'OA';
                else html += '<i class="' + icons[data[i].eType] + '"></i>';

                html += '</div>';
                html += '</div>';
                html += '<div class="timeline-content">';
                html += '<h3>' + data[i].title + '</h3>';
                html += '<p>' + data[i].content + '</p>';

                if (data[i].attachments && data[i].attachments.length > 0) {
                    html += '<div class="attach-view" style="margin-bottom:20px;">';
                    var data_attach = data[i].attachments;
                    var html1 = '<div class="file-list">';
                    var html2 = '<div class="image-list">';
                    for (var j = 0; j < data_attach.length; j++) {
                        var fileName = data_attach[j].old_name;
                        var filePath = data_attach[j].file_path.replace('~/', '/');
                        var fileSize = data_attach[j].file_size;
                        var filedata = createAttachItemHtml(fileName, filePath, data_attach[j].file_ext, fileSize, data_attach[j].id, 'postlist');
                        if (filedata.type == 'file') {
                            html1 = html1 + filedata.html;
                        }
                        else if (filedata.type == 'image') {
                            html2 = html2 + filedata.html;
                        }
                    }
                    html1 = html1 + "</div>";
                    html2 = html2 + "</div>";
                    html += html1 + html2 + '</div>';
                }
                html += '</div>';
                html += '</li>';
            }
            $('#' + load_id).remove();
            if (data.length > 0) {
                $('#timeline1').html(html);
                $('#timeline1').find('.post-text').textTruncate({
                    limit: 200
                });
                $('.img-viewer img').fakecrop({
                    fill: true,
                    wrapperWidth: 112
                });

                timelineAnimate();
            }
        }
    });
}

//滚动条滚动加载时光轴动画
function timelineAnimate(elem) {
    return $("#modal_timeline .timeline.animated li").each(function (i) {
        var bottom_of_object, bottom_of_window;
        bottom_of_object = $(this).position().top + $(this).outerHeight();
        bottom_of_window = $(window).scrollTop() + $(window).height();
        if (bottom_of_window > bottom_of_object) {
            return $(this).addClass("active");
        }
    });
};


//打开动态可见范围选择窗口
function openModalPostAccess() {
    $('#modal_post_access .modal-footer button').prop('disabled', false);
    $('#modal_post_access .modal-body table input[name="iCheck"]').iCheck('uncheck');
    $("#modal_post_access").modal({ show: true });
}

//保存创建的动态
function post_save(access_type) {
    var ctrl = $("#textarea_post");
    var con = ctrl.val();

    var attach_ids = getAttachIds($('#post_area_1 .attach-view .file-item'))
    var timeine_flag = 0;
    if ($('#cb_timeline').prop('checked'))
        timeine_flag = 1;

    //链接
    var data_links = [];
    $('.post-area .link-area .link-item').each(function () {
        var json = {};
        var a = $(this).find('a');;
        json["site"] = a.data('site');
        json["title"] = a.html();
        data_links.push(json);
    });

    data_links = JSON.stringify(data_links);
    $('.post-area .link-area').slideUp();
    $('.post-area .link-area .link-list').html('');
    $('#input_link_site').val('http://');
    $('#input_link_title').val('');

    $.ajax({
        url: 'AjaxHandle/OAHandler.ashx?method=post_create',
        data: {
            content: con,
            attach_ids: attach_ids,
            timeline: timeine_flag,
            access_type: access_type,
            data_links: data_links
        },
        type: 'post',
        success: function (re) {
            if (re > 0) {
                ctrl.val("");
                $("#post_area_1 .attach-area").slideUp();
                $("#post_area_1 .post-toolbars").slideUp();
                $('#post_area_1 .attach-view .file-item').remove();
                post_new_load(re);
                $('#modal_post_access').modal('hide');
                $('#div_access_select .access-item input[name="iCheck"]').iCheck('uncheck');
                $('#btn_post_save').text("发表");
                $('#btn_post_save').prop('disabled', false);
            }
        }
    });
}

function show_new_post_alert() {
    if (new_post_cnt > 0) {
        $('#new_post_alert strong').html(new_post_cnt);
        $('#new_post_alert').show();
    }
    else
        $('#new_post_alert').hide();
}

//保存标签
function saveTags(post_id, tag_names) {
    $.ajax({
        url: 'AjaxHandle/OAHandler.ashx?method=post_tag_save',
        data: { post_id: post_id, tag_names: tag_names },
        cache: false,
        success: function (re) {
        }
    });
}

function getPositionSuccess(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    //alert("您所在的位置： 纬度" + lat + "，经度" + lng);
    //if (typeof position.address !== "undefined") {
    //    var country = position.address.country;
    //    var province = position.address.region;
    //    var city = position.address.city;
    //    alert(' 您位于 ' + country + province + '省' + city + '市');
    //}
}

function getPositionError(error) {
    switch (error.code) {
        case error.TIMEOUT:
            layer.msg("连接超时，请重试");
            break;
        case error.PERMISSION_DENIED:
            layer.msg("您拒绝了使用位置共享服务，查询已取消");
            break;
        case error.POSITION_UNAVAILABLE:
            layer.msg("获取位置信息失败");
            break;
    }
}

function SignIn_click() {
    layer.confirm('确定签到？', {
        icon: 3,
        //title: '确定签到?',
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax("AjaxHandle/WeiXinHandle.ashx", {
            data: {
                latitude: escape(lat),
                longitude: escape(lng),
                UserId: escape(CurrUser),
                iname: escape("上班"),
                method: "SignIn"
            },
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型	
            timeout: 8000,
            beforeSend: function () {
                $("#btnSignIn").attr("disabled", "disabled");
                $("#btnSignIn").html("正在签到……")
            },
            success: function (data) {
                layer.msg(data.message);
                if (data.Code == "200") {
                    vm_sign.onwork_checktime = GetTime();
                    vm_sign.onwork_sign = true;
                    vm_sign.onwork_checksta = data.checkSta;
                }
                $("#btnSignIn").html("签到");
                $("#btnSignIn").removeAttr("disabled");
            },
            error: function (xhr, type, errorThrown) {
                $("#btnSignIn").html("签到");
                $("#btnSignIn").removeAttr("disabled");
            }
        });
    }, function () {
    });
}

//签退
function SignOut_click() {
    layer.confirm('确定签退？', {
        icon: 3,
        //title: '确定签到?',
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax("AjaxHandle/WeiXinHandle.ashx", {
            data: {
                latitude: escape(lat),
                longitude: escape(lng),
                UserId: escape(CurrUser),
                iname: escape("下班"),
                method: "SignIn"
            },
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型	
            timeout: 8000,
            beforeSend: function () {
                $("#btnSignOut").attr("disabled", "disabled");
                $("#btnSignOut").html("正在签退……")
            },
            success: function (data) {
                layer.msg(data.message);
                if (data.Code == "200") {
                    vm_sign.offwork_checktime = GetTime();
                    vm_sign.offwork_sign = true;
                    vm_sign.offwork_checksta = data.checkSta;
                }
                $("#btnSignOut").html("签退");
                $("#btnSignOut").removeAttr("disabled");
            },
            error: function (xhr, type, errorThrown) {
                $("#btnSignOut").html("签退");
                $("#btnSignOut").removeAttr("disabled");
            }
        });
    }, function () {
    });
}
