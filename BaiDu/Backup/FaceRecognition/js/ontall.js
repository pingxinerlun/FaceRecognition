var _IE = getIEVersion();
if (_IE && _IE < 10) {
    window.location.href = '/old_browser.aspx';
}

//获取IE版本
function getIEVersion() {
    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
    return v > 4 ? v : false;
}

//动态生成控件id
function autoId(type) {
    var guid = uuid(10, 16);
    var newId = type + '_' + guid;
    return newId;
}

//删除字符串中的a标签
function delHtmlTag(str) {
    return str.replace(/<a[\s]+[^>]+>([^<>]+)<\/a>/g, "$1");//去掉所有的a标签
}

//表情插件初始化
function initFacearea(facebtn_id, faceNum) {
    var e = $('#' + facebtn_id);
    var contentId = e.attr('contentId');
    var id = autoId('facebox');
    e.qqFace({
        id: id,
        assign: contentId,
        faceNum: faceNum//显示的表情数量

    });
}

//表情文字标识替换成对应图片
function replace_em(str) {
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/images/faces/$1.gif" border="0" />');
    return str;
}

//生成全局唯一标识
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//点击显示动画效果
function Animation1(event, text, container) {
    var $i = $("<b>").text(text);
    var x = event.pageX - 20, y = event.pageY;
    $i.css({ top: y - 30, left: x, position: "absolute", color: "#2a6496" });
    container.append($i);
    $i.animate({ top: y - 80, opacity: 0, "font-size": "14px" }, 1500, function () {
        $i.remove();
    });
}

//去掉字符串两端空格
function str_trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

//字符串字符数
function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        len += (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 255 ? 0.5 : 1);
    }
    return len;
}


$(function () {
    //面板收起展开按钮
    $('.panel-toggle-body').click(function () {
        if ($(this).find('i').hasClass('fa-chevron-circle-up'))
            $(this).html('<i class="fa fa-chevron-circle-down"></i>');
        else
            $(this).html('<i class="fa fa-chevron-circle-up"></i>');
        $(this).closest('.panel-heading').next('.panel-body').slideToggle();
    })

    //$(document).on('click', 'a[user-id]', function () {
    //    location.href = 'profile.aspx?user_id=' + $(this).attr('user-id');
    //});

    $('a[user-id]').each(function () {
        var e = $(this);
        var user_id = e.attr('user-id');
        if (user_id != '') {
            loadUserInfoToTooltip(user_id, e)
        }
    });

    //附件框开关
    $(document).on('click', '.btn-attach', function () {
        bind_attach_click(this);
    });

    //附件预览区删除按钮事件
    $(document).on('click', '.attach-view .btn-attach-del', function () {
        var item = $(this).closest('.file-item');
        item.fadeOut(function () {
            item.remove();
        });
    })

    //附件预览区下载按钮事件
    $(document).on('click', '.attach-view .btn-attach-download', function () {
        var attach_id = $(this).attr('attach-id');
        location.href = '/AttaDownLoad.aspx?id=' + attach_id;
    })

    $(document).on('click', '.link-item a', function () {
        var site = $(this).data('site');
        window.open(site);
    });

    //回复评论框开关
    $(document).on('click', ".comment-reply", function () {
        var e = $(this);
        var item = e.closest('.comment-center');
        var elem = item.find('.post-comment-add');
        if (elem.length > 0) {
            elem.slideToggle();
        }
        else {
            var html = '<div class="post-comment-add" style="display:none;">';
            html = html + '                     <form role="form">';
            html = html + '                           <div class="form-group">';
            var textarea_id = autoId('textarea');
            html = html + '                               <textarea id="' + textarea_id + '" mention-data="true" class="form-control" rows="1" placeholder="说点什么..."></textarea>';
            html = html + '                           </div>';
            html = html + '                       </form>';
            html = html + '     <div class="mention-area">';
            html = html + '         <div class="mention-select">';
            html = html + '         </div>';
            html = html + '     </div>';
            html = html + '                      <div class="comment-add-bars">';
            html = html + '                                  <a href="javascript:void(0)" class="btn-attach" style="margin: 10px;"><i class="fa fa-paperclip fa-lg" title="附件"></i></a>';
            var facebtn_id = autoId('facebtn');
            html = html + '                <a id="' + facebtn_id + '" contentId="' + textarea_id + '" href="javascript:void(0)" class="face-btn" style="margin: 10px;"><i class="fa fa-meh-o fa-lg" title="表情"></i></a>';
            html = html + '                                   <button class="btn btn-primary btn-xs" style="float:right;">发表</button>';
            html = html + '                      </div>';

            uploadify_id = autoId('uploadify');
            html = html + ' <div class="attach-area" style="display:none">';
            html = html + '   <div id="fileQueue">';
            html = html + '   </div>';
            html = html + '   <input type="file" name="uploadify" id="' + uploadify_id + '" />';
            html = html + '   <div class="attach-view"><div class="file-list"></div><div class="image-list"></div></div>';
            html = html + ' </div>';

            html = html + '                  </div>';
            item.append(html);
            $("#" + textarea_id).autoTextarea({ maxHeight: 120 });
            initFacearea(facebtn_id, 72);
            item.find('.post-comment-add').slideToggle();
            initUploadify(uploadify_id, textarea_id, CurrUser);
            $("#" + textarea_id).bind('drop', function () {
                item.find('.post-comment-add .attach-area').slideDown();
            })
        }
    });

    //评论项目过多时 查看全部/收起 按钮
    $(document).on('click', '.post-comment-list .comment-show-hide', function () {
        var btn = $(this);
        var a = btn.find('a');

        var items = btn.prevAll('.comment-list-item');
        for (var i = 0; i < items.length; i++) {
            if (i < (items.length - 2)) {
                if (a.html() == "查看全部评论")
                    $(items[i]).show();
                else
                    $(items[i]).hide();
            }
        }

        if (a.html() == "查看全部评论") a.html('收起部分评论');
        else a.html('查看全部评论');

    })

    $(document).bind('click', function (e) {
        var elem = $(e.target);
        if (elem.closest('.mention-select').length == 0) $('.mention-select').hide();
    })

    //监听输入框@或#
    var mention_type = "";
    var con_prev = "";
    var con_next = "";
    var nowPos = { text: "", start: 0, end: 0 };
    var con_textarea = "";
    //$(document).on('blur', 'textarea[mention-data="true"]', function (event) {
    //    var mention = $(this).closest('form').next('div').find('.mention-select');
    //    mention.hide();
    //});

    $(document).on('keydown', 'textarea[mention-data="true"]', function (event) {
        var mention = $(this).closest('form').next('div').find('.mention-select');

        if (mention.css('display') == 'block') {
            if (window.event) {
                var key = window.event.keyCode;
            } else {
                var key = event.which;
            }
            var this_item = mention.find('tr.active');
            if (key == 38)//向上
            {
                event.preventDefault();
                var next_item = this_item.prev('tr');
                if (next_item.length > 0) {
                    this_item.removeClass('active');
                    next_item.addClass('active');
                }
                return;
            }
            else if (key == 40)//向下
            {
                event.preventDefault();
                var next_item = this_item.next('tr');
                if (next_item.length > 0) {
                    this_item.removeClass('active');
                    next_item.addClass('active');
                }
                return;
            }
            else if (key == 13) {//回车
                event.preventDefault();
                this_item.trigger('click');
                return;
            }
        }
    });

    $(document).on('keyup', 'textarea[mention-data="true"]', function (event) {
        var tx = $(this)[0];

        var mention = $(this).closest('form').next('.mention-area').find('.mention-select');

        var oValue = tx.value;
        if (oValue == con_textarea) return;
        else con_textarea = oValue;

        nowPos1 = getPosition(tx);
        var new_input = oValue.length > 1 ? oValue.substring(nowPos1.start - 1, nowPos1.start) : oValue;
        if (new_input == '@') {
            nowPos = getPosition(tx);
            con_prev = oValue.substring(0, nowPos.start);
            con_next = oValue.substring(nowPos.start, oValue.length);
            loadMentionList('user', mention);
            mention_type = "user";
        }
        else if (new_input == "#") {
            nowPos = getPosition(tx);
            con_prev = oValue.substring(0, nowPos.start);
            con_next = oValue.substring(nowPos.start, oValue.length);
            loadMentionList('tag', mention);
            mention_type = "tag";
        }
        else {
            //在mention-list中筛选            if (nowPos1.start <= nowPos.start) mention.hide();
            else {
                //loadMentionList(mention_type, oValue.substring(nowPos.start, nowPos1.start), mention);
                var key = oValue.substring(nowPos.start, nowPos1.start);
                if (mention_type == 'user') {
                    var user_type = $('.btn-group input:checked').val();

                    var first_tr = 0;
                    $('table[data-type="' + user_type + '"] tr', mention).each(function () {
                        var name = $(this).find('.user-name').text();
                        if (name.indexOf(key) != -1 || (pinyin.getFullChars(name)).toLowerCase().indexOf(key.toLowerCase()) != -1) {
                            $(this).show();
                            if (first_tr == 0) { $(this).addClass('active'); first_tr = 1; }
                        }
                        else $(this).hide();
                    })
                }
            }
        }
    });

    //用户选择框的用户选择事件(tr点击事件)
    $(document).on('click', '.mention-select tr', function () {
        var e = $(this);
        var m_type = e.attr("mention-type")
        var user_name = $('td.user-name', this).text();
        var mention = e.closest('.mention-select');
        var this_textarea = mention.parent('div').prev('form').find('textarea[mention-data="true"]');

        if (m_type == "tag") user_name = user_name + "#";
        user_name = user_name + " ";

        addTextToPosition(this_textarea[0], nowPos, con_prev + user_name + con_next, user_name.length);
        mention.slideUp();
        mention_type = '';
    });

    //用户选择框 选择类型切换
    $(document).on('change', '.mention-select .btn-group input:radio', function () {
        var type = $(this).val();
        var mention_area = $(this).closest('.mention-select');
        if (type == "user") {
            $('table[data-type="user"] tr:first', mention_area).addClass('active');
            $('table[data-type="group"] tr.active', mention_area).removeClass('active');
            $('table[data-type="group"]', mention_area).hide();
            $('table[data-type="user"]', mention_area).show();
        }
        else {
            $('table[data-type="group"] tr:first', mention_area).addClass('active');
            $('table[data-type="user"] tr.active', mention_area).removeClass('active');
            $('table[data-type="user"]', mention_area).hide();
            $('table[data-type="group"]', mention_area).show();
        }
    });

    //删除确认按钮点击事件
});


/*以下为通用页面元素初始化方法等*/


/************************************附件部分 Start*************************************/
//附件框开关
function bind_attach_click(obj) {
    var e = $(obj);
    var item = e.parent('div').parent('div');
    var elem = item.find('.attach-area');
    if (elem.length > 0) {
        elem.slideToggle();
    }

    if (e.parent().find('.btn-link2').length > 0)
        e.parent().parent().find('.link-area').slideUp();

}

//初始化上传插件
function initUploadify(uploadify_id, dropTarget_id, upload_user_id) {
    $("#" + uploadify_id).uploadifive({
        auto: true,
        buttonText: '<span class="fa fa-folder-open"></span>&nbsp;浏览',
        width: '60px',
        height: '22',
        uploadScript: '/AjaxHandle/UploadifiveUploadServer.ashx',
        formData: { 'userId': upload_user_id },
        uploadLimit: 50,
        multi: true,
        dropTarget: dropTarget_id,
        'removeCompleted': true,
        //'onUpload': function () {
        //},
        'onAddQueueItem': function (file) {
            var fileName = file.name;
            var ext = fileName.substring(fileName.lastIndexOf("."), fileName.length); // Extract EXT
            var limitExts = ['.gif', '.jpg', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.pdf', '.zip', '.rar', '.gz'];
            if (limitExts.indexOf(ext.toLowerCase()) == -1) {
                $('#' + uploadify_id).uploadifive('cancel', file);
                $('#modal_alert_warning').find('.modal-title').html('不支持的文件格式');
                $('#modal_alert_warning').modal({ show: true });
            }
            //针对某些单位解除上传大小限制
            //if ((file.size / 1024) > 10240) {
            //    $('#' + uploadify_id).uploadifive('cancel', file);
            //    $('#modal_alert_warning').find('.modal-title').html('请上传不超过10M的文件');
            //    $('#modal_alert_warning').modal({ show: true });
            //}
        },
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            $('#modal_alert_warning').find('.modal-title').html('文件“' + file.name + '”上传失败: ' + errorString);
            $('#modal_alert_warning').modal({ show: true });
        },
        'onUploadComplete': function (file, data, response) {
            addUploadedAttach(uploadify_id, data, file);
            $('#' + uploadify_id).uploadifive('cancel', file);
        },
        'onDrop': function (file, fileDropCount) {

        }
    });
};

//已上传的附件插入到预览区
function addUploadedAttach(uploadifive_id, data, file) {
    var fileData = $.parseJSON(data);
    var attach_id = fileData.id;
    var filePath = fileData.file_path.replace('~/', '/');
    var fileName = file.name;
    var fileExt = fileData.ext;
    var fileSize = fileData.size;

    var imgGroupId = autoId('img');

    var data = createAttachItemHtml(fileName, filePath, fileExt, fileSize, attach_id, imgGroupId);
    if (data.type == 'file') {
        $('#' + uploadifive_id).closest('.attach-area').find('.attach-view .file-list').append(data.html);
    }
    else if (data.type == 'image') {
        var list = $('#' + uploadifive_id).closest('.attach-area').find('.attach-view .image-list');
        list.append(data.html);
        list.find('.img-viewer img').fakecrop({
            fill: false,
            wrapperWidth: 112
        });
    }
}

//生成附件预览的Html代码
function createAttachItemHtml(fileName, filePath, fileExt, fileSize, attach_id, flag, imgGroupId) {
    fileExt = fileExt.toLowerCase();
    var imgExts = ['.gif', '.jpg', '.png', '.bmp'];
    var docExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.pdf', '.zip', '.rar', '.gz'];
    var html = '';
    var type = '';
    if (docExts.indexOf(fileExt) > -1) {
        var icon = "fa-file-text-o";
        if (fileExt == ".doc" || fileExt == ".docx") {
            icon = "fa-file-word-o";
        }
        else if (fileExt == ".xls" || fileExt == ".xlsx") {
            icon = "fa-file-excel-o";
        }
        else if (fileExt == ".ppt" || fileExt == ".pptx") {
            icon = "fa-file-powerpoint-o";
        }
        else if (fileExt == ".pdf") {
            icon = "fa-file-pdf-o";
        }
        else if (fileExt == ".zip" || fileExt == ".rar" || fileExt == ".gz") {
            icon = "fa-file-zip-o";
        }

        html = html + '    <div class="file-item" attach-id="' + attach_id + '">';
        html = html + '         <table style="width:100%;">';
        html = html + '            <tr>';
        html = html + '                <td style="width:30px;text-align:center"><i class="fa ' + icon + ' fa-lg"></i></td>';
        html = html + '                <td>' + fileName + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:12px;color:#999">(' + fileSize + ')</td>';
        if (flag == "postlist") {
            html = html + ' <td style="width:30px;text-align:center"><a class="btn-attach-view" attach-id="' + attach_id + '" title="预览"><i class="fa fa-search-plus"></i></a></td>';
            html = html + ' <td style="width:30px;text-align:center"><a class="btn-attach-download" attach-id="' + attach_id + '" title="下载"><i class="fa fa-cloud-download"></i></a></td>';
        }
        else {
            html = html + ' <td style="width:50px;text-align:center"><a class="btn-attach-del" attach-id="' + attach_id + '" title="删除"><i class="fa fa-times"></i></a></td>';
        }
        html = html + '            </tr>';
        html = html + '        </table>';
        html = html + '    </div>';

        type = 'file';

    }
    else if (imgExts.indexOf(fileExt) > -1) {
        html = html + '     <div class="file-item" attach-id="' + attach_id + '">';
        html = html + '         <a class="img-viewer" data-lightbox="' + imgGroupId + '" data-title="' + fileName + '" href="' + filePath + '"><img src="' + filePath + '" /></a>';
        if (flag == "postlist")
        { }
        else
        {
            html = html + '         <a class="btn-attach-del" attach-id="' + attach_id + '" title="删除"><i class="fa fa-times"></i></a>';
        }
        html = html + '     </div>';

        type = 'image';
    }
    return { html: html, type: type };
}

//发表动态或回复时，获取上传的附件id
function getAttachIds(items) {
    var attach_ids = '';
    items.each(function () {
        var id = $(this).attr('attach-id');
        if (id && id != "")
            attach_ids = attach_ids + (attach_ids == '' ? id : ',' + id);
    });
    return attach_ids;
}

/************************************附件部分 End*************************************/

/************************************评论部分 Start*************************************/
//拼接html，实现一条评论的样式
function creatPostCommentListHtml(data) {

    var list_html = '';
    for (var i = 0; i < data.length; i++) {
        list_html = list_html + '<div class="comment-list-item" comment-id="' + data[i].id + '"';
        if (data.length > 3 && i > 1)
            list_html += ' style="display:none;"';
        list_html = list_html + '>';
        list_html = list_html + '   <div class="comment-left">';
        list_html = list_html + '       <a user-id="' + data[i].create_user + '"><img src="' + data[i].headIcon + '"';

        list_html += ' /></a>';

        list_html = list_html + '   </div>';
        list_html = list_html + '   <div class="comment-center">';
        list_html = list_html + '       <div class="comment-user">';
        list_html = list_html + '          <a user-id="' + data[i].create_user + '"';

        list_html += '>' + data[i].name + '</a>';

        /************************评论是否为回复他人************************/
        var data_reply = data[i].reply_comment;
        if (data_reply && data_reply.length > 0) {
            var reply_comment_con = delHtmlTag(data_reply[0].content);
            //reply_comment_con = reply_comment_con.replace(/<img src=\"\/images\/faces\/([0-9]*).gif" border=\"0\"\/>/g, "[em_$1]");
            reply_comment_con = reply_comment_con.replace(/\"/g, "'");
            list_html = list_html + '&nbsp;回复&nbsp;<a user-id="' + data_reply[0].create_user + '">' + data_reply[0].name + '</a>&nbsp;&nbsp;<i class="fa fa-comment text-warning" data-toggle="tooltip" data-html="true" data-placement="top" title="' + reply_comment_con + '"></i>';
        }
        /*******************************************************/
        list_html = list_html + '           <span class="comment-time">' + getDateDiff(data[i].create_time) + '</span>';

        list_html = list_html + '           <a class="comment-reply" style="float: right;font-size:12px;">回复</a>';
        if (CurrUser == data[i].create_user) {
            list_html = list_html + '           <a class="comment-del" style="float: right;font-size:12px;margin-right:20px;">删除</a>';
        }

        list_html = list_html + '       </div>';
        list_html = list_html + '       <div class="comment-con">' + data[i].content + '</div>';

        /*************************附件预览*********************************/
        var data_attach = data[i].attachments;
        list_html = list_html + '   <div class="attach-view">';

        var html1 = '<div class="file-list">';
        var html2 = '<div class="image-list">';
        for (var j = 0; j < data_attach.length; j++) {
            var fileName = data_attach[j].old_name;
            var filePath = data_attach[j].file_path.replace('~/', '/');
            var fileSize = data_attach[j].file_size;
            var filedata = createAttachItemHtml(fileName, filePath, data_attach[j].file_ext, fileSize, data_attach[j].id, 'postlist', 'post_comment_' + data[i].id);
            if (filedata.type == 'file') {
                html1 = html1 + filedata.html;
            }
            else if (filedata.type == 'image') {
                html2 = html2 + filedata.html;
            }
        }
        html1 = html1 + "</div>";
        html2 = html2 + "</div>";

        list_html = list_html + html1 + html2;

        list_html = list_html + '   </div>';
        /****************************************************************************/

        list_html = list_html + '   </div>';
        list_html = list_html + '</div>';
        if (data.length > 3 && (i + 1) == data.length) list_html = list_html + '<div class="comment-show-hide"><a>查看全部评论</a></div>';
    }
    return list_html;
}

/************************************评论部分 End*************************************/

//根据类型和id 删除一项
function deleteItem(del_type, del_id) {
    //询问框
    layer.confirm('您确认删除当前数据？', {
        icon: 3,
        title: '确认删除?',
        btn: ['确定', '取消'] //按钮
    }, function () {
        var url = "";
        switch (del_type) {
            case "post":    //动态
                url = 'AjaxHandle/OAHandler.ashx?method=post_delete_id&id=' + del_id;
                break;
            case "post_comment":    //动态评论
                url = 'AjaxHandle/OAHandler.ashx?method=post_comment_delete_id&id=' + del_id;
                break;
        }

        if (url != "") {
            $.ajax({
                url: url,
                success: function (re) {
                    if (re == 1) {
                        switch (del_type) {
                            case "post":
                                var post_list = $('.post-list[post-id="' + del_id + '"]');
                                var post_list_p_id = post_list.parent().attr('id');
                                post_list.next('hr').remove();
                                post_list.remove();
                                layer.msg('删除成功!');
                                break;
                            case "post_comment":
                                var comment_item = $('.comment-list-item[comment-id="' + del_id + '"]');
                                var btn_comment = comment_item.closest('.post-center').find('.post-toolbar .btn-comment');

                                comment_item.remove();
                                layer.msg('删除成功!');
                                break;
                            case "missReplies":
                                var comment_item = $('.comment-list-item[comment-id="' + del_id + '"]');
                                comment_item.remove();
                                layer.msg('删除成功!');
                                break;
                            case "mission":
                                var mission_item = $('.mission-item[miss-id="' + del_id + '"]');
                                mission_item.remove();
                                layer.msg('删除成功!');
                                break;
                            case "account":
                                var mission_item = $('#groups .mission-item[miss-id="' + del_id + '"]');
                                mission_item.remove();
                                layer.msg('删除成功!');
                                break;
                        }

                    }
                }
            })
        }
    }, function () {
    });

}

//拼接html，实现一条动态的样式
function creatPostListHtml(data, isTop) {
    var list_html = '';

    for (var i = 0; i < data.length; i++) {

        list_html = list_html + '<table class="post-list" post-id="' + data[i].id + '">';
        list_html = list_html + '<tr>';
        list_html = list_html + '<td class="post-left">';
        list_html = list_html + '   <a user-id="' + data[i].create_user + '">';

        list_html = list_html + '       <img src="' + data[i].headIcon + '"/></a>';

        list_html = list_html + '</td>';
        list_html = list_html + '<td class="post-center">';
        list_html = list_html + '    <div class="post-user">';
        list_html = list_html + '        <a user-id="' + data[i].create_user + '"';

        if (data[i].status == -2)
            list_html += ' class="user-disabled"';
        list_html += '>' + data[i].name + '</a>';

        var btn_more_html = '';

        //删除按钮：
        btn_more_html += '<li><a onclick="deleteItem(\'post\',' + data[i].id + ')">删除</a></li>';

        if (btn_more_html != '') {
            list_html += '<div class="btn-group post-bars-other" style="float:right;">'
              + '<button type="button" class="btn btn-white btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
              + '  <i class="fa fa-chevron-down"></i> '
              + '</button>'
              + '<ul class="dropdown-menu pull-right">'
              + btn_more_html
              + '</ul>'
              + '</div>';
        }

        //可见范围
        if (data[i].access_str != "所有人")
            list_html = list_html + '<span class="post-access"><i class="fa fa-eye"></i>&nbsp;' + data[i].access_str + '</span>';

        list_html = list_html + '    </div>';
        list_html = list_html + '    <div class="post-con">';
        var post_con = data[i].content;

        list_html = list_html + '<div class="post-text">' + getUrlOfStr(post_con) + '</div>';

        //动态中插入的链接
        var data_links = data[i].links;
        list_html += '<div class="post-links">';
        for (var j = 0; j < data_links.length; j++) {
            list_html += '<div class="link-item"><a data-site="' + data_links[j].link_site + '"><i class="fa fa-link"></i>&nbsp;' + data_links[j].link_title + '</a></div>';
        }
        list_html += '</div>';

        //今日时光
        if (data[i].timeline == 1) {
            list_html = list_html + '<div class="post-timeline" timeline-user="' + data[i].create_user + '" timeline-username="' + data[i].name + '" timeline-date="' + data[i].create_time.substring(0, 10) + '"><a><i class="fa fa-clock-o"></i>&nbsp;我的今日时光</a></div>';
        }

        /*************************附件预览*********************************/
        var data_attach = data[i].attachments;
        list_html = list_html + '   <div class="attach-view">';

        var html1 = '<div class="file-list">';
        var html2 = '<div class="image-list">';
        for (var j = 0; j < data_attach.length; j++) {
            var fileName = data_attach[j].old_name;
            var filePath = data_attach[j].file_path.replace('~/', '/');
            var fileSize = data_attach[j].file_size;
            var filedata = createAttachItemHtml(fileName, filePath, data_attach[j].file_ext, fileSize, data_attach[j].id, 'postlist', 'post_' + data[i].id);
            if (filedata.type == 'file') {
                html1 = html1 + filedata.html;
            }
            else if (filedata.type == 'image') {
                html2 = html2 + filedata.html;
            }
        }
        html1 = html1 + "</div>";
        html2 = html2 + "</div>";

        list_html = list_html + html1 + html2;

        list_html = list_html + '   </div>';
        list_html = list_html + ' </div>';
        /****************************************************************************/

        list_html = list_html + '    </div>';
        list_html = list_html + '    <div class="post-toolbar"><span class="bars-group">';

        list_html = list_html + '        <a class="btn-comment" title="评论" data-toggle="tooltip" data-placement="bottom"><i class="fa fa-comment"></i>&nbsp;';
        var data_comment = data[i].comments;
        if (data_comment.length > 0) {
            list_html = list_html + '&nbsp;<span><span class="count">' + data_comment.length + '</span></span>';
        }
        list_html = list_html + '</a>';

        //收藏按钮
        var data_favor_users = data[i].favor_users;
        if (data_favor_users.length > 0) {
            var favor_names = '';
            for (var i1 = 0; i1 < data_favor_users.length; i1++) {
                var t_name = data_favor_users[i1].name;
                favor_names = favor_names + (favor_names == '' ? t_name : '、' + t_name);
            }
            var active = "";
            var t_title = "收藏";
            if (("、" + favor_names + "、").indexOf("、" + CurrName + "、") != -1) {
                active = "active";
                t_title = "取消收藏";
            }
            list_html = list_html + '<a class="btn-favor ' + active + '" title="' + t_title + '" data-toggle="tooltip" data-placement="bottom"><i class="fa fa-star"></i>&nbsp;<span data-toggle="tooltip" data-placement="right" title="' + favor_names + ' 收藏过">';
            list_html = list_html + '<span class="count">' + data_favor_users.length + '</span></span></a>';
        }
        else { list_html = list_html + '<a class="btn-favor" title="收藏" data-toggle="tooltip" data-placement="bottom"><i class="fa fa-star"></i>&nbsp;</a>'; }

        //点赞按钮
        var data_like_users = data[i].like_users;
        if (data_like_users.length > 0) {
            var like_names = '';
            for (var i2 = 0; i2 < data_like_users.length; i2++) {
                var t_name = data_like_users[i2].name;
                like_names = like_names + (like_names == '' ? t_name : '、' + t_name);
            }
            var active = "";
            var t_title = "赞";
            if (("、" + like_names + "、").indexOf("、" + CurrName + "、") != -1) {
                active = "active";
                t_title = "取消赞";
            }
            list_html = list_html + '<a class="btn-like ' + active + '" title="' + t_title + '" data-toggle="tooltip" data-placement="bottom"><i class="fa fa-thumbs-up"></i>&nbsp;<span data-toggle="tooltip" data-placement="right" title="' + like_names + ' 赞过">';
            list_html = list_html + '<span class="count">' + data_like_users.length + '</span></span></a>';
        }
        else { list_html = list_html + '<a class="btn-like" title="赞" data-toggle="tooltip" data-placement="bottom"><i class="fa fa-thumbs-up"></i>&nbsp;</a>'; }

        list_html = list_html + '</span><span class="post-time">' + getDateDiff(data[i].create_time) + '</span>';

        list_html = list_html + '</div>';



        list_html = list_html + '   <div class="post-comment"';
        list_html = list_html + ' style="display:none;"';

        list_html = list_html + ' >';
        list_html = list_html + '       <div class="post-comment-add">';
        list_html = list_html + '            <form role="form">';
        list_html = list_html + '                <div class="form-group">';

        var textarea_id = autoId('textarea');

        list_html = list_html + '                    <textarea id="' + textarea_id + '" mention-data="true" class="form-control" rows="1" placeholder="说点什么..."></textarea>';
        list_html = list_html + '                </div>';
        list_html = list_html + '            </form>';

        list_html = list_html + ' <div class="mention-area">';
        list_html = list_html + '         <div class="mention-select">';
        list_html = list_html + '         </div>';
        list_html = list_html + '     </div>';

        list_html = list_html + '            <div class="comment-add-bars">';
        list_html = list_html + '                <a href="javascript:void(0)" class="btn-attach" style="margin: 10px;"><i class="fa fa-paperclip fa-lg" title="附件"></i></a>';
        var facebtn_id = autoId('facebtn');
        list_html = list_html + '                <a id="' + facebtn_id + '" contentId="' + textarea_id + '" href="javascript:void(0)" class="face-btn" style="margin: 10px;"><i class="fa fa-meh-o fa-lg" title="表情"></i></a>';
        list_html = list_html + '                <button class="btn btn-primary btn-xs" style="float: right;">发表</button>';
        list_html = list_html + '            </div>';

        /************************附件框***********************/
        uploadify_id = autoId('uploadify');
        list_html = list_html + ' <div class="attach-area" style="display:none">';
        list_html = list_html + '   <div id="fileQueue">';
        list_html = list_html + '   </div>';
        list_html = list_html + '   <input type="file" name="uploadifive" id="' + uploadify_id + '" />';
        list_html = list_html + '   <div class="attach-view"><div class="file-list"></div><div class="image-list"></div></div>';
        list_html = list_html + '       </div>';
        /*******************************************************/

        /************************加载评论************************/
        list_html = list_html + '       <div class="post-comment-list">';
        var html_comment = creatPostCommentListHtml(data_comment);
        list_html = list_html + html_comment;
        /*******************************************************/
        list_html = list_html + '       </div>';
        list_html = list_html + '   </div>';
        list_html = list_html + '   </div>';


        var can_edit_tags = '', cannot_edit_tags = '';

        //编辑标签
        var tags = data[i].tags;
        var is_tag_user = (CurrUser == data[i].create_user ? 1 : 0);
        if (is_tag_user) {

            can_edit_tags = can_edit_tags + '<form role="form">';

            var textarea_tag_id = autoId('textarea_tag');
            var value_str = '';

            for (var j = 0; j < tags.length; j++) {
                var str1 = tags[j].name;
                if (tags[j].create_user == 0)
                    cannot_edit_tags += '<span tag-id="' + tags[j].id + '" class="label label-xm">' + str1 + '</span>';
                else {
                    value_str += (value_str == "" ? str1 : "," + str1);
                }
            }

            can_edit_tags += '<div class="form-group form-group-sm"><input id="' + textarea_tag_id + '" data-token="' + i.toString() + '" value="' + value_str + '"  class="form-control" name="tag"';
            can_edit_tags += 'placeholder = "编辑标签"';

            can_edit_tags += '/>';
            can_edit_tags += '</div></form>';
        }            //编辑标签end            
        else {      /************************加载标签************************/
            for (var j = 0; j < tags.length; j++) {
                var tag_class = "label-info";
                if (tags[j].create_user == 0) tag_class = "label-xm";
                cannot_edit_tags += '<span tag-id="' + tags[j].id + '" class="label ' + tag_class + '">' + tags[j].name + '</span>';
            }
        }


        var tag_div_id = "tag_div_" + data[i].id;
        list_html += '<table class="post-tag-area"><tr>';
        list_html += '<td><div class="post-tag" id="' + tag_div_id + '">';
        list_html += cannot_edit_tags;
        list_html += '</td></div>';

        list_html += '<td><div class="post-tag-edit">';
        list_html += can_edit_tags;
        list_html += '</td></div>';
        list_html += '</tr></table>';

        /*******************************************************/

        /************************加载关联项目************************/
        if (data[i].xm_id > 0) {
            list_html = list_html + '   <div class="post-xm">';
            list_html += '<a xm-id="' + data[i].xm_id + '"><i class="fa fa-cubes"></i>&nbsp;' + data[i].xm_title + '</a>';
            list_html = list_html + '   </div>';
        }

        /*******************************************************/

        list_html = list_html + '</td>';
        list_html = list_html + '</tr>';
        list_html = list_html + '</table>';

        if (isTop && isTop == 1) {
        }
        else {
            list_html = list_html + '<hr />';
        }
    }

    return list_html;
}


//加载个人信息，在tooltip里显示
function loadUserInfoToTooltip(user_id, $elem) {
    $.ajax({
        url: 'AjaxHandle/OAHandler.ashx?method=getUserDetail&id=' + user_id,
        success: function (re) {
            var data = [];
            if (re != "")
                data = $.parseJSON(re);
            var html = '<table class="user-info">';
            html += '<tr>';
            if (data.length > 0) {
                html += '<td class="photo">';
                html += '<img src="' + data[0].headIcon + '"/>';
                html += '</td>';
                html += '<td class="detail">';
                html += '<div class="name">' + data[0].Name + '</div>';
                html += '<div class="job">' + data[0].department + ' - ' + data[0].position + '</div>';
                html += '<div class="phone"><i class="fa fa-mobile fa-lg"></i>&nbsp;' + data[0].mobile + '</div>';
                html += '<div class="phone"><i class="fa fa-envelope"></i>&nbsp;' + data[0].email + '</div>';
                html += '</td>';
            } else {
                html += '<td><center>该用户不存在！</center></td>';
            }
            html += '</tr>';
            html += '</table>';

            $elem.tipso({
                useTitle: false,
                width: 250,
                content: html,
                color: '#666'
            });
        }
    })
}

//加载mention框人员/标签列表
function loadMentionList(type, obj_mention) {
    if (type == "user") { //@ 人员/用户组
        var url = "AjaxHandle/OAHandler.ashx?method=getUserAtList";
        $.ajax({
            url: url,
            success: function (re) {
                var data = $.parseJSON(re);
                var html_all = '';
                html_all += '<div class="mention-header">';
                html_all += '<div class="btn-group" data-toggle="buttons">';
                html_all += '<label class="btn active"><input type="radio" name="options" autocomplete="off" value="user" checked />人员</label>';
                html_all += '<label class="btn"><input type="radio" name="options" autocomplete="off" value="group" />用户组</label>';
                html_all += '</div></div>';
                html_all += '<div class="mention-body">';
                var html1 = '<table data-type="user">';
                var html2 = '<table data-type="group" style="display:none">';
                for (var i = 0; i < data.length; i++) {
                    var html = '<tr user-id="' + data[i].UserId + '" mention-type="user">';

                    var headIcon = 'Images/logo.gif';
                    if (data[i].headIcon && data[i].headIcon != '')
                        headIcon = data[i].headIcon;
                    html = html + '   <td class="user-photo"><img src="' + headIcon + '" /></td>';
                    html = html + '   <td class="user-name">' + data[i].Name + '</td>';
                    html = html + '<td class="user-job">' + data[i].position + '</td>';
                    html = html + '</tr>';

                    if (data[i].type == 'user')
                        html1 += html;
                    else
                        html2 += html;
                }
                html1 += '</table>';
                html2 += '</table>';

                html_all += html1 + html2 + '</div>';

                if (data.length == 0) obj_mention.hide();
                else {
                    obj_mention.html(html_all);
                    $('table[data-type="user"] tr:first', obj_mention).addClass('active');
                    if (obj_mention.css('display') == 'none') obj_mention.show();
                }
            }
        });
    }
    else if (type == "tag") {   //# 标签
        var url = "AjaxHandle/OAHandler.ashx?method=GetTagList";
        $.ajax({
            url: url,
            success: function (re) {
                var data = $.parseJSON(re);
                var html = '<table>';

                for (var i = 0; i < data.length; i++) {
                    html = html + '<tr mention-type="tag"';
                    if (i == 0) html = html + ' class="active"';
                    html = html + '>';
                    html = html + '   <td class="user-name">' + data[i].name + '</td>';
                    html = html + '</tr>';
                }
                html = html + '</table>';
                if (data.length == 0) obj_mention.hide();
                else {
                    obj_mention.html(html);
                    if (obj_mention.css('display') == 'none')
                        obj_mention.show();
                }
            }
        });
    }
}


/*********************TextArea 光标位置相关处理  start*******************************/

//获取光标位置
function getPosition(textarea) {
    var rangeData = { text: "", start: 0, end: 0 };
    if (textarea.setSelectionRange) { // W3C	
        textarea.focus();
        rangeData.start = textarea.selectionStart;
        rangeData.end = textarea.selectionEnd;
        //rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
        rangeData.text = textarea.value.substring(0, rangeData.start);
    } else if (document.selection) { // IE
        textarea.focus();
        var i,
            oS = document.selection.createRange(),
            // Don't: oR = textarea.createTextRange()
            oR = document.body.createTextRange();
        oR.moveToElementText(textarea);

        rangeData.text = oS.text;
        rangeData.bookmark = oS.getBookmark();

        // object.moveStart(sUnit [, iCount]) 
        // Return Value: Integer that returns the number of units moved.
        for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
            if (textarea.value.charAt(i) == '\r') {
                i++;
            }
        }
        rangeData.start = i;
        rangeData.end = rangeData.text.length + rangeData.start;
        rangeData.text = textarea.value.substring(0, i);
    }

    return rangeData;
}

//设置光标位置
function setPosition(textarea, rangeData) {
    if (!rangeData) {
        return;
    }
    textarea.focus();
    if (textarea.setSelectionRange) { // W3C
        textarea.setSelectionRange(rangeData.start, rangeData.end);
    } else if (textarea.createTextRange) { // IE
        var oR = textarea.createTextRange();
        if (textarea.value.length === rangeData.start) {
            oR.collapse(false)
            oR.select();
        } else {
            oR.moveToBookmark(rangeData.bookmark);
            oR.select();
        }
    }
}

//从上一次位置插入文字，并设置新的光标位置
function addTextToPosition(textarea, rangeData, text, leng) {
    setPosition(textarea, rangeData);
    textarea.value = text;
    if (textarea.setSelectionRange) { // W3C
        var st = textarea.scrollTop;
        if (textarea.scrollTop != st) {
            textarea.scrollTop = st;
        }
        textarea.setSelectionRange(rangeData.start + leng, rangeData.start + leng);
    }
    else if (textarea.createTextRange) { // IE
        sR = textarea.createTextRange();
        sR.move("character", rangeData.start + leng);
        sR.select();
    }
}
/*********************TextArea 光标位置相关处理   end*******************************/

//计算时间差，让发布时间更人性化地显示
//dateStr 格式：yyyy-MM-dd HH:mm 或 yyyy/MM/dd HH:mm 
function getDateDiff(dateStr) {
    var t_strs = dateStr.split('-');
    var t_year = t_strs[0];
    var t_mon = t_strs[1];
    var t_strs2 = t_strs[2].split(' ');
    var t_day = t_strs2[0];
    var t_time = t_strs2[1];

    var date_now = new Date();

    var dateTimeStamp = Date.parse(dateStr.replace(/-/gi, "/"));
    var nowTimeStamp = date_now.getTime();
    var diffValue = nowTimeStamp - dateTimeStamp;

    var dateTimeStamp2 = new Date(dateStr.replace(/-/gi, "/").substr(0, 10));
    var nowTimeStamp2 = new Date(date_now.getFullYear() + '/' + (date_now.getMonth() + 1) + '/' + date_now.getDate());
    var diffValue2 = nowTimeStamp2 - dateTimeStamp2;

    var n_minute = 1000 * 60;
    var n_hour = n_minute * 60;
    var n_day = n_hour * 24;
    var n_month = n_day * 30;

    var monthC = diffValue / n_month;
    var dayC = diffValue / n_day;
    var hourC = diffValue / n_hour;
    var minC = diffValue / n_minute;

    dayC2 = diffValue2 / n_day;

    var result = '';
    //if (monthC >= 12) {
    //    result = t_year + '年' + parseInt(t_mon) + '月' + parseInt(t_day) + '日 ' + t_time;
    //}
    //else if (dayC2 > 2) {
    //    result = parseInt(t_mon) + '月' + parseInt(t_day) + '日 ' + t_time;
    //}
    //else if (hourC >= 24) {
    //    if (dayC2 > 1) result = '前天 ' + t_time;
    //    else result = '昨天 ' + t_time;
    //}
    //else if (hourC >= 1) {
    //    result = parseInt(hourC) + "小时前";
    //}
    //else if (minC >= 1) {
    //    result = parseInt(minC) + "分钟前";
    //} else
    //    result = "刚刚";

    //根据微易智能需求修改 2015-07-01
    if (monthC >= 12) {
        result = t_year + '年' + parseInt(t_mon) + '月' + parseInt(t_day) + '日 ' + t_time;
    }
    else {
        result = parseInt(t_mon) + '月' + parseInt(t_day) + '日 ' + t_time;
    }

    return result;
}

//识别字符串中的链接，替换成a标签
function getUrlOfStr(str_url) {
    var res = str_url.replace(/(https|http)?:\/\/([\w-]+(\.[\w-]+)+((:[0-9]+)?\/[\w-     .\/\?%&=[0-9a-zA-Z_!~*'().;:@+$,#-]+]*)?)?/, function (ss) {
        return '<a onclick="javascript:window.open($(this).html());">' + ss + '</a> ';
    });

    return res;
}

