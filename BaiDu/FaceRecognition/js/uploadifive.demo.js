$(function () {
    //上传插件
    $('[name="uploadifive"]').each(function () {
        initUploadifive($(this));
    });


    //上传插件
    $('[name="uploadifiveSingle"]').each(function () {
        initUploadifiveSingle($(this));
    });

    //上传
    $('[name="uploadifiveAtta"]').each(function () {
        initUploadifiveAtta($(this));
    });

    //删除附件
    $(document).on('click', '.attach-name a.delete', function () {
        var atta = $(this).parent();
        //询问框

        var index = layer.confirm('确定删除当前附件？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            layer.close(index);
            atta.remove();
        }, function () {
        });

    });

});

//允许上传多文件
function initUploadifive(ctrl) {
    var ctrl_p = ctrl.parent();
    ctrl.uploadifive({
        auto: true,
        buttonText: '<span class="fa fa-folder-open"></span>&nbsp;浏览',
        width: '60px',
        height: '22',
        uploadScript: 'AjaxHandle/UploadifiveUploadServer.ashx',
        formData: {},
        uploadLimit: 50,
        multi: true,
        dropTarget: ctrl_p.attr('id'),
        'removeCompleted': true,
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            //debugger;
            alert('上传失败');
        },
        'onUploadComplete': function (file, data, response) {
            //debugger;
            var json = eval('(' + data + ')');
            ctrl.uploadifive('cancel', file);
            if (json.code == "200") {
                var span = '<div class="file_item" data-id="' + json.id + '" data-path="' + json.file_path + '"><i class="fa fa-file-o"></i>&nbsp;' + file.name + '&nbsp;&nbsp;<a href="/AttaDownLoad.aspx?p=' + escape(json.file_path) + '">[下载]</a>&nbsp;&nbsp;<a href="/AttaView.aspx?p=' + escape(json.file_path) + '" target="_blank">[查看]</a>&nbsp;&nbsp;<a href="javascript:void(0);" class="delete">[删除]</a></div>';
                ctrl_p.find('div.attach-name').append(span);
            }
        }
    });
}

//允许上传单文件
function initUploadifiveSingle(ctrl) {
    var ctrl_p = ctrl.parent();
    ctrl.uploadifive({
        auto: true,
        buttonText: '<span class="fa fa-folder-open"></span>&nbsp;浏览',
        width: '60px',
        height: '22',
        uploadScript: 'AjaxHandle/UploadifiveUploadServer.ashx',
        formData: {},
        uploadLimit: 50,
        multi: false,
        dropTarget: ctrl_p.attr('id'),
        'removeCompleted': true,
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            //debugger;
            alert('上传失败');
        },
        'onUploadComplete': function (file, data, response) {
            //debugger;
            var json = eval('(' + data + ')');
            ctrl.uploadifive('cancel', file);
            if (json.code == "200") {
                var span = '<div class="file_item" data-id="' + json.id + '" data-path="' + json.file_path + '"><i class="fa fa-file-o"></i>&nbsp;' + file.name + '&nbsp;&nbsp;<a href="/AttaDownLoad.aspx?p=' + escape(json.file_path) + '">[下载]</a>&nbsp;&nbsp;<a href="/AttaView.aspx?p=' + escape(json.file_path) + '" target="_blank">[查看]</a>&nbsp;&nbsp;<a href="javascript:void(0);" class="delete">[删除]</a></div>';
                ctrl_p.find('div.attach-name').html(span);
            }
        }
    });
}

//直接上传刷新列表
function initUploadifiveAtta(ctrl) {
    var ctrl_p = ctrl.parent();
    ctrl.uploadifive({
        auto: true,
        buttonText: '<span class="fa fa-folder-open"></span>&nbsp;选择文件',
        width: '80px',
        height: '22',
        uploadScript: 'AjaxHandle/UploadifiveUploadServer.ashx',
        formData: {},
        uploadLimit: 50,
        multi: true,
        dropTarget: ctrl_p.attr('id'),
        'removeCompleted': true,
        'onUploadError': function (file, errorCode, errorMsg, errorString) {
            layer.msg('上传失败！', { icon: 1 });
        },
        'onUploadComplete': function (file, data, response) {
            
            var json = eval('(' + data + ')');
            ctrl.uploadifive('cancel', file);
            if (json.code == "200") {
                location.reload();
            }
        }
    });
}

