$(".input-daterange").datepicker({ keyboardNavigation: !1, forceParse: !1, autoclose: !0 });
$("#beginTime").datepicker({ keyboardNavigation: !1, forceParse: !1, autoclose: !0 });
$("#endTime").datepicker({ keyboardNavigation: !1, forceParse: !1, autoclose: !0 });


$(function () {
    $(".arg2 span").on("click", function () {
        var val = $(this).attr("data-val");
        if ($(this).parent().hasClass("active")) return;
        $(this).parent().addClass("active").siblings().removeClass("active");
        $(".arg_status option").each(function () {
            if ($(this).val() == val) {
                $(this).attr("selected", "selected");
                return
            }
            $(this).removeAttr("selected")
        });
        createDom();
    });
    $(document).on("click", ".use-record", function () {
        var opid = $(this).parents("tr").attr("data-id");
        get_op(opid);
    }).on("click", ".btn-return", function () {
        var orderN = $.trim($(this).parents("tr").find(".order-bar ").attr("data-ordern"));
        $("#back .modal-body span").text(orderN);
    }).on("click", ".pagination li", function () {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active").siblings().removeClass("active");
            createDom("page");
        }
    }).on("click", ".transport-ok", function () {
        set_ship();
    }).on("click", ".check-info", function () {
        $("#orderN").val($.trim($(this).parents("tr").find(".order-bar").attr("data-ordern")));
        $(this).attr("id", "checking");
    }).on("click", ".btn-close", function () {
        var orderN = $(this).parents("tr").find(".order-bar ").attr("data-ordern");
        var orderi = $.trim($(this).parents("tr").attr("data-id"));
        $("#use-close .modal-body span").text(orderN);
        $("#use-close .modal-body label").text(orderi);
    })
    $("#use-record").on("hide.bs.modal", function () {
        $(this).find(".modal-body").html("<p class='loading'></p>")
    });
    $(".back-ok").on("click", function () {
        var orderN = $("#back .modal-body span").text();
        set_backmoney(orderN);
    });
    $(".close-ok").on("click", function () {
        var orderi = $("#use-close .modal-body label").text();
        var orderN = $("#use-close .modal-body span").text();
        close_order(orderi, orderN);
    });
    $("#transport").on("hide.bs.modal", function () {
        $("#orderN").val("");
        $("#transportCom").val("");
        $("#transportOrder").val("");
        $("#checking").removeAttr("id");
    })
});
//需要添加查询等待的旋圈圈那个 *—_—*
function btn_() {
    $(".arg2 span").each(function () {
        if ($(this).attr("data-val") == $(".arg_status").val()) {
            $(this).parent().addClass("active");
            return
        }
        $(this).parent().removeClass("active");
    })
    createDom();
}




//数据查询交互
function createDom(flag) {
    $("#labMessage").text("");
    if ($("#begindate").val() != "") {
        if (IsDate("下单时间", $("#begindate").val()) == false) { alert("请保证下单时间中输入的日期格式为yyyy-mm-dd或正确的日期!"); return; }
    }
    if ($("#enddate").val() != "") {
        if (IsDate("下单时间", $("#enddate").val()) == false) { alert("请保证下单时间中输入的日期格式为yyyy-mm-dd或正确的日期!"); return; }
    }
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: get_data("0"),
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        beforeSend: function () {
            $("#t_content").html("<tr><td class='text-center text-danger'  colspan='6'><p class='loading'></p></td><tr>");
        },
        success: function (data) {
            /*
            {ResultState: "0", ResultContent: "",ResultStatusCount:"", ResultMsg: "No Data", ResultCount: "0"}
            ResultState --- 1:成功 0：失败 
            ResultContent -- 当ResultState=1 时 有数据为数组可以有多组 如下：
            [
                {
                    "order_n": "M20160924195027335128",               //订单号
                    "order_i": "123",                                 //订单标识
                    "order_time": "2016-09-12 15:45:18.000",          //下单时间
                    "sp_name": "移动宽带维护专家-中移商城(手机专区)", //店铺名
                    "pd_name": "iPhone 7",                            //商品名
                    "pd_img":"http://jxsc.untra.cn/Birthday/Agency/UpdateImg/GoodsImg/2016/10/10/file_691268249318166.jpg"
                    "sp_gg": "金色 32G金色  数量：1价格：5288",       //商品规格  
                    "sp_to": "NULL",                                  //收货人
                    "sp_phone": "NULL",                               //收货人电话
                    "sp_add": "NULL",                                 //收货人地址
                    "order_status": "订单关闭",                       //订单状态
                    "org": "两江",                                    //分公司
                    "ser_man": "吴先宽"                               //装维人员
                    "sp_order": "2134sdf234"                          //物流单号
                    "sp_info": "正在发往重庆转运中心，下一站"         //最新一条物流信息
                },...
            ]
            无数据时为""

            ResultStatusCount 查询各状态有多少 只有一组数组
             [
                {
                    "qb": "2",                                          //全部订单
                    "dfk": "0",                                         //待付款
                    "dfh": "0",                                         //待发货
                    "dsh": "0",                                         //待收货
                    "sqtk": "0",                                        //申请退款
                    "tkz": "0",                                         //退款中
                    "ytk": "0",                                         //已退款
                    "dpj": "0",                                         //待评价
                    "cg_ypj": "2",                                      //成功已评价
                    "guanbi": "28",                                     //关闭
                    "shouhou": "0",                                     //售后
                    "w_wancheng": "0"                                   //未完成
                }
            ]

            ResultMsg --- 当：ResultState=0 时 表示 返回备注 如："No Data" 表示：无数据
            ResultCount --- 表示 返回有多少--页--数据
            */
            $(".arg2 span").each(function () {
                $(this).find(".org-text").text(data.ResultStatusCount[0][$(this).attr("id")])
            });
            if (data.ResultState != 1) {
                $("#t_content").html("<tr><td class='text-center text-danger'  colspan='6'><h2>无数据</h2></td><tr>");
                $(".pagination").html("");
                return;
            }
            var HTML = '';
            for (var i = 0, len = data.ResultContent.length; i < len; i++) {
                if (data.ResultContent[i].order_status == '待收货' || data.ResultContent[i].order_status == '待评价(已收货,完成订单)' || data.ResultContent[i].order_status == '已评价') {
                    var btn = '<font >单号：' + data.ResultContent[i].sp_order + '<br/></font><a href="http://jxsc.untra.cn/Birthday/Agency/Agent/ExpressDetail.aspx?OrderId=' + data.ResultContent[i].order_i + '&ShipOrderNumber=' + data.ResultContent[i].order_n + '" title="' + data.ResultContent[i].sp_info + '" class="text-info" onmousemove="get_ship(this,' + data.ResultContent[i].sp_order + ')" >查看物流信息</a>'
                } else if (data.ResultContent[i].order_status == '待发货') {
                    var btn = '<a data-target="#transport" data-toggle="modal" class="text-info check-info">添加物流信息</a>'
                }
                else {
                    var btn = "操作已关闭";
                }
                if (data.ResultContent[i].order_status == '待发货' || data.ResultContent[i].order_status == '待收货' || data.ResultContent[i].order_status == '待评价(已收货,完成订单)' || data.ResultContent[i].order_status == '已评价' || data.ResultContent[i].order_status == '申请售后' || data.ResultContent[i].order_status == '申请退款' || data.ResultContent[i].order_status == '退款申请(装维工已确认)') {
                    var btn_money = "<button type='button' data-target='#back' data-toggle='modal' class='btn btn-danger btn-return'>确认退款</button>";
                } else if (data.ResultContent[i].order_status == '待付款') {
                    var btn_money = "<button type='button' data-target='#use-close' data-toggle='modal' class='btn btn-danger btn-close'>关闭订单</button>";
                }
                else {
                    var btn_money = "暂无可操作";
                }
                //2, 3, 4, 5, 6, 7, 17
                HTML += '<tr id="a_' + data.ResultContent[i].order_i + '" data-id="' + data.ResultContent[i].order_i + '"><td><center><img src="' + data.ResultContent[i].pd_img + '" /><div class="inline text-left"><p class="text-info nowarp">' + data.ResultContent[i].pd_name + '</p>' +
                    '<p class="text-primary">' + data.ResultContent[i].sp_gg + '</p></div></center></td><td><center><div><p class="row"><span class="pull-left">' + data.ResultContent[i].sp_to + '</span><span class="pull-right">' + data.ResultContent[i].sp_phone + '</span></p>' +
                    '<p class="text-left">' + data.ResultContent[i].sp_add + '</p></div></center></td><td><center><span class="text-danger">' + data.ResultContent[i].order_status + '</span></center></td><td><center>' + btn + '</center></td><td><center><div>' +
                    '<p>分公司：' + data.ResultContent[i].org + '</p><p>装维工：' + data.ResultContent[i].ser_man + '</p> </div></center></td><td><center>' +
                    '' + btn_money + '</center></td><td class="order-bar" data-ordern="' + data.ResultContent[i].order_n + '"><ul>' +
                    '<li><span>' + data.ResultContent[i].order_n + '</span> </li><li><span>' + data.ResultContent[i].order_time + '</span></li><li><span>' + data.ResultContent[i].sp_name + '</span></li><li class="link-detail"><a href="http://jxsc.untra.cn/Birthday/Agency/Agent/OrderDetails_Merchant.aspx?Endresult=' + data.ResultContent[i].sp_Endresult + '" title="点击查看">订单详情</a>' +
                    '</li><li class="link-detail"><a class="use-record" data-target="#use-record" data-toggle="modal" title="点击查看">操作记录</a></li></ul></td></tr>'
            }
            $("#t_content").html(HTML);
            if (flag == "page") {
                return;
            }
            var pageHtml = "";
            for (var p = 0; p < data.ResultCount; p++) {
                pageHtml += '<li class="' + (p == 0 ? 'active' : '') + '"><a href="javascript:void(0)">' + (p + 1) + '</a></li>';
            }
            $(".pagination").html(pageHtml);
        },
        error: function (xhr, type, errorThrown) {
            $("#t_content").html("<tr><td class='text-center text-danger'  colspan='6'><h2>程序异常，请稍后再试！</h2></td><tr>");
            return;
        }
    });
}


//导出数据
function btn_excl() {
    $("#labMessage").text("");
    if ($("#begindate").val() != "") {
        if (IsDate("下单时间", $("#begindate").val()) == false) { alert("请保证下单时间中输入的日期格式为yyyy-mm-dd或正确的日期!"); return false; }
    }
    if ($("#enddate").val() != "") {
        if (IsDate("下单时间", $("#enddate").val()) == false) { alert("请保证下单时间中输入的日期格式为yyyy-mm-dd或正确的日期!"); return false; }
    }
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: get_data("1"),
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        success: function (data) {
            //{ResultState: "0", ResultMsg: "FAIL"}
            if (data.ResultState == 1) {
                //$("#hidres").val("1");
                console.log(data);
                return true;
            }
            else {
                alert("没有查询到数据哦！");
                return false
            }
        },
        error: function (xhr, type, errorThrown) {
            alert("程序发生异常，正在处理，请稍后");
        }
    });
}

//获取查询数据
function get_data(type) {
    var a = {
        method: type == "0" ? "GetList" : "GetListExcel",// 固定
        pageIndex: $(".pagination li.active a").text() || "1",//页码动态获取 导出数据时不赋值
        pageSize: "7",//每页所取条数固定，第一次设置后无需在变动 导出数据时不赋值
        order_num: $(".arg_order_id").val(),//订单号
        uphone: $(".arg_phone").val(),//联系电话
        order_status: $(".arg_status").val(),//订单状态
        shiporder_num: $(".arg_exp_num").val(),//快递单号
        pdname: $(".arg_name").val(),//商品名
        stime: $("#begindate").val(),//开始时间
        etime: $("#enddate").val(),//结束时间
        isbit: $(".arg_delete").val(),//用户是否删除订单
    }
    return a;
}

//获取操作记录
function get_op(opid) {
    console.log(opid);
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: { method: "GetOperation", op_id: opid },
        dataType: 'json', //服务器返回json格式数据
        type: 'POST', //HTTP请求类型				
        success: function (data) {
            //{ResultState: "0", ResultContent: "", ResultMsg: "No Data"}
            //ResultState --- 1:成功 0：失败 
            //ResultContent -- 当ResultState=1 时 有数据为数组 如下：
            //[
            //    {
            //        "op_time": "2016-09-12 15:45:18.000",               //操作时间
            //        "op_info": "删除订单",                              //操作动作
            //    },...
            //]
            //无数据时为""

            //ResultMsg --- 当：ResultState=0 时 表示 返回备注 如："No Data" 表示：无数据
            if (data.ResultState == 1) {
                console.log(data);
                $("#use-record .modal-body").html('<p><span class="text-danger">' + data.ResultContent[0].op_time + '</span></p><p>' + data.ResultContent[0].op_info + '</p>');
            }
            else {
                $("#use-record .modal-body").html('<p class="text-center"><span class="text-danger">无记录</span></p>');
            }
        },
        error: function (xhr, type, errorThrown) {

            alert("程序发生异常，正在处理，请稍后");
        }
    });
}


//添加物流信息
function set_ship() {
    var gongsi = $("#transportCom").val().trim()/*物流公司*/, ordernum = $("#orderN").val().trim()/*订单号*/, shipnum = $("#transportOrder").val().trim()/*物流单号*/;
    if (!(gongsi && ordernum && shipnum)) {
        alert("请完善物流信息");
        return;
    }
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: { method: "SetShip", gong_si: gongsi, order_num: ordernum, ship_num: shipnum },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型	
        beforeSend: function () {
            $("#transport .loading").fadeIn(0);
        },
        complete: function () {
            $("#transport .loading").fadeOut(0);
        },
        success: function (data) {
            //{ResultState: "0", ResultMsg: "FAIL"}
            if (data.ResultState == 1) {
                alert("添加成功！");
                $("#checking").parent().html('<font>单号：<br>' + shipnum + '</font><a href="http://jxsc.untra.cn/Birthday/Agency/Agent/ExpressDetail.aspx?OrderId=' + $("#checking").parents("tr").attr("data-id") + '&amp;ShipOrderNumber=' + ordernum + '" title="" class="text-info" onmousemove="get_ship(this,' + ordernum + ')">查看物流信息</a>')
                $("#back").modal('hide');
            }
            else {
                alert("添加失败！请稍后再试！");
            }
        },
        error: function (xhr, type, errorThrown) {
            alert("程序发生异常，正在处理，请稍后");
        }
    });
}


//操作backmoney
function set_backmoney(ordernum_) {
    console.log(ordernum_);
    if (ordernum_ == "") {
        alert("请选择订单！");
        return;
    }
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: { method: "SetBackMoney", order_num: ordernum_, op_type: "确认退款" },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型		
        beforeSend: function () {
            $("#back .loading").fadeIn(0);
        },
        complete: function () {
            $("#back .loading").fadeOut(0);
        },
        success: function (data) {
            //{ResultState: "0", ResultMsg: "FAIL"}
            if (data.ResultState == 1) {
                alert("退款成功！");
                $("#back").modal('hide');
                location.href = "OrderList.aspx";
            }
            else {
                alert("退款失败！请稍后再试！");
            }
        },
        error: function (xhr, type, errorThrown) {
            alert("程序发生异常，正在处理，请稍后");
        }
    });
}

//查询物流信息
function get_ship(this_, shipnum) {
    alert("正在查询....");
    if (shipnum == "") {
        return
    }
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: { method: "GetShip", ship_num: shipnum },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型				
        success: function (data) {
            //{ResultState: "0", ResultMsg: "FAIL"}
            if (data.ResultState == 1) {
                alert(data.ResultMsg);
            }
            else {
                alert("网络繁忙！请稍后再试！");
            }
        },
        error: function (xhr, type, errorThrown) {
            alert("程序发生异常，正在处理，请稍后");
        }
    });
}


//关闭订单
function close_order(orderid, ordernum) {
    if (orderid == "") {
        return
    }
    //var this_tr = $("#t_content").children().find($("tr#a_" + orderid + ""));
    //console.log(this_tr);
    $.ajax("../AjaxHandle/OrderList.ashx", {
        data: { method: "CloseOrder", order_id: orderid, order_num: ordernum },
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型				
        success: function (data) {
            //{ResultState: "0", ResultMsg: "FAIL"}
            if (data.ResultState == 1) {
                alert("关闭订单成功！");
                // this_tr.remove();
                $("#use-close").modal('hide');
                location.href = "OrderList.aspx";
            }
            else {
                alert(data.ResultMsg);
            }
        },
        error: function (xhr, type, errorThrown) {
            alert("程序发生异常，正在处理，请稍后");
        }
    });
}

//清除时间
function btnclear() {
    $("#begindate").val("");
    $("#enddate").val("");
}

function btnclearall() {
    location.href = "OrderList.aspx";
}
//console.log(get_data(0))