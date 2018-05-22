/*
 * jquery.textTruncate.js
 * 功能：超过一定长度的文本自动收缩，并提供显示全文和收起的按钮。
 * 作者：张政权 2015-06-04
 */
(function ($) {
    $.fn.textTruncate = function (options) {
        var defaults = {
            limit: 100,
            more: '查看全文',
            less: '收起'
        };
        var options = $.extend(defaults, options);
        return $(this).each(function () {
            var allStr = $(this).html();
            var stringLength = allStr.length;
            var limit_len = defaults.limit;
            if (stringLength > limit_len) {

                var html_data = new Array();

                //替换html标签为一个字符（标签需要完整显示）
                var new_str = allStr.replace(/<a[\s]+[^>]+>([^<>]+)<\/a>|<img+(\s+[a-zA-Z]+\s*=\s*("([^"]*)"|'([^']*)'))*\s*\/>|<br\s*\/*>/g, function () {
                    html_data[arguments[arguments.length - 2]] = arguments[0];
                    return '＊';
                });

                var showText = '';
                var hideText = '';

                var i = 0, j = 0;
                while (j < limit_len) {
                    if (new_str[i] == '＊' && html_data[j]) {
                        showText += html_data[j];
                        var a=html_data[j].length,b=html_data[j].replace(/<a[\s]+[^>]+>([^<>]+)<\/a>/g, "$1").length;
                        j += a;
                        limit_len += (a - b);
                    }
                    else {
                        showText += new_str[i];
                        j++;
                    }
                    i++;
                }

                if (j < stringLength) {
                    hideText = allStr.substr(j);

                    var newHtml = '';
                    newHtml = showText + '<span class="span-ellipsis">...</span><span class="hiddenText" style="display:none;">'
                        + hideText + '</span><p><a class="a-more-less">' + defaults.more + '</a></p>';
                    $(this).html(newHtml);
                    var span_ellipsis = $('.span-ellipsis', this);
                    var span_hiddenText = $('.hiddenText', this);
                    var more_less = $('.a-more-less', this);
                    more_less.bind('click', function () {
                        if (more_less.html() == defaults.more) {
                            span_ellipsis.hide();
                            span_hiddenText.show();
                            more_less.html(defaults.less);
                        }
                        else {
                            span_hiddenText.hide();
                            span_ellipsis.show();
                            more_less.html(defaults.more);
                        }
                    })
                }
            }
        })
    }
})(jQuery);