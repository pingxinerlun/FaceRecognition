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

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//表情插件初始化
function initFacearea(facebtn, faceNum) {
    var e = $('.' + facebtn);
    var contentId = e.attr('contentId');
    var id = autoId('facebox');
    e.qqFace({
        id: id,
        assign: contentId,
        path: 'images/faces/',
        faceNum: faceNum//显示的表情数量        
    });
}

//表情文字标识替换成对应图片
function replace_em(str) {
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/images/faces/$1.gif" border="0" />');
    return str;
}

//点击显示动画效果
function Animation1(event, text, container) {
    var $i = $("<b>").text(text);
    var x = event.pageX, y = event.pageY;
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
