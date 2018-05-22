/************************************* right-panel ***********************************************/
//初始化动态列表

function initPostList(type, is_refresh) {
    var load_id = autoId('loading');
    var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
    var post_list = $("#home_post_list");
    post_list.html('');
    post_list.append(loadHtml);
    if (type != post_load_type) is_refresh = true;
    if (is_refresh)
        post_load_cnt = 0;

    var post__type_name = $('#span-post-list');
    if (type == "all")
        post__type_name.html('项目动态');
    else if (type == "plan") post__type_name.html('计划');
    else if (type == "progress") post__type_name.html('形象进度');
    else if (type == "problem") post__type_name.html("存在问题");
    else if (type == "daily") post__type_name.html("日常信息");
    else if (type == "tag") post__type_name.html('#' + tag_name + '#');

    var url = 'data/PostServer.aspx?method=post_all&xm_id=' + right_miss_id + '&isTop=0&cnt_now=' + post_load_cnt;
    if (type && type != 'all') url = url + '&type=' + type;
    //if (type == 'group') url = url + '&group_id=' + group_id;
    //else if (type == 'tag') url = url + '&tag_id=' + tag_id;
    if (xm_tag_id != "0") {
        url = url + '&xm_tag_id=' + xm_tag_id;
    }

    $.ajax({
        url: url,
        data: { start_date: post_start_date, end_date: post_end_date },
        cache: false,
        success: function (re) {
            var data = $.parseJSON(re);
            var list_html = creatPostListHtml(data);
            post_load_cnt = post_load_cnt + data.length;
            $('#' + load_id).remove();
            if (is_refresh)
                post_list.html(list_html);
            else
                post_list.append(list_html);

            post_load_type = type;
            if (post_load_cnt >= 10)
                $('#load-more').show();
            else $('#load-more').hide();

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
                initUploadify(e.attr('id'), targetId, getServerUserId());
            })

            post_list.find('.attach-view .image-list .img-viewer img').fakecrop({
                fill: true,
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
    });
}
//初始化置顶动态
function initPostList_top() {
    var load_id = autoId('loading');
    var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
    var post_list = $("#home_post_list_top");
    post_list.html('');
    post_list.prepend(loadHtml);

    var url = 'data/PostServer.aspx?method=post_all&cnt_now=0&isTop=1&xm_id=' + right_miss_id;
    if (xm_tag_id != "0") {
        url = url + '&xm_tag_id=' + xm_tag_id;
    }
    $.ajax({
        url: url,
        cache: false,
        success: function (re) {
            var data = $.parseJSON(re);
            var list_html = creatPostListHtml(data, 1);
            $('#' + load_id).remove();
            post_list.prepend(list_html);

            if (list_html == '') post_list.closest('.panel').fadeOut();
            else {
                post_list.closest('.panel').fadeIn();
                top_post_pagenation();
            }

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
                initUploadify(e.attr('id'), targetId, getServerUserId());
            })

            post_list.find('.attach-view .image-list .img-viewer img').fakecrop({
                fill: true,
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


//置顶动态分页
function top_post_pagenation() {
    var list_length = $('#home_post_list_top .post-list').length;
    $("#Pagination").pagination(list_length, {
        num_edge_entries: 1, //边缘页数
        num_display_entries: 3, //主体页数
        callback: pageselectCallback,
        items_per_page: 1, //每页显示数目
        prev_text: '<i class="fa fa-chevron-left"></i>',
        next_text: '<i class="fa fa-chevron-right"></i>'
    });
}

function pageselectCallback(page_index, jq) {
    $('#home_post_list_top .post-list').hide();
    $('#home_post_list_top .post-list:eq(' + page_index + ')').show();
}
//打开动态可见范围选择窗口
function openModalPostAccess() {
    $('#modal_post_access .modal-footer button').prop('disabled', false);
    $('#modal_post_access .modal-body table input[name="iCheck"]').iCheck('uncheck');
    $("#modal_post_access").modal({ show: true });
}

function loadAccessItem() {
    $.ajax({
        url: 'BaseServer2.aspx?method=getMyGroupList&userId=' + getServerUserId(),
        success: function (re) {
            var data = $.parseJSON(re);
            var html = '';
            var html2 = '';
            for (var i = 0; i < data.length; i++) {
                if (i == 0) html += '<tr>';
                html += '<td><input name="iCheck" type="checkbox" value="' + data[i].id + '" />&nbsp;' + data[i].groupname + '</td>';
                if ((i + 1) % 3 == 0) html += '</tr><tr>';
                html2 += '<div class="access-item"><input name="iCheck" type="checkbox" value="' + data[i].id + '" />&nbsp;<span class="access-name">' + data[i].groupname + '<span></div>';
            }

            $('#div_access_select').append(html2);

            $('#div_access_select .access-item input[name="iCheck"]').iCheck({
                checkboxClass: 'icheckbox_square-green',
                increaseArea: '0'
            }).on('ifChecked', function () {
                var e = $(this);
                var e_id = e.attr('id');
                if (e_id == 'cb_access_all2' || e_id == 'cb_access_self2') {
                    $('#div_access_select .access-item input[name="iCheck"]').not(e).iCheck('uncheck');
                }
                else {
                    $('#cb_access_all2,#cb_access_self2').iCheck('uncheck');
                }

                var checkeds = $('#div_access_select .access-item input[name="iCheck"]:checked');
                if (checkeds.length == 1) {
                    $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;' + e.closest('.access-item').find('.access-name').html() + ' <span class="caret"></span>')
                }
                else if (checkeds.length > 1)
                    $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;已选择' + checkeds.length + '项 <span class="caret"></span>');

            }).on('ifUnchecked', function () {
                var checkeds = $('#div_access_select .access-item input[name="iCheck"]:checked');
                if (checkeds.length == 0) {
                    $('#btn_access_select').html('<i class="fa fa-eye"></i>&nbsp;可见范围 <span class="caret"></span>')
                }
            });
            $("#modal_post_access .modal-body table").append(html);
            $('#modal_post_access .modal-body table input[name="iCheck"]').iCheck({
                checkboxClass: 'icheckbox_square-green'
            }).on('ifChecked', function () {
                var e = $(this);
                var e_id = e.attr('id');
                if (e_id == 'cb_access_all' || e_id == 'cb_access_self') {
                    $('#modal_post_access .modal-body table input[name="iCheck"]').not(e).iCheck('uncheck');
                }
                else {
                    $('#cb_access_all,#cb_access_self').iCheck('uncheck');
                }

            });
        }
    });
}

function creat_post() {

    var ctrl = $("#textarea_post");
    var con = ctrl.val();
    con = str_trim(con);

    if (con == "") {
        $('#modal_alert_warning').find('.modal-title').html('请填写动态内容！');
        $('#modal_alert_warning').modal({ show: true });
        ctrl.focus();
        return;
    }

    if (strlen(ctrl.val()) > 2000) {
        $('#modal_alert_warning').find('.modal-title').html('动态内容文字数不能超过2000(英文计半个字符)！');
        $('#modal_alert_warning').modal({ show: true });
        ctrl.focus();
        return;
    }

    if (con != "") {
        var checkeds = $('#div_access_select .access-item input[name="iCheck"]:checked');
        if (checkeds.length == 0) {
            openModalPostAccess();
        }
        else {
            $('#btn_post_save').prop('disabled', true);
            var access_type = -1, access_groups = '';
            checkeds.each(function () {
                var e = $(this);
                var e_id = e.attr('id');
                if (e_id == 'cb_access_all2') access_type = 0;
                else if (e_id == 'cb_access_self2') access_type = 1;
                else {
                    access_type = 2;
                    var g_id = e.val();
                    access_groups += (access_groups == '' ? g_id : ',' + g_id);
                }
            });
            post_save(access_type, access_groups);
        }
    }
}
//保存创建的动态
function post_save(access_type, access_groups) {
    var ctrl = $("#textarea_post");
    var con = ctrl.val();

    var attach_ids = getAttachIds($('#post_area_1 .attach-view .file-item'))
    var timeine_flag = 0;
    if ($('#cb_timeline').prop('checked')) timeine_flag = 1;

    //链接
    var data_links = [];
    $('.post-area .link-area .link-item').each(function () {
        var json = {};
        var a = $(this).find('a');;
        json["site"] = a.data('site');
        json["title"] = a.html();
        data_links.push(json);
    })
    data_links = JSON.stringify(data_links);
    $('.post-area .link-area').slideUp();
    $('.post-area .link-area .link-list').html('');
    $('#input_link_site').val('http://');
    $('#input_link_title').val('');


    $.ajax({
        url: 'data/PostServer.aspx?method=post_create',
        data: { content: con, attach_ids: attach_ids, timeline: timeine_flag, access_type: access_type, access_groups: access_groups, data_links: data_links, xm_id: miss_id, xm_tag_id: $('#select_xm_type').val() },
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

//根据id加载一条动态
function post_new_load(id) {
    if (id && id != "") {
        var load_id = autoId('loading');
        var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
        var post_list = $("#home_post_list");
        post_list.prepend(loadHtml);
        $.ajax({
            url: 'data/PostServer.aspx?method=post_detail&id=' + id,
            cache: false,
            success: function (re) {
                var data = $.parseJSON(re);
                var list_html = creatPostListHtml(data);
                $("#" + load_id).remove();
                var top_posts = post_list.find('.post-list:has(".post-top-flag")');
                if (top_posts.length > 0) top_posts.last().next('hr').after(list_html);
                else post_list.prepend(list_html);

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
                    initUploadify(e.attr('id'), targetId, getServerUserId());
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
                        saveTags(id, tag_names);
                    })
                });
            }
        });
    }
}
//新增评论
function create_comment(post_id, content, reply_id, attach_ids) {
    $.ajax({
        url: 'data/PostServer.aspx?method=post_comment_create',
        data: { content: content, post_id: post_id, reply_id: reply_id, attach_ids: attach_ids },
        success: function (re) {
            if (re > 0) {
                comment_new_load(re, post_id);
            }
        }
    });
}
function comment_new_load(id, post_id) {
    if (id && id != "") {
        $.ajax({
            url: 'data/PostServer.aspx?method=post_comment_detail&id=' + id,
            cache: false,
            success: function (re) {
                var data = $.parseJSON(re);
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
        });
    }
}
function saveTags(post_id, tag_names) {
    $.ajax({
        url: 'data/PostServer.aspx?method=post_tag_save',
        data: { post_id: post_id, tag_names: tag_names },
        cache: false,
        success: function (re) {
        }
    });
}
/************************************* right-panel end***********************************************/