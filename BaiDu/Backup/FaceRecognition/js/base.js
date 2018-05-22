
/*提醒 提醒弹窗*/
function alertNew(content, time) {
    $("#openDiv").empty();
    var html_div = "<div class=\"al_box\">" + content + "</div>";
    $("#openDiv").append(html_div);
    var totH = document.documentElement.clientHeight;
    var totW = document.documentElement.clientWidth;
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var aleT = (totH - $(".al_box").height() - 20) / 2;
    var aleL = (totW - $(".al_box").width() - 20) / 2;
    $(".al_box").css('top', aleT + logTop + "px");
    $(".al_box").css('left', aleL + "px");
    if (time == 0) {
        return false;
    } else if (time == "" || time == "underfind" || time == null) {
        setTimeout('$(".al_box").remove()', 2000);
    } else {
        setTimeout('$(".al_box").remove()', time * 1000);
    }
    return false;
}

function alertNewForGH(content) {
    $("#AlertDiv").empty();
    var html_div = "<div class=\"al_box\">" + content + "</div>";
    $("#AlertDiv").append(html_div);
    $("#AlertDiv").show();
    SetLocateal();
    setTimeout('$(".al_box").remove()', 2000);
    return false;
}
/*提醒 提醒弹窗*/
function alertTwoNew(content, time) {
    $("#messDiv").empty();
    var html_div = "<div class=\"al_box\">" + content + "</div>";
    $("#messDiv").append(html_div);
    var totH = document.documentElement.clientHeight;
    var totW = document.documentElement.clientWidth;
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var aleT = (totH - $(".al_box").height() - 20) / 2;
    var aleL = (totW - $(".al_box").width() - 20) / 2;
    $(".al_box").css('top', aleT + logTop + "px");
    $(".al_box").css('left', aleL + "px");
    if (time == 0) {
        return false;
    } else if (time == "" || time == "underfind" || time == null) {
        setTimeout('$(".al_box").remove()', 2000);
    } else {
        setTimeout('$(".al_box").remove()', time * 1000);
    }
    return false;
}
/* 加载弹窗 */
function alertLoad(content) {
    $("#openDiv").empty();
    var html_div = "<div class=\"load_box\" style=\"text-align:center;\"><p><img src=\"http://www.gui120.com/weixinapp/images/uploading.gif\" style=\"padding-bottom:5px;\"></p><p>" + content + "</p></div><div class=\"al_screen\"></div>";
    $("#openDiv").append(html_div);
    var totH = document.documentElement.clientHeight;
    var totW = document.documentElement.clientWidth;
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var aleT = (totH - $(".load_box").height() - 36) / 2;
    var aleL = (totW - $(".load_box").width() - 80) / 2;
    $(".load_box").css('top', aleT + logTop + "px");
    $(".load_box").css('left', aleL + "px");
    return false;
}

/* 加载弹窗 */
function alertLoadOther(content) {
    $("#AlertDiv").empty();
    var html_div = "<div class=\"load_box\" style=\"text-align:center;\"><p><img src=\"http://www.gui120.com/weixinapp/images/uploading.gif\" style=\"padding-bottom:5px;\"></p><p>" + content + "</p></div><div class=\"al_screen\"></div>";
    $("#AlertDiv").append(html_div);
    $("#AlertDiv").show();
    SetLocate();
    return false;
}

/*关闭弹出窗*/
function alertClose() {
    $(".load_box").remove();
    $(".al_screen").remove();
    $(".al_box").remove();
}

/*lab切换*/
function setTab(name, cursel, n) {
    for (i = 1; i <= n; i++) {
        var memu = document.getElementById(name + i)
        var con = document.getElementById('con_' + name + '_' + i)
        memu.className = i == cursel ? "hit" : "";
        con.style.display = i == cursel ? "block" : "none";
    }
}

//公用弹窗
function detailPop() {
    $("#openDiv").empty();
    var html_div = "<div class=\"pop_screen\"></div>";
    html_div += "<div class=\"pop_box\">";
    html_div += "<div id=\"pophtml\"></div>";
    html_div += "<div class=\"forcsswrong\"></div>";
    html_div += "<div class=\"popmess\"><a href=\"javascript:\" class=\"popbtn\" id=\"pop_sure\"></a></div>";
    html_div += "</div>";
    $("#openDiv").append(html_div);
}

function ShowDialog(strhtml, btnV) {
    detailPop();
    $("#pophtml").html(strhtml);
    $("#pop_sure").html(btnV);

    //定位
    var popH = $(document).height();
    var winH = $(window).height();
    var boxH = $(".pop_box").height();
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var marT = winH - boxH - 20;
    if (marT > 0) {
        $(".pop_box").css('top', marT / 2 + logTop + "px");
    } else {
        $(".pop_box").css('top', logTop + 50 + "px");
    }
    $(".pop_screen").css('height', popH + "px");

    $("#cancle").click(function () {
        $("#openDiv").empty();
    });
}
/*公用确认弹窗*/
function conformPop() {
    $("#openDiv").empty();
    var html_div = "<div class=\"pop_screen\"></div>";
    html_div += "<div class=\"conf_box\">";
    html_div += "<div class=\"conftitle\" id=\"conftitle\"></div>";
    html_div += "<div class=\"confcontent\" id=\"pophtml\"></div>";
    html_div += "	<div class=\"forcsswrong\"></div>";
    html_div += "<div class=\"confbtn\" id=\"onebtn\"><a href=\"javascript:\" class=\"onebtn\" id=\"surebtn\"></a></div><div class=\"confbtn\" id=\"twobtn\"><a href=\"javascript:\" class=\"twobtn confbor\" id=\"canclebtn\"></a><a href=\"javascript:\" class=\"twobtn\" id=\"surebtn\"></a></div>";
    html_div += "</div></div>";
    $("#openDiv").append(html_div);
}

function ConfDialog(title, strhtml, btnV) {
    conformPop();
    $("#conftitle").html(title);
    $("#pophtml").html(strhtml);
    btnV = btnV.split(",");
    var btnVL = btnV.length;
    if (btnVL == '2') {
        $("#twobtn").find("a:eq(0)").html(btnV[0])
        $("#twobtn").find("a:eq(1)").html(btnV[1])
        $("#onebtn").remove();
    } else {
        $("#onebtn").find("a").html(btnV[0])
        $("#twobtn").remove();
    }

    //定位
    var popH = $(document).height();
    var winH = $(window).height();
    var boxH = $(".conf_box").height();
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var marT = winH - boxH;
    if (marT > 0) {
        $(".conf_box").css('top', marT / 2 + logTop + "px");
    } else {
        $(".conf_box").css('top', logTop + 50 + "px");
    }
    $(".pop_screen").css('height', popH + "px");

    $("#canclebtn").click(function () {
        $("#openDiv").empty();
    });
}

//定位
function SetLocate() {
    var totH = document.documentElement.clientHeight;
    var totW = document.documentElement.clientWidth;
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var aleT = (totH - $(".load_box").height() - 36) / 2;
    var aleL = (totW - $(".load_box").width() - 80) / 2;
    $(".load_box").css('top', aleT + logTop + "px");
    $(".load_box").css('left', aleL + "px");
}

//定位
function SetLocateal() {
    var totH = document.documentElement.clientHeight;
    var totW = document.documentElement.clientWidth;
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var aleT = (totH - $(".al_box").height() - 20) / 2;
    var aleL = (totW - $(".al_box").width() - 20) / 2;
    $(".al_box").css('top', aleT + logTop + "px");
    $(".al_box").css('left', aleL + "px");
}


//弹出框的定位
function SetLocateal2(boxclass) {
    //定位
    var popH = $(document).height();
    var winH = $(window).height();
    var boxH = $('.' + boxclass).height();
    var logTop = document.documentElement.scrollTop + document.body.scrollTop;
    var marT = winH - boxH;
    if (marT > 0) {
        $('.' + boxclass).css('top', marT / 2 + logTop + "px");
    } else {
        $('.' + boxclass).css('top', logTop + 50 + "px");
    }
    $(".pop_screen").css('height', popH + "px");
}

//刷新弹出窗
function searchReload() {
    var strhtml = "网络繁忙，请稍后重试！"
    ConfDialog("", strhtml, "点击刷新");
    $("#surebtn").click(function () {
        window.location.reload();
    });
}

//根据URL和追加参数获取路径(追加平台类型、来源类型、来源id)
//additionalParam:追加的参数,urlStr:url地址
function GetUrlByAddParam(additionalParam, urlStr) {
    if ($.trim(urlStr).length == 0) { return ""; }
    if (urlStr.indexOf("platformType=") > -1) {
        var beIndex = urlStr.indexOf("platformType=");  //追加参数的起始位置
        var endIndex = urlStr.indexOf("sourceId=");     //追加参数的结束位置
        var endStr = urlStr.substring(endIndex);     //截取最后的字符串

        //获取追加参数结束位置
        if (endStr.indexOf("&") > -1) {
            endIndex = endIndex + endStr.indexOf('&');
        }
        else {
            endIndex = endIndex + endStr.length;
        }

        var nowAdditionalParam = urlStr.substr(beIndex, endIndex - beIndex);    //当前追加的参数

        urlStr = urlStr.replace(nowAdditionalParam, additionalParam);    //替换久参数
    }
    else {
        if (urlStr.indexOf("?") > -1) {
            urlStr = urlStr + '&' + additionalParam;
        }
        else {
            urlStr = urlStr + '?' + additionalParam;
        }
    }
    return urlStr;
}

//移动已经加载过的js/css
function RemoveJsCssFile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
    }
}
////使用示例：
//removejscssfile("somescript.js", "js");
//removejscssfile("somestyle.css", "css");