layui.define(["setter", "table"], function(exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        jQuery = layui.jquery;
    var setter = layui.setter;
    var baseurl = setter.baseurl;
    var weburl = setter.weburl;
    var table = layui.table;
    var imgurl = "";
    var form = layui.form;
    var search = {};
    var statussearch = {};
    var searchpara = {};
    var util = layui.util;
    var tablePlug = layui.tablePlug;
    var buttonurl = "api/RoleButton/Querylist";
    var element = layui.element;
    var checkid = null;
    var obj = {
        //加载数据
        objectQuery: function(url, queryParam, callBack, paraasync) {
            var async = true;
            if (paraasync == false) {
                async = false;
            };
            var apiurl = baseurl + url;
            console.log(apiurl)
            $.ajax({
                url: apiurl,
                type: "POST",
                async: async,
                headers: {
                    access_token: layui.data('layuiAdmin').access_token
                },
                contentType: "application/json",
                data: JSON.stringify(queryParam),
                dataType: 'json',
                success: function(result) {
                   
                    if(result.Code==1002){
                        location.hash = '/user/login'; //跳转到登入页
                    }
                    var resultData = result;
                    if (typeof callBack == 'function') {
                        callBack(resultData);
                    } else {
                        layer.msg(resultData.Message, {
                            icon: 1,
                            time: 800 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }
                },
                error: function(a, b, c) {
                    console.log(a, b, c)
                    layer.msg("执行出现错误啦");
                }
            });
        },
        InitTable: function(options, btnOption) {
            options = jQuery.extend({
                domid: "#table",
                tabletab:'tabletab',
                tabfield: 'IsActive',
                ispaing: true,
                isadd:true,
                url: null,
                height: 'full-260',
                ismuilti: true,
                arr: [
                    []
                ],
                done: function(res) {
                    element.render('nav');
                    $('.toolbar-nav').parent().css({
                        overflow: 'visible'
                    });
                    $('.layui-table-fixed .layui-table-body').css({
                        overflow: 'visible'
                    });
                    if(res.Code==1002){
                        location.hash = '/user/login'; //跳转到登入页
                    }
                },
                search: {}
            }, options);
            if(options.isadd==true){
                options.arr[0].push({
                    toolbar: options.tablebtnid,
                    type: 'toolbar',
                    field: 'toolbar_common',
                    title: '操作',
                    width: 120,
                    align: 'center'
                    ,fixed:"right"
                })
            }
            var access_token = { "access_token": layui.data('layuiAdmin').access_token };
            var firstwhere = $.extend(access_token, options.search);
            table.render({
                elem: options.domid

                    ,
                url: baseurl + options.url,
                method: 'post',
                cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增

                    ,
                //toolbar:true,
                cols: options.arr,
                responseHandler: function(data) {

                    return {
                        "total": data.numberCount, //总页数
                        "rows": data.numberData //数据
                    };
                },
                page: options.ispaing,
                done: options.done,
                height: options.height,
                classes: 'table table-hover',
                loading: true,
                where: firstwhere,
                request: {
                    pageName: 'PageIndex' //页码的参数名称，默认：page
                        ,
                    limitName: 'PageSize' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'Code' //数据状态的字段名称，默认：code
                        ,
                    statusCode: 0 //成功的状态码，默认：0
                        ,
                    msgName: 'Message' //状态信息的字段名称，默认：msg
                        ,
                    countName: 'numberCount' //数据总数的字段名称，默认：count
                        ,
                    dataName: 'numberData' //数据列表的字段名称，默认：data
                },
                queryParams: function queryPara(param) {
                    param.offset = param.offset / 10 + 1;
                    var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                        PageSize: param.limit, //页面大小
                        PageIndex: param.offset, //页码
                    };
                    var object = $.extend({}, temp, options.search);
                    return object;
                }
            });

            form.on('submit(search)', function(data) {
                search = JSON.parse(JSON.stringify(data.field));
                obj.queryPara({}, options.domid,btnOption);
                return false;
            });
            var domtab='tab('+options.tabletab+')';
            element.on(domtab, function(data) {
                statussearch[options.tabfield] = $(this).attr("value");
                obj.getsearch(options.formid);
                obj.queryPara({}, options.domid,btnOption);
            });

            // 单击行变色并选中
            $('.layui-table-view').on('click', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                //选中新行
                var checkbox = $(this).parent().find(".laytable-cell-checkbox .layui-form-checkbox");
                checkbox.click();
            });
            table.on('checkbox(demoEvent)', function(obj) {
                //全选
                if (obj.type === 'all') {
                    if (obj.checked) {
                        $(obj.tr.prevObject).find('tr').css('background-color', '#f2f2f2');
                    } else {
                        $(obj.tr.prevObject).find('tr').css('background-color', '#fff');
                    }
                } else {
                    if (obj.checked) {
                        $(obj.tr).css('background-color', '#f2f2f2');
                    } else {
                        $(obj.tr).css('background-color', '#fff');
                    }
                }
            });
          
        },
        queryPara: function(ohtersearch, domid,btnOption) {

            searchpara = $.extend(ohtersearch, statussearch, search);
            var tableid = domid.replace("#", "");
            obj.reflash(tableid,btnOption);
        },
        getsearch: function(formid) {
            var arrserize = $(formid).serializeArray();
            $.each(arrserize, function(item, index) {
                search[item.name] = item.value;
            })
        },
        reflash: function(tableid,options) {
            searchpara.access_token = layui.data('layuiAdmin').access_token;
            table.reload(tableid, { where: searchpara });
            // 单击行变色并选中
            $('.layui-table-view').on('click', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                //选中新行
                var checkbox = $(this).parent().find(".laytable-cell-checkbox .layui-form-checkbox");
                checkbox.click();
            });
            if(options!=undefined){
                var dom='[lay-id='+tableid+']';
                $(dom).on('dblclick', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                    var tobj=$(this).parent().find("td[data-field='Id']")[0].innerText;
                    var url=""
                        var editid = "layui" + options.toolview;
                        var view = layui.view;
                        layer.open({
                         id: editid,
                         type: 1,
                         title: '查看',
                         skin: 'two-layer',
                         //anim: 4,
                         shadeClose: false, //开启遮罩关闭
                         //shade: ['0.5'],
                         maxmin: true, //开启最大化最小化按钮
                         area: options.area,
                         success: function(layero, index) {
                             view(this.id).render(options.url, {
                                 id: tobj,
                                 tableid: options.tableid,
                                 layerindex: index,
                                 btnOption:options
                             });
                         }
                     });
                    
                 });
            }
           
        },
        InitButton: function(options, btnscript, tableoption) {
            tableoption = jQuery.extend({
                tablebtnid: '#btnintable'
            }, tableoption);
            options = jQuery.extend({
                menuid: 0,
                area: ['893px', '600px'],
                editarea: ['893px', '600px'],
                btnview: "view",
                tooladd: 'tooladd',
                tooledit: 'tooedit',
                tooldelete: 'tooldelete',
                toolview: 'toolview',
                deleCont: "确认删除",
                ismuilti: true,
                tableid: '',
                btnjishu:0,
                deletespname: '',
                formatterbtn:[],
                isloadmenu:true,
            }, options);
            
            $('#zcontract-index-table .layui-table-view').on('dblclick', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                //选中新行
                var checkbox = $(this).parent().find(".laytable-cell-checkbox .layui-form-checkbox");
                checkbox.click();
            });
            
            var buttonurl = "api/RoleButton/Querylist";
            //参数用户ID和菜单的ID
            var buttondata = { SysUserId: layui.data('layuiAdmin').userid, Id: options.menuid,"btnjishu":options.btnjishu };
            obj.objectQuery(buttonurl, buttondata, function(result) {
                $.each(result.numberData,function(index,item){
                    if(item.BtnNo==options.toolview){
                        options.url=item.ButtonUrl;
                    }
                });
                var getTpl = btnscript.innerHTML,
                    view = document.getElementById(options.btnview);
                var laytpl = layui.laytpl;
                laytpl(getTpl).render(result.numberData, function(html) {
                    view.innerHTML = html;
                });
                var seg = '';
                var btnhtml = $(tableoption.tablebtnid).html();
                // 多次加载去掉原有的按钮
                btnhtml = btnhtml.replace(/<dd>.*<\/dd>/,'');
                if(options.isloadmenu==true){
                    var i = btnhtml.indexOf('</dl>');
                    layui.each(result.numberData, function(index, item) {
                    if (item.Multiple === 0) {
                        if(options.formatterbtn.length==0){
                            seg += '<dd><a lay-event="' + item.BtnNo + '" data-url="' + item.ButtonUrl + '">' +item.BtnName + '</a></dd>';
                        }
                        if(options.formatterbtn.length>0){
                            var formatter="";
                        
                            $.each(options.formatterbtn,function(index,value){
                                formatter="{{ "+value+"(d,'"+item.BtnNo+"','"+item.BtnName+"')}}";
                            });
                            seg += '<dd><a lay-event="' + item.BtnNo + '" data-url="' + item.ButtonUrl + '">' + formatter+ '</a></dd>';
                        }
                    }
                   });
                   btnhtml = btnhtml.slice(0, i) + seg + btnhtml.slice(i)
                }
                $(tableoption.tablebtnid).html(btnhtml);
                obj.InitTable(tableoption, options);
                
                obj.EventButton(options);
            }, false);
        },
        EventButton: function(options) {
            var that = obj;
            var $ = layui.$;
            var view = layui.view;
            var dom='[lay-id='+options.tableid+']';
            $(dom).on('dblclick', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                var tobj=$(this).parent().find("td[data-field='Id']")[0].innerText;
                    var editid = "layui" + options.toolview;
                    var view = layui.view;
                    layer.open({
                     id: editid,
                     type: 1,
                     title: '查看',
                     skin: 'two-layer',
                     //anim: 4,
                     shadeClose: false, //开启遮罩关闭
                     //shade: ['0.5'],
                     maxmin: true, //开启最大化最小化按钮
                     area: options.area,
                     success: function(layero, index) {
                         view(this.id).render(options.url, {
                             id: tobj,
                             tableid: options.tableid,
                             layerindex: index,
                             btnOption:options
                         });
                     }
                 });
                
             });
            //新增
            $("#" + options.tooladd).click(function() {
                var addid = "layui" + options.tooladd;
                layer.open({
                    id: addid,
                    type: 1,
                    title: '新增',
                    skin: 'two-layer',
                    //anim: 4,
                    shadeClose: false, //开启遮罩关闭
                    //shade: ['0.5'],
                    maxmin: true, //开启最大化最小化按钮
                    area: options.area,
                    success: function(layero, index) {
                        view(this.id).render($("#" + options.tooladd).attr("hturl"), {
                            tableid: options.tableid,
                            layerindex: index,
                            btnOption:options
                        });
                    }
                });

            });
        },
        bindCommonEvents: function(options, data, layEvent, url){
            var view = layui.view;

            options = jQuery.extend({
                menuid: 0,
                area: ['893px', '90%'],
                editarea: ['1100px', '90%'],
                btnview: "view",
                tooladd: 'tooladd',
                tooledit: 'tooedit',
                tooldelete: 'tooldelete',
                toolview: 'toolview',
                deleCont: "确认删除",
                ismuilti: true,
                tableid: '',
                layindex:0,
                deletespname: ''
            }, options);
           
            if (options.tooledit === layEvent) { //编辑
                    var editid = "layui" + options.tooledit;
                    layer.open({
                        id: editid,
                        type: 1,
                        title: '编辑',
                        skin: 'two-layer',
                        //anim: 4,
                        shadeClose: false, //开启遮罩关闭
                        //shade: ['0.5'],
                        maxmin: true, //开启最大化最小化按钮
                        area:options.editarea,
                        success: function(layero, index) {
                            view(this.id).render(url, {
                                id: data.Id,
                                tableid: options.tableid,
                                layerindex: index,
                                btnOption:options
                            });
                        }
                    });
                } else if (options.tooldelete === layEvent) { //删除
                    layer.open({
                        skin: 'demo-class',
                        title: '删除提示',
                        content: options.deleCont,
                        btn: ['确认删除', '取消'],
                        yes: function(index, layero) {
                            obj.deletetable(url, data.Id, options.tableid, options.realtable, options.deletespname,options.layindex,options)
                        },
                        btn2: function(index, layero) {
                            layer.close(index);
                        }
                    });
                } else if (options.toolview === layEvent) { //查看
                    obj.viewevent(options, data.Id, url);
                }
        },
        viewevent: function(options, id, url) {
            var editid = "layui" + options.toolview;
            var ids;
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '查看',
                skin: 'two-layer',
                //anim: 4,
                shadeClose: false, //开启遮罩关闭
                //shade: ['0.5'],
                maxmin: true, //开启最大化最小化按钮
                area: options.area,
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: id,
                        tableid: options.tableid,
                        layerindex: index
                    });
                }
            });
        },
        deletetable: function(url, id, tableid, realtable, spname,layindex,options) {
            var url = baseurl + url;
            var subdata = { "ids": id, "Table": realtable, "spname": spname };
            var index = layer.load(1); 
            //通用删除传递code权限识别
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: subdata,
                dataType: 'json',
                headers: {
                    access_token: layui.data('layuiAdmin').access_token,
                    Code:options.tooldelete
                },
                success: function(result) {
                    layer.close(index);
                    var resultData = result;
                    if (resultData.Code == 0) {
                        if (resultData.Message == "" || resultData.Message == null) {
                            resultData.Message = "删除成功";
                        }
                        layer.msg(resultData.Message, {
                            icon: 1,
                            time: 800 //2秒关闭（如果不配置，默认是3秒）
                        });
                        if(layindex!=0){
                            layer.close(layindex);
                        }
                        obj.reflash(tableid,options);
                    } else {
                        layer.open({
                            title: '温馨提示',
                            content: resultData.Message
                        });
                    }
                },
                error: function(a, b, c) {
                    layer.close(index);
                    layer.open({
                        title: '温馨提示',
                        content: '删除异常'
                    });
                    return false;
                }
            });
        },
        simpleSubmit: function(options) {
            options = jQuery.extend({
                url: null,
                data: {},
                tableid: '',
                callBack: function(res) {}
            }, options);
            var apiurl = baseurl + options.url;
            var subdata = JSON.stringify(options.data);
            var indexe = layer.load(1); //换了种风格
            $.ajax({
                url: apiurl,
                type: "POST",
                async: false,
                data: subdata,
                headers: {
                    access_token: layui.data('layuiAdmin').access_token
                },
                contentType: "application/json",
                dataType: 'json',
                success: function(result) {
                    layer.close(indexe);
                    var resultData = result;
                    if (resultData.Code == 0) {
                        if (resultData.Message == "") {
                            resultData.Message = "保存成功";
                        }
                    } else {
                        layer.open({
                            title: '温馨提示',
                            content: resultData.Message
                        });

                    }
                    if (typeof options.callBack == 'function') {
                        options.callBack(resultData);
                    }
                },
                error: function(re) {
                    layer.close(indexe);
                    var errstr;
                    if (re.responseJSON != null) {
                        errstr = re.responseJSON.ExceptionMessage;
                    } else {
                        errstr = re.responseText;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: '执行操作异常:' + errstr
                    });
                    if (typeof errcallBack == 'function') {
                        errcallBack();
                    }
                    return false;
                }

            });
        },
        Submitspname: function(options) {//执行存储过程
            options = jQuery.extend({
                Id: 0,
                SpName: "",
                callBack: function(res) {}
            }, options);
            var subdata = JSON.stringify(options.data);
            var indexe = layer.load(1); //换了种风格
            $.ajax({
                url: apiurl,
                type: "POST",
                async: false,
                data: subdata,
                headers: {
                    access_token: layui.data('layuiAdmin').access_token
                },
                contentType: "application/json",
                dataType: 'json',
                success: function(result) {
                    layer.close(indexe);
                    var resultData = result;
                    if (resultData.Code == 0) {
                        if (resultData.Message == "") {
                            resultData.Message = "执行成功";
                        }
                    } else {
                        layer.open({
                            title: '温馨提示',
                            content: resultData.Message
                        });

                    }
                    if (typeof options.callBack == 'function') {
                        options.callBack(resultData);
                    }
                },
                error: function(re) {
                    layer.close(indexe);
                    var errstr;
                    if (re.responseJSON != null) {
                        errstr = re.responseJSON.ExceptionMessage;
                    } else {
                        errstr = re.responseText;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: '执行操作异常:' + errstr
                    });
                    if (typeof errcallBack == 'function') {
                        errcallBack();
                    }
                    return false;
                }

            });
        },
        Submit: function(options) {
            options = jQuery.extend({
                url: null,
                data: {},
                tableid: '',
                callBack: function(res) {}
            }, options);
            var apiurl = baseurl + options.url;
            var subdata = options.data;
            var indexe = layts1();
            $.ajax({
                url: apiurl,
                type: "POST",
                async: false,
                data: subdata,
                headers: {
                    access_token: layui.data('layuiAdmin').access_token
                },
               
                dataType: 'json',
                success: function(result) {
                    layer.close(indexe);
                    var resultData = result;
                    if (resultData.Code == 0) {
                        if (resultData.Message == "") {
                            resultData.Message = "保存成功";
                        }

                        try {
                            //刷新参数
                            obj.reflash(options.tableid,options.btnOption);
                        } catch (e) {

                        }
                        layts(resultData.Message);

                    } else {
                        layer.open({
                            title: '温馨提示',
                            content: resultData.Message
                        });

                    }
                    if (typeof options.callBack == 'function') {
                        options.callBack(resultData);
                    }
                },
                error: function(re) {
                    layer.close(indexe);
                    var errstr;
                    if (re.responseJSON != null) {
                        errstr = re.responseJSON.ExceptionMessage;
                    } else {
                        errstr = re.responseText;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: '保存异常:' + errstr
                    });
                    if (typeof errcallBack == 'function') {
                        errcallBack();
                    }
                    return false;
                }

            });
        },
        Submit1: function(options) {
            options = jQuery.extend({
                url: null,
                data: {},
                tableid: '',
                callBack: function(res) {}
            }, options);
            var apiurl = baseurl + options.url;
            var subdata = JSON.stringify(options.data);
            var indexe = layts1();
            $.ajax({
                url: apiurl,
                type: "POST",
                async: false,
                data: subdata,
                headers: {
                    access_token: layui.data('layuiAdmin').access_token
                },
                contentType: "application/json",
                dataType: 'json',
                success: function(result) {
                    layer.close(indexe);
                    var resultData = result;
                    if (resultData.Code == 0) {
                        if (resultData.Message == "") {
                            resultData.Message = "保存成功";
                        }

                        try {
                            obj.reflash(options.tableid);
                        } catch (e) {

                        }
                        layts(resultData.Message);

                    } else {
                        layer.open({
                            title: '温馨提示',
                            content: resultData.Message
                        });

                    }
                    if (typeof options.callBack == 'function') {
                        options.callBack(resultData);
                    }
                },
                error: function(re) {
                    layer.close(indexe);
                    var errstr;
                    if (re.responseJSON != null) {
                        errstr = re.responseJSON.ExceptionMessage;
                    } else {
                        errstr = re.responseText;
                    }
                    layer.open({
                        title: '温馨提示',
                        content: '保存异常:' + errstr
                    });
                    if (typeof errcallBack == 'function') {
                        errcallBack();
                    }
                    return false;
                }

            });
        },
        ns: function(value) {
            if (value == undefined || value == null) {
                return "";
            } else {
                return value;
            }
        },
        getcheckbox:function(str){
            var valuelist="";
             var ha=$(str).find(".layui-form-checkbox");
             var list=[];
             ha.each(function(){
                 if($(this).hasClass("layui-form-checked")){
                    list.push($(this).prev().val())
                 }
             });
             valuelist= list.join(',');
             return valuelist;
        },
        cvttime: function(value) {
            if (value == undefined || value == "0001-01-01 00:00:00") {
                return "";
            } else {
                return util.toDateString(value, 'yyyy-MM-dd');
            }
        },
        viewbutton:function(btnoptions,btnscript){
            btnoptions = jQuery.extend({
                menuid: 0,
                area: ['893px', '600px'],
                editarea: ['893px', '600px'],
                btnview: "view",
                tooladd: 'tooladd',
                tooledit: 'tooedit',
                tooldelete: 'tooldelete',
                toolview: 'toolview',
                deleCont: "确认删除",
                ismuilti: true,
                tableid: '',
                deletespname: ''
            }, btnoptions);
            var buttondata = { SysUserId: layui.data('layuiAdmin').userid, Id: btnoptions.menuid,"btnjishu":btnoptions.btnjishu };
            obj.objectQuery(buttonurl, buttondata, function(result) {
               
                var seg = '';
                var btnhtml = $(btnoptions.tablebtnid).html();
              
                layui.each(result.numberData, function(index, item) {
                    if (item.Multiple === 0&&item.BtnNo!=btnoptions.toolview) {
                        seg += '<a class="layui-btn layui-btn-primary" lay-event="' + item.BtnNo + '" data-url="' + item.ButtonUrl + '">' + item.BtnName + '</a>';
                        
                    }
                });
                btnhtml =seg;
                $(btnoptions.tablebtnid).html(btnhtml);
                obj.EventButton(btnoptions);
            }, false);
        },
        childbtntable: function(options,btnoptions,btnscript) {
            btnoptions = jQuery.extend({
                menuid: 0,
                area: ['893px', '600px'],
                editarea: ['893px', '600px'],
                btnview: "view",
                tooladd: 'tooladd',
                tooledit: 'tooedit',
                tooldelete: 'tooldelete',
                toolview: 'toolview',
                deleCont: "确认删除",
                ismuilti: true,
                tableid: '',
                deletespname: ''
            }, btnoptions);
            options = jQuery.extend({
                type: 'edit',
                data: null
            }, options);
            $('.layui-table-view').on('dblclick', ".layui-table-body td:not([data-field='0']):not(:last-child)", function(event) {
                //选中新行
                var checkbox = $(this).parent().find(".laytable-cell-checkbox .layui-form-checkbox");
                checkbox.click();
            });
         
            //参数用户ID和菜单的ID
            var buttondata = { SysUserId: layui.data('layuiAdmin').userid, Id: options.menuid,"jishu":2 };
            obj.objectQuery(buttonurl, buttondata, function(result) {
                $.each(result.numberData,function(index,item){
                    if(item.BtnNo==options.toolview){
                        options.url=item.ButtonUrl;
                    }
                });
                var getTpl = btnscript.innerHTML,
                    view = document.getElementById(btnoptions.btnview);
                var laytpl = layui.laytpl;
                laytpl(getTpl).render(result.numberData, function(html) {
                    view.innerHTML = html;
                });
                var seg = '';
                var btnhtml = $(options.tablebtnid).html();
                var i = btnhtml.indexOf('</dl>');
                layui.each(result.numberData, function(index, item) {
                    if (item.Multiple === 0) {
                        seg += '<dd><a lay-event="' + item.BtnNo + '" data-url="' + item.ButtonUrl + '">' + item.BtnName + '</a></dd>';
                    }
                });
                btnhtml = btnhtml.slice(0, i) + seg + btnhtml.slice(i)
                $(options.tablebtnid).html(btnhtml);
                obj.InitTable(options, options);
                obj.EventButton(btnoptions);
            }, false);
            var token = { "access_token": layui.data('layuiAdmin').access_token };
            var firstwhere = $.extend(token, options.search);
            if (options.type == "add") {
                table.render({
                    elem: options.tableid,
                    toolbar: options.toolbar,
                    data: [],
                    cols: options.clos,
                    height: options.height,
                    page: false,
                    done: function(res, curr, count) {

                    }
                });
            } else {
                if (options.data == null) {
                    obj.objectQuery(options.url, search, function(data) {
                        var result = data.numberData;
                        table.render({
                            elem: options.tableid,
                            toolbar: options.toolbar,
                            data: data.numberData,
                            cols: options.clos,
                            height: options.height,
                            limit: data.numberCount,
                          
                            page: false,
                            done: function(res, curr, count) {}
                        });
                    });
                } else {
                    table.render({
                        elem: options.tableid,
                        data: options.data,
                        cols: options.clos,
                        height: options.height,
                        limit: options.data.length,
                        page: false,
                        done: function(res, curr, count) {}
                    });
                }

            }

        },
        childtable: function(options) {
            options = jQuery.extend({
                type: 'edit',
                data: null
            }, options);
            var token = { "access_token": layui.data('layuiAdmin').access_token };
            var search = $.extend(token, options.idopt);
            if (options.type == "add") {
                table.render({
                    elem: options.tableid,
                    toolbar: options.toolbar,
                    data: [],
                    cols: options.clos,
                    height: options.height,
                    page: false,
                    done: function(res, curr, count) {

                    }
                });
            } else {
                if (options.data == null) {
                    obj.objectQuery(options.url, search, function(data) {
                        var result = data.numberData;
                        table.render({
                            elem: options.tableid,
                            toolbar: options.toolbar,
                            data: data.numberData,
                            cols: options.clos,
                            height: options.height,
                            limit: data.numberCount,
                            page: false,
                            done: function(res, curr, count) {}
                        });
                    });
                } else {
                    table.render({
                        elem: options.tableid,
                        data: options.data,
                        cols: options.clos,
                        height: options.height,
                        limit: options.data.length,
                        page: false,
                        done: function(res, curr, count) {}
                    });
                }

            }

        },
        updateobj: function(_arr, _obj, fields) {
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i].LAY_TABLE_INDEX == _obj.numbers) {
                    for (var j = 0; j < fields.length; j++) {
                        _arr[i][fields[j]] = _obj[fields[j]];
                    }
                    return _arr;
                }
            }
        },
        tjgd: function() {
            var contenth = $(".layui-layer[type!='tips'] .layui-layer-content").height() - $(".form-bottom").height();
            $(".form-content").css("height", contenth);
        },
        formatterQuery: function(table, field, value, callBack) {
            var url = baseurl + "api/Formatter/Query";
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: { "Table": table, "Field": field, "Value": value },
                dataType: 'json',
                success: function(result) {
                    callBack(result);
                },
                error: function(a, b, c) {
                    layer.msg("查询出现错误啦");
                }
            });
        },
        formatterQueryxy: function(options, callBack) {
            options = jQuery.extend({
                Field: '*'
            }, options);
            var url = baseurl + "api/Formatter/Queryxq";
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: { "Table": options.Table, "Field": options.Field, "Value": options.Value, "Model": options.Model },
                dataType: 'json',
                success: function(result) {
                    callBack(result);
                },
                error: function(a, b, c) {
                    layer.msg("查询出现错误啦");
                }
            });
        },
        SearchData: function(data, fieldname, value) {
            if (typeof(data) == object) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][fieldname] == value) {
                        return data[i];
                    }
                }
            }
        },
        SearchData1: function(data, fieldname, value) {
            for (var i = 0; i < data.length; i++) {
                if (data[i][fieldname] == value) {
                    return data[i];
                }
            }
            return "";
        },
        parsearr: function(img) {
            var arr = new Array();
            if (img != null) {
                img = img.substring(0, img.length - 1);
                arr = img.split(';');
            }
            return arr;
        },
        parsearr1: function(img) {
            var arr = new Array();
            if (img != null) {
                arr = img.split(',');
            }
            return arr;
        },
        DateAdd:function (interval, number, date) {
            
            switch (interval) {
            case "y": {
                date.setFullYear(date.getFullYear() + number);
                return date;
                break;
            }
            case "q": {
                date.setMonth(date.getMonth() + number * 3);
                return date;
                break;
            }
            case "m": {
                date.setMonth(date.getMonth() + number);
                return date;
                break;
            }
            case "w": {
                date.setDate(date.getDate() + number * 7);
                return date;
                break;
            }
            case "d": {
                date.setDate(date.getDate() + number);
                return date;
                break;
            }
            case "h": {
                date.setHours(date.getHours() + number);
                return date;
                break;
            }
            case "m": {
                date.setMinutes(date.getMinutes() + number);
                return date;
                break;
            }
            case "s": {
                date.setSeconds(date.getSeconds() + number);
                return date;
                break;
            }
            default: {
                date.setDate(d.getDate() + number);
                return date;
                break;
            }
            }
        },        
        removeObjWithArr: function(_arr, _obj) {
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i].numbers == _obj.numbers) {
                    if (i == 0) {
                        _arr.shift(); //删除并返回数组的第一个元素
                        return;
                    } else if (i == length - 1) {
                        _arr.pop(); //删除并返回数组的最后一个元素
                        return;
                    } else {
                        _arr.splice(i, 1); //删除下标为i的元素
                        return;
                    }
                }
            }
        }
    };

    function layts(msg) {
        layer.msg(msg, {
            icon: 1,
            time: 800 //2秒关闭（如果不配置，默认是3秒）
        });
    }

    function layts1(msg) {
        var indexe = layer.msg('执行中请稍后', {
            icon: 16,
            shade: 0.01,
            time: 0
        });
        return indexe;
    }
    //输出test接口
    exports('htcsLG', obj);
});