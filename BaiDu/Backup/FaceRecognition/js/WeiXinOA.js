var _IE = getIEVersion();
if (_IE && _IE < 10) {
    //window.location.href = '/old_browser.aspx';
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
    var guid = uuid(10,16);
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
function Animation1(event,text,container)
{
    var $i = $("<b>").text(text);
    var x = event.pageX, y = event.pageY;
    $i.css({ top: y - 30, left: x, position: "absolute", color: "#2a6496" });
    container.append($i);
    $i.animate({ top: y - 80, opacity: 0, "font-size": "14px" }, 1500, function () {
        $i.remove();
    });
}

//去掉字符串两端空格

function str_trim(str)
{
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
        location.href = '/data/DownloadServer.aspx?id=' + attach_id;
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
            initUploadify(uploadify_id, textarea_id, getServerUserId());
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
                if (a.html() == "查看全部")
                    $(items[i]).show();
                else
                    $(items[i]).hide();
            }
        }

        if (a.html() == "查看全部") a.html('收起部分');
        else a.html('查看全部');

    })

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
}

//初始化上传插件
function initUploadify(uploadify_id, dropTarget_id,upload_user_id) {
    $("#" + uploadify_id).uploadifive({
        auto: true,
        buttonText: '<span class="fa fa-folder-open"></span>&nbsp;浏览',
        width: '60px',
        height: '22',
        uploadScript: '/AjaxHandle/AttachmentUploadServer.ashx',
        'formData': { 'user_id': upload_user_id },
        uploadLimit: 50,
        multi: true,
        dropTarget: dropTarget_id,
        'removeCompleted': true,
        //'onUpload': function () {
        //},
        'onAddQueueItem': function (file) {
            //debugger;
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
            //debugger;
            $('#modal_alert_warning').find('.modal-title').html('文件“' + file.name + '”上传失败: ' + errorString);
            $('#modal_alert_warning').modal({ show: true });
        },
        'onUploadComplete': function (file, data, response) {

            //debugger;
            $('#' + uploadify_id).uploadifive('cancel', file);
            addUploadedAttach(uploadify_id, data, file);
        },
        'onDrop': function (file, fileDropCount) {
            //debugger;

        }
    });
};

//已上传的附件插入到预览区
function addUploadedAttach(uploadifive_id, data, file) {
    //debugger;
    var fileData = eval('(' + data + ')'); //$.parseJSON(data);
    var attach_id = fileData.attach_id;
    var filePath = fileData.title;
    var fileName = file.name;
    var fileExt = fileName.substring(fileName.lastIndexOf("."), fileName.length);
    var fileSize = fileData.size;

    var data = createAttachItemHtml(fileName, filePath, fileExt, fileSize, attach_id);
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
        $('.img-viewer').boxer({
            labels: {
                close: "关闭",
                count: "/",
                next: "下一个",
                previous: "上一个"
            }
        });
    }
}

//生成附件预览的Html代码
function createAttachItemHtml(fileName, filePath, fileExt, fileSize, attach_id, flag) {
    //debugger;
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
        html = html + '        </table><br/>';
        html = html + '    </div>';

        type = 'file';

    }
    else if (imgExts.indexOf(fileExt) > -1) {
        html = html + '     <div class="file-item" attach-id="' + attach_id + '">';
        html = html + '         <a class="img-viewer" title="' + fileName + '" rel="gallery" href="' + filePath + '"><img src="' + filePath + '" width="100px" /></a>';
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

function addTextToPosition(textarea, rangeData, text,leng) {
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
function getDateDiff(dateStr){
    var t_strs=dateStr.split('-');
    var t_year=t_strs[0];
    var t_mon=t_strs[1];
    var t_strs2=t_strs[2].split(' ');
    var t_day=t_strs2[0];
    var t_time=t_strs2[1];

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

    var monthC =diffValue/n_month;
    var dayC =diffValue/n_day;
    var hourC =diffValue/n_hour;
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

