var apiurl;
layui.use(['laypage', 'layer', 'htcsradio', 'laytpl', 'jquery', 'form','htcsLG','flow'], function () {
        var laypage = layui.laypage
        , layer = layui.layer;
        var laytpl = layui.laytpl;
        var $ = layui.$;
        var getTpl = demo.innerHTML
      , view = document.getElementById('view');
        var mymod = layui.htcsradio;
        var form = layui.form;
        var doc = layui.htcsLG;
        var $ = layui.jquery;
        apiurl =layui.setter.baseurl;
        var nowid=0;
        var parentname;
        var search={"RecrntType":3};       
        var url ='api/IndependHouse/PCQueryhouselist';
        var paradata = { "PageSize": 10, "PageIndex": 1,"RecrntType":3 };
        var option = { data: [{ "value": 0, "text": "全部" }, { "value": 1, "text": "未租" },  { "value": 2, "text": "已租" },{ "value": 3, "text": "装修中" }], rdefault: 0 };
        mymod.CreateInput($("#house-othersrarch"), option, function (result) {
            search.Status=result;
            loaddata(search);
        });
       //导出
       $("#excel").click(function(e){
        debugger;
        var url=apiurl+"HtcsExcel/dhouseexcel?search="+JSON.stringify(search)+"&access_token="+layui.data('layuiAdmin').access_token; 
        var checkurl=apiurl+"HtcsExcel/checklogin?access_token="+layui.data('layuiAdmin').access_token;
        $.ajax({
            url: checkurl,
            type: "get",
            async: false,
            data: JSON.stringify(search),
           // dataType: 'json',
            success: function(result) {
                if(result.Code==1002){
                    location.hash = '/user/login'; //跳转到登入页
                }
                if(result.Code==0){
                    window.location.href=url;
                }
            },
            error: function(a, b, c) {
                console.log(a, b, c)
                layer.msg("执行出现错误啦");
            }
        });
        e.stopPropagation();    //阻止冒泡  
    }); 
         //监听提交
         form.on('submit(search)', function(data){
            search= $.extend(paradata, data.field);
            loaddata(search);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        form.on('select(sign)', function(data){
            search.sign=data.value;
            loaddata(search);
        }); 
        var flow = layui.flow;
        // 三级联动数据
        var leftFilter = {
            currentProvince: '',
            currentCity: '',
            currentArea: '',
            provinceOptions: [],
            cityOptions: [],
            areaOptions: [],
            provinceList: [],
            cityList: [],
            areaList: []
        }
        var leftFilterUrl = 'api/Formatter/QueryPCCell1';
        InitLeftFilter();

        form.on('select(province)', function (data) {
            debugger;
            leftFilter.currentProvince = data.value;
            for (let i in leftFilter.provinceList) {
                if (leftFilter.currentProvince === leftFilter.provinceList[i].provinceName) {
                    leftFilter.cityList = leftFilter.provinceList[i].mallCityList;
                }
            }
            selectProvince();
            console.log(leftFilter);
            $('select[name="city"]').html(leftFilter.cityOptions.join('')).val(leftFilter.currentCity);
            $('.area-list').html(leftFilter.areaOptions.join(''))
            form.render();
            search.CityName=leftFilter.currentProvince;
            search.AreaName=leftFilter.currentCity;
            search.CellName=leftFilter.currentArea;
            loaddata(search);
        })
       
        form.on('select(city)', function (data) {
            debugger;
            leftFilter.currentCity = data.value;
            for (let i in leftFilter.cityList) {
                if (leftFilter.currentCity === leftFilter.cityList[i].cityName) {
                    leftFilter.areaList = leftFilter.cityList[i].mallAreaList;
                }
            }
            selectCity();
            console.log(leftFilter)
            $('.area-list').html(leftFilter.areaOptions.join(''))
            form.render();
            search.CityName=leftFilter.currentProvince;
            search.AreaName=leftFilter.currentCity;
            search.CellName=leftFilter.currentArea;
            loaddata(search);
        })

        $('.area-list').on('click', '.area-item', function (e) {
            $(this).addClass('area-item-active').siblings('.area-item').removeClass('area-item-active')
            leftFilter.currentArea = $('.area-list .area-item-active').attr('lay-value');
            loaddata({
                'CityName': leftFilter.currentProvince,
                'AreaName': leftFilter.currentCity,
                'CellName': leftFilter.currentArea
            })
        });
        //加载数据
        function loaddata(othersearch){
            //合并筛选条件
            $('#view').remove();
            $('.right-content').append('<div id="view"></div>')
            paradata= $.extend(paradata, othersearch);
            flow.load({
                elem: '#view' //流加载容器
                ,scrollElem: '#view'
                ,isAuto:true
                ,end:"没有房源了"
                ,done: function(page, next){ //执行下一页的回调
                    paradata.PageIndex=page;
                    doc.objectQuery(url, paradata, function (data) {
                        $("#tao").html(data.other);
                        var floors=[];
                        if(data.Code==0){
                            debugger;
                            nowid=data.numberData.Id;
                            parentname=data.numberData.Name;
                            Eventhouse();
                            if(data.numberData!=null){
                                floors=data.numberData.floors;
                            }
                        }
                        laytpl(getTpl).render(floors, function (html) {
                            setTimeout(function(){
                            next(html, page < data.numberCount/paradata.PageSize); //假设总页数为 10
                            InitEvent(data.numberData.Id);
                            }, 500);
                        })         
                    });
                }
              });
           
        }
        //编辑和删除楼层事件
    function Eventhouse(){
        $("#edithousedepend").click(function (index,value) {
            debugger;
            var view = layui.view;
            layer.open({
                type: 1,
                id:"edithousedependid",
                title: '公寓编辑',
                skin: 'two-layer',
                anim: -1,
                shade: .1,
                shadeClose: true,
                maxmin: true,
                area: ['1120px', '600px'],
                
                success: function (layero, index) {
                    view("edithousedependid").render('house/d-house/edit', {
                        id: nowid,
                        layerindex:index
                       
                    });
                }
            });
         });
         //添加楼层
         $("#addhousedepend").click(function (index,value) {
             debugger;
            var view = layui.view;
            layer.open({
                type: 1,
                id:"addhousedependid",
                title: '添加楼层',
                skin: 'two-layer',
                anim: -1,
                shade: .1,
                shadeClose: true,
                maxmin: true,
                area: ['800px', '800px'],
                success: function (layero, index) {
                    view("addhousedependid").render('house/d-house/addfloor', {
                        id: nowid,
                        layerindex:index
                       
                    });
                   
                }
            });
         });
    }
        // 初始化三级联动
        function InitLeftFilter () {
            doc.objectQuery(leftFilterUrl, {"Type":"3"}, function (data) {
                var provinceList = data.numberData;
                var cityList = [];
                var provinceOptions = [];
                var currentProvince = leftFilter.currentProvince;
                for (var i in provinceList) {
                    if (currentProvince === '' || currentProvince === provinceList[i].provinceName) {
                    currentProvince = provinceList[i].provinceName;
                    cityList = provinceList[i].mallCityList; 
                    }
                    provinceOptions.push('<option value="'+ provinceList[i].provinceName +'">'+ provinceList[i].provinceName +'</option>');
                }
                leftFilter.provinceOptions  = provinceOptions;
                leftFilter.cityList = cityList;
                leftFilter.currentProvince = currentProvince;
                leftFilter.provinceList = provinceList;
                selectProvince();
                $('select[name="province"]').append(leftFilter.provinceOptions.join('')).val(leftFilter.currentProvince);
                $('select[name="city"]').append(leftFilter.cityOptions.join('')).val(leftFilter.currentCity);
                $('.area-list').append(leftFilter.areaOptions.join(''))
                form.render();
                loaddata({
                    'CityName': leftFilter.currentProvince,
                    'AreaName': leftFilter.currentCity,
                    'CellName': leftFilter.currentArea
                })
            })
        }

        function selectProvince () {
            var provinceList = leftFilter.provinceList;
            var currentProvince =  leftFilter.currentProvince;
            var cityList = leftFilter.cityList;
            var cityOptions = [];
            var currentCity = '';
            var areaList = [];
            if (currentCity === '') {
                cityOptions.push('<option value="">全部</option>')
                areaList = getAreaList();
                for (var i in cityList) {
                    cityOptions.push('<option value="'+ cityList[i].cityName +'">'+ cityList[i].cityName +'</option>')
                }
            } else {
                for (var i in cityList) {
                    if (currentCity === '' || currentCity === cityList[i].cityName) {
                    currentCity = cityList[i].cityName;
                    areaList = cityList[i].mallAreaList;
                    cityOptions.push('<option value="'+ cityList[i].cityName +'" selected>'+ cityList[i].cityName +'</option>');
                    } else {
                    cityOptions.push('<option value="'+ cityList[i].cityName +'">'+ cityList[i].cityName +'</option>')
                    }
                }
            }

            leftFilter.areaList = areaList;
            leftFilter.cityOptions = cityOptions;
            leftFilter.currentCity = currentCity;

            selectCity();
        }

        function getAreaList () {
            var cityList = leftFilter.cityList;
            var areaList = [];
            for (var i in cityList) {
                areaList = [].concat(areaList, cityList[i].mallAreaList || []);
            }
            return areaList;
            for (var i in cityList) {
                areaList = [].concat(areaList, cityList[i].mallAreaList || []);
            }
            return areaList;
        }

        function selectCity () {
            var areaList = leftFilter.areaList;
            var cityList = leftFilter.cityList;
            var areaOptions = [];
            var currentArea = '';
            for (var i in areaList) {
                if (currentArea === '' || currentArea === areaList[i].areaName) {
                    currentArea = areaList[i].areaName;
                    areaOptions.push('<label class="area-item area-item-active" lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
                } else {
                    areaOptions.push('<label class="area-item"  lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
                }
            }
            // if (currentArea === '' && areaList.length > 1) {
            //     areaOptions.push('<label class="area-item area-item-active" lay-value="">全部小区</label>')
            //     for (var i in areaList) {
            //         areaOptions.push('<label class="area-item" lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
            //     }
            // } else {
            //     if (currentArea === '') {
            //         areaOptions.push('<label class="area-item area-item-active" lay-value="">全部小区</label>');
            //     }
            //     for (var i in areaList) {
            //         if (currentArea === areaList[i].areaName) {
            //             currentArea = areaList[i].areaName;
            //             areaOptions.push('<label class="area-item area-item-active" lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
            //         } else {
            //             areaOptions.push('<label class="area-item"  lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
            //         }
            //     }
            // }
            leftFilter.areaOptions = areaOptions;
            leftFilter.currentArea = currentArea;
        }

function InitEvent(pId) {
    //debugger;
    $(".m-row").click(function () {
        //debugger;
        //alert($(this).html());
        var idvalue = $(this).attr("id");
        var classvalue = $(this).attr("class");
        var index = getIndex(idvalue, classvalue);
        if (index != 0) {
            var body = $("#m-wrap-body-" + index);
            body.slideToggle();
        } else {
            $(".m-wrap-body").slideToggle();
        }
    });
    
    
    $(".caidan-icon").mouseover(function () {
        //debugger;
        var index = $(this).attr("id").replace("caidan-icon-", "");
        $(".span-box").hide();
        $("#span-box-" + index).show();

    });
    $(".span-box").mouseleave(function () {
        $(this).hide();
    });
    $(".m-panel-body").mouseleave(function () {
        var index = $(this).attr("ID").replace("panel-body-", "");
        $("#span-box-" + index).hide();
    });
    ViewEvent(pId);
    
}

function ViewEvent(pId) {
    $(".m-row").unbind("click");

    $(".m-panel-body").not(".layui-icon").dblclick(function () {
        var id = $(this).attr("id").replace("panel-body-", "");
        var parentid = $(this).parent(".m-wrap-body").attr("parentid");
        var view = layui.view;
        layer.open({
            type: 1,
            id:"domInterView",
            title: '房源详情',
            skin: 'two-layer',
            anim: -1,
            offset: 'r',
            shade: .1,
            shadeClose: true,
            maxmin: true,
            area: ['70%', '1100px'],
            skin: "layui-anim layui-anim-rl layui-layer-adminRight",
            success: function (layero, index) {
                //debugger;
                view("domInterView").render('house/d-house/InterView', {
                    id: id,
                    ParentRoomid:pId,
                    layerindex:index
                });
            }
        });
    });
    //登记租客
    $(".addcontract").click(function (index,value) {
        debugger;
        var id = $(this).attr("id").replace("addcontract-", "");
        var name = $(this).parent().parent().parent().find(".housename").html();
        var view = layui.view;
        layer.open({
            type: 1,
            id:"domedit",
            title: '租客登记',
            skin: 'two-layer',
            anim: -1,
            shade: .1,
            shadeClose: false,
            maxmin: true,
            area: ['1120px', '90%'],
            
            success: function (layero, index) {
                //debugger;
                view("domedit").render('contract/z-contract/add', {
                    houseid: id,
                    housename:parentname+"-"+name,
                    layerindex:index
                });
            }
        });
     });
    //修改
    $(".editdepent").click(function (index,value) {
       debugger;
       var id = $(this).attr("id").replace("editdepent-", "");
       var parentid = $(this).parent(".m-wrap-body").attr("parentid");
       var view = layui.view;
       layer.open({
           type: 1,
           id:"domedit",
           title: '房源编辑',
           skin: 'two-layer',
           anim: -1,
           shade: .1,
           shadeClose: false,
           maxmin: true,
           area: ['1120px', '90%'],
           
           success: function (layero, index) {
               //debugger;
               view("domedit").render('house/h-house/edit', {
                   id: id,
                   ParentRoomid:parentid,
                   layerindex:index
               });
           }
       });
    });
     //删除楼层
     $(".deletefloor").click(function(){
     debugger;
     var id = $(this).attr("id");
     id=id.replace("deletefloor-", "");
     layer.open({
         skin: 'demo-class',
         title: '删除提示',
         content:'您确定要删除该楼层吗？删除后与该楼层相对应的信息将被删除！'
         , btn: [ '确认删除','取消']
         , yes: function (index, layero) {
            deletefloor(id);
         }
         , btn2: function (index, layero) {
             layer.close(index);
         }
     });
    });
    //删除房源
   $(".deletedepent").click(function(){
       debugger;
    var id = $(this).attr("id");
    id=id.replace("deletedepent-", "");
    layer.open({
        skin: 'demo-class',
        title: '删除提示',
        content:'删除房间后，与该房间相关的合同、账单、及流水记录将被删除，请谨慎操作'
        , btn: [ '确认删除','取消']
        , yes: function (index, layero) {
            deletehouse(id);
        }
        , btn2: function (index, layero) {
            layer.close(index);
        }
    });
   });
   //编辑楼层信息
   $(".edithouse").click(function (index,value) {
    debugger;
    var id = $(this).attr("id").replace("edithouse-", "");
    var parentid = $(this).parent(".m-wrap-body").attr("parentid");
    var view = layui.view;
    layer.open({
        type: 1,
        id:"domeditpublic",
        title: '房源编辑',
        skin: 'two-layer',
        anim: -1,
        shade: .1,
        shadeClose: true,
        maxmin: true,
        area: ['800px', '400px'],
        
        success: function (layero, index) {
            //debugger;
            view("domeditpublic").render('house/d-house/editfloor', {
                id: id,
                ParentId:parentid,
                layerindex:index
            });
        }
    });
   });
   function deletehouse(id){
    doc.objectQuery("api/House/deletedepentHouse",{"ID":id},function(result){
        if(result.Code==0){
            layer.msg(result.Message, {
                icon: 1,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
            $("#panel-body-" + id).remove();
        }else{
            layer.msg("删除失败:"+result.Message, {
                icon: 2,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
        }
    });
}
function deletefloor(id){
    doc.objectQuery("api/IndependHouse/delelefloor",{"Id":id},function(result){
        if(result.Code==0){
            layer.msg(result.Message, {
                icon: 1,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
            loaddata();
        }else{
            layer.msg("删除失败:"+result.Message, {
                icon: 2,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
        }
    });
}
$(".addhouse").unbind("click");
$(".addhouse").click(function () {
    debugger;
    var url ="api/IndependHouse/addhouse";
    var floorid = $(this).attr("id").replace("addhouse-", "");
    var parentid= $(this).attr("ParentId")
    var $id = $("#m-wrap-body-" + floorid).children(".m-panel-body:last");
    var paradata = { "FloorId": floorid,"ParentRoomid":parentid };
    doc.objectQuery(url, paradata, function (data) {
        //debugger;
        var html = "<div class='m-panel-body' id='panel-body-" + data.numberData.ID+ "' ><div class='m-top m-zt-k' id='m-top'><ul><li><span>" + data.numberData.ID + "</span>-<span>" + data.numberData.Name + "</span><span class='caidan-icon'  id='caidan-icon-" + data.numberData.ID + "' ><i class='layui-icon' id='lay-ic-" + data.numberData.ID + "' style='font-size:22px;'  >&#xe65f;</i></span></li><ul class='project-span-box span-box' id='span-box-" + data.numberData.ID + "'><li style='line-height: 30px;height: 30px;' class='deletedepent'  id='deletedepent-"+data.numberData.ID+"' onclick='deleteevent(" +data.numberData+ ");'><a data='18220' class='editApartment' >删除房源</a></li><li style='line-height: 30px;height: 30px;' class='editdepent' id='editdepent-"+data.numberData.ID+"'><a class='view-del-project'>编辑房源</a></li></ul></li></li><li><span>暂未定价</span></li><li><span>房型</span><span>面积</span><span>朝向</span></li><li><span>空置</span><span class='m-red'>1天</span></li></ul></div></div>";
        $id.after(html);
        $(".caidan-icon").mouseover(function () {
            //debugger;
            var index = $(this).attr("id").replace("caidan-icon-", "");
            $(".span-box").hide();
            $("#span-box-" + index).show();
        });
        $(".span-box").mouseleave(function () {
            $(this).hide();
        });
        ViewEvent();
    });
});
}
});
function formatter(value,cont){
    if(value==null||value==""){
       return cont;
    }
    if(cont=="暂未定价"){
      return value+"元";
    }
    if(cont=="面积"){
      return value+"平";
    }
    return value;
  }function formatter1(value){
    if(value==1){
       return "到期"
    }
    if(value==2){
      return "违约"
   }
   if(value==3){
      return "转租"
   }
   if(value==4){
      return "新房"
   }
   return "房源类型";

}