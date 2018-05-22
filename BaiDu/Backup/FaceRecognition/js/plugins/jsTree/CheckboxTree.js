/*
**��checkbox�����οؼ�ʹ��˵��
**@url����urlӦ�÷���һ��json��������������
**@id: ������Ⱦ��ҳ���ĳ��div�ϣ���div��id
**@checkId:��ҪĬ�Ϲ�ѡ�����ڵ�id��1.checkId="all"����ʾ��ѡ���нڵ� 2.checkId=[1,2]��ʾ��ѡidΪ1,2�Ľڵ�
**�ڵ��id����url����json���е�id����
*/
function showCheckboxTree(url, id, checkId) {
    treeid = id;
    menuTree = jQuery("#" + id).bind("loaded.jstree", function (e, data) {
        jQuery("#" + id).jstree("open_all");
        jQuery("#" + id).find("li").each(function () {
            if (checkId == 'all') {
                jQuery("#" + id).jstree("check_node", jQuery(this));
            } else if (checkId instanceof Array) {
                for (var i = 0; i < checkId.length; i++) {
                    if (jQuery(this).attr("id") == checkId[i]) {
                        jQuery("#" + id).jstree("check_node", jQuery(this));
                    }
                }
            }
        });
    }).jstree({
        "core": {
            "data": {
                "url": url,
                "dataType": "json",
                "cache": false
            },
            "attr": {
                "class": "jstree-checked"
            }
        },
        "types": {
            "default": {
                "valid_children": ["default", "file"]
            },
            "file": {
                "icon": "glyphicon glyphicon-file",
                "valid_children": []
            }
        },
        "checkbox": {
            "keep_selected_style": false,
            "real_checkboxes": true
        },
        "plugins": [
          "contextmenu", "dnd", "search",
          "types", "wholerow", "checkbox"
        ],
        "contextmenu": {
            "items": {
                "create": null,
                "rename": null,
                "remove": null,
                "ccp": null
            }
        }
    });
}

function getCheckboxTreeSelNode(treeid) {
    var ids = Array();
    jQuery("#" + treeid).find("li").each(function () {
        var liid = jQuery(this).attr("id");
        if (jQuery("#" + liid + ">a").hasClass("jstree-clicked") || jQuery("#" + liid + ">a>i").hasClass("jstree-undetermined")) {
            ids.push(liid);
        }
    });
    return ids;
}