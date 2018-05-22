function load_mission(xm_id) {
    var table = $("#groups2");

    var load_id = autoId('loading');
    var loadHtml = '<div id="' + load_id + '" style="text-align:center;padding:15px;"><img src="Images/loading.gif" /></div>';
    table.html(loadHtml);

    var miss_status = $('#miss_status2 input:checked').val();
    var key = $('#input_key2').val();
    $.ajax({
        url: 'data/missionServer.aspx?method=mission_all',
        cache: false,
        data: { list_type: $('#select_miss_type2').val(), key: key, status: miss_status,xm_id:xm_id },
        success: function (text) {
            $(load_id).remove();
            var data = $.parseJSON(text);
            var len = data.length;

            var str = mission_list_html2(data);
            if (str == '') str = '<div class="no-mission" style="color:#999;border:1px solid #ddd;text-align:center;padding:15px;">无任务.</div>';
            table.empty().html(str);
           
            table.find('a[user-id]').each(function () {
                var e = $(this);
                var user_id = e.attr('user-id');
                if (user_id != '') {
                    loadUserInfoToTooltip(user_id, e)
                }
            });
        },
        error: function (ee) {
            alert('ajax error!');
        }
    });
}

function mission_list_html2(data) {
    var str = '';
    for (var i = 0; i < data.length; i++) {
        str += '<div class="mission-item" miss-id="' + data[i].id + '" miss-status="' + data[i].status + '">';
        str += '<table>';
        str += '<tr>';

        str += '<td class="mission-finish-bar"><a data-toggle="tooltip" data-placement="bottom" title="' + (data[i].status == 1 ? '标记未完成' : '标记完成') + '"><i class="fa';
        if (data[i].status == 1) str += ' fa-check';
        else str += ' fa-circle-thin';
        str += '"></i></a>';
        str += '</td>';

        str += '<td class="mission-title">';
        var res_users = data[i].res_users_info;
        for (var j = 0; j < res_users.length; j++) {
            str = str + '<a class="res-users" user-id="' + res_users[j].id + '"><img src="' + res_users[j].photo1 + '"></a>';
        }

        str += '<span class="title-text">' + data[i].title + '</span>';
        str += '</td>';

        str += '<td class="mission-remind">';//超期提醒
        if (data[i].end_date) {
            var end_date = moment(data[i].end_date).format('YYYY-MM-DD');
            var diff = moment().diff(end_date, 'days');
            if (diff >= 1) str += '<span class="text-danger">超期' + diff + '天</span>';
            else if (diff == 0) str += '<span class="text-warning">今天到期</span>';
            else if (diff >= -7) str += '<span class="text-warning">剩余' + (-diff) + '天</span>';
            else str += '<span class="text-info">' + end_date + '到期</span>';

        }
        str += '</td>';

        str += '</tr>';
        str += '</table>';
        str += '</div>';
    }
    return str;

}