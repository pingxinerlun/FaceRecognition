﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Recognition.aspx.cs" Inherits="FaceRecognition.Recognition" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>H+ 后台主题UI框架 - Blueimp相册</title>
    <meta name="keywords" content="H+后台主题,后台bootstrap框架,会员中心主题,后台HTML,响应式后台">
    <meta name="description" content="H+是一个完全响应式，基于Bootstrap3最新版本开发的扁平化主题，她采用了主流的左右两栏式布局，使用了Html5+CSS3等现代技术">
    <link rel="shortcut icon" href="favicon.ico">
    <link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.staticfile.org/font-awesome/4.4.0/css/font-awesome.css?v=4.4.0"
        rel="stylesheet">
    <link href="css/plugins/blueimp/css/blueimp-gallery.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.min.css?v=4.1.0" rel="stylesheet">
    <style>
        .lightBoxGallery img
        {
            margin: 5px;
            width: 160px;
        }
    </style>
</head>
<body class="gray-bg">
    <form id="form1" runat="server">
    <div class="wrapper wrapper-content">
        <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-content" style="display: none;">
                        <h2>
                            相册插件</h2>
                        <p>
                            <strong>blueimp Gallery</strong>主要为移动设备而设计，同时也支持桌面浏览器。可定制视频和相片，支持触摸操作，支持全屏播放等。项目地址：
                            <a href="https://github.com/blueimp/Gallery" target="_blank">https://github.com/blueimp/Gallery
                            </a>
                        </p>
                        <div class="lightBoxGallery">
                            <a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big1.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p1.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big2.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p2.jpg">
                            </a><a href="http://ozwpnu2pa.bkt.clouddn.com/p_big3.jpg" title="图片" data-gallery="">
                                <img src="http://ozwpnu2pa.bkt.clouddn.com/p3.jpg">
                            </a>
                            <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls" style="display: none;">
                                <div class="slides" style="width: 42480px;">
                                </div>
                                <h3 class="title">
                                    图片</h3>
                                <a class="prev">‹</a> <a class="next">›</a> <a class="close">×</a> <a class="play-pause">
                                </a>
                                <ol class="indicator">
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="js/content.min.js?v=1.0.0"></script>
    <script src="js/plugins/blueimp/jquery.blueimp-gallery.min.js"></script>
    </form>
</body>
</html>
