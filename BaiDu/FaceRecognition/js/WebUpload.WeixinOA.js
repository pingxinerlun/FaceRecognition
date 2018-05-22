// 文件上传
jQuery(function () {
    var $ = jQuery,
        $list = $('#thelist'),
        state = 'pending',
        uploader;

    uploader = WebUploader.create({
        auto: true,
        // 不压缩image
        resize: false,
        // swf文件路径
        swf: BASE_URL + '/js/Uploader.swf',
        // 文件接收服务端。
        server: 'AjaxHandle/fileupload.ashx',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker'
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        var filename = file.name.replace(/.*(\/|\\)/, "");
        var fileExt = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
        var FileNameNotExt = filename.replace('.' + fileExt, '');

        var items = ' <li id="' + file.id + '"><a href="/AttaView.aspx?p=' + escape(filename) + '" target="_blank"><i class="fa fa-file"></i>&nbsp;' + filename + '</a>';
        items += '<div class="progress progress-mini"><div style="width: 100%;" class="progress-bar"></div></div>';
        items += '</li>';
        
        $list.append(items);
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        //debugger;
        var $li = $('#' + file.id),
            $percent = $li.find('.progress-mini').find('.progress-bar');

        var $state = $li.find('.progress-mini');
        $state.empty();

        // 避免重复创建
        if (!$percent.length) {
            var progress = '<div style="width: 0%;" class="progress-bar"></div>';
            $percent = $state.append(progress).find('.progress-bar');
        }
        $percent.css('width', percentage * 100 + '%');
    });

    //上传成功
    uploader.on('uploadSuccess', function (file, data) {
        //debugger;
        if (AttaList == "") {
            AttaList = data.id;
        }
        else {
            AttaList += ',' + data.id;
        }

        $('#' + file.id).find('a').attr('href', '/AttaView.aspx?p=' + escape(data.path));
    });

    //上传失败
    uploader.on('uploadError', function (file) {
        //debugger;
        $('#' + file.id).find('a').style = "color:red;";
        $('#' + file.id).find('a').attr('href', 'javascript:void(0);');
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress-mini').fadeOut();
    });

    uploader.on('uploadBeforeSend', function (block, data) {
        // block为分块数据。
        // file为分块对应的file对象。
        var file = block.file;
        data.fk_id = id;
        data.table = table;

        // 将存在file对象中的md5数据携带发送过去。
        // data.fileMd5 = file.md5;

        // 删除其他数据
        // delete data.key;
    });

    uploader.on('all', function (type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        //        if (state === 'uploading') {
        //            $btn.text('暂停上传');
        //        } else {
        //            $btn.text('开始上传');
        //        }
    });

    //    $btn.on('click', function () {
    //        if (state === 'uploading') {
    //            uploader.stop();
    //        } else {
    //            uploader.upload();
    //        }
    //    });

});