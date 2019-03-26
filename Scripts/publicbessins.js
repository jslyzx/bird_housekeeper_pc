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
        var search={"RecrntType":2};       
        var url ='api/House/Queryhouselist';
        var paradata = { "PageSize": 10, "PageIndex": 1,"RecrntType": 2};
        var option = { data: [{ "value": 0, "text": "全部" }, { "value": 1, "text": "未租" },  { "value": 2, "text": "已租" },{ "value": 3, "text": "装修中" }], rdefault: 0 };
        mymod.CreateInput($("#house-othersrarch"), option, function (result) {
            debugger;
            search.Status=result;
            loaddata(search);
        });
        //监听几室
        form.on('select(Idletime)', function(data){
            debugger;
            search.Idletime=data.value;
            loaddata(search);
        });  
        form.on('select(ShiNumber)', function(data){
            debugger;
            search.ShiNumber=data.value;
            loaddata(search);
        });  
        //监听提交
        form.on('submit(search)', function(data){
            search= $.extend(paradata, data.field);
            loaddata(search);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
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
            search.CityName=leftFilter.currentProvince;
            search.AreaName=leftFilter.currentCity;
            search.CellName=leftFilter.currentArea;
            loaddata(search);
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
                    //debugger;
                    paradata.PageIndex=page;
                    doc.objectQuery(url, paradata, function (data) {
                        laytpl(getTpl).render(data.numberData, function (html) {
                        setTimeout(function(){
                            next(html, page < data.numberCount/paradata.PageSize); //假设总页数为 10
                            InitEvent();
                            }, 500);
                        })
                  
                    });
                }
            });
        }
        
        // 初始化三级联动
        function InitLeftFilter () {
            doc.objectQuery(leftFilterUrl, {"Type":2}, function (data) {
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
            if (currentCity === '' && cityList.length > 1) {
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
        }

        function selectCity () {
            var areaList = leftFilter.areaList;
            var cityList = leftFilter.cityList;
            var areaOptions = [];
            var currentArea = '';
            if (currentArea === '' && areaList.length > 1) {
                areaOptions.push('<label class="area-item area-item-active" lay-value="">全部小区</label>')
                for (var i in areaList) {
                    areaOptions.push('<label class="area-item" lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
                }
            } else {
                if (currentArea === '') {
                    areaOptions.push('<label class="area-item area-item-active" lay-value="">全部小区</label>');
                }
                for (var i in areaList) {
                    if (currentArea === areaList[i].areaName) {
                        currentArea = areaList[i].areaName;
                        areaOptions.push('<label class="area-item area-item-active" lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
                    } else {
                        areaOptions.push('<label class="area-item"  lay-value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</label>')
                    }
                }
            }
            leftFilter.areaOptions = areaOptions;
            leftFilter.currentArea = currentArea;
        }

function InitEvent() {
    $(".m-row").unbind("click");
    $(".m-row").click(function (e) {
        debugger;
        var idvalue = $(this).attr("id");
        if(idvalue=="all-row"){
            $(".m-wrap-body").slideToggle();
            e.stopPropagation();

            return false;
        }
        idvalue=idvalue.replace("m-row-", "");
        if (idvalue != 0) {
            var body = $("#m-wrap-body-" + idvalue);
            body.slideToggle();
        }
        e.stopPropagation();
        return false;
    });
    $(".caidan-icon").mouseover(function () {
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
    ViewEvent();
    
}

function ViewEvent() {
   
    $(".m-panel-body").not(".layui-icon").dblclick(function () {
        debugger;
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
            area: ['60%', '100%'],
            skin: "layui-anim layui-anim-rl layui-layer-adminRight",
            success: function (layero, index) {
                view("domInterView").render('house/h-house/InterView', {
                    id: id,
                    ParentRoomid:parentid,
                    layerindex:index
                });
            }
        });
        return false;


    });
    //修改
    $(".editdepent").click(function (index,value) {
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
           shadeClose: true,
           maxmin: true,
           area: ['1120px', '90%'],
           
           success: function (layero, index) {
               view("domedit").render('house/h-house/edit', {
                   id: id,
                   ParentRoomid:parentid,
                   layerindex:index
               });
           }
       });
    });
    //删除房源
   $(".deletedepent").click(function(){
    var id = $(this).attr("id");
    id=id.replace("deletedepent-", "");
    layer.open({
        skin: 'demo-class',
        title: '删除提示',
        content:'删除房间后，与该房间相关的合同、账单、及流水记录将被删除，请谨慎操作'
        , btn: [ '确认删除','取消']
        , yes: function (index, layero) {
            deletehouse(id,"api/House/deletedepentHouse",{"ID":id},function(){
                $("#panel-body-" + id).remove();
            });
        }
        , btn2: function (index, layero) {
            layer.close(index);
        }
    });
   });
   //录入合同
   
   $(".addcontract").click(function(){
    var id = $(this).attr("id");
    id=id.replace("addcontract-", "");
    layer.open({
        type: 1,
        id:"domedit",
        title: '租客登记',
        skin: 'two-layer',
        anim: -1,
        shade: .1,
        shadeClose: true,
        maxmin: true,
        area: ['1120px', '90%'],
        success: function (layero, index) {
            view("domedit").render('contract/z-contract/add', {
                id: id,
                ParentRoomid:parentid,
                layerindex:index
            });
        }
    });
   });
   //删除整个房源
   $(".closehouse").click(function(){
    var id = $(this).attr("id");
    id=id.replace("closehouse-", "");
    layer.open({
        skin: 'demo-class',
        title: '删除提示',
        content:'删除房间后，与该房间相关的合同、账单、及流水记录将被删除，请谨慎操作'
        , btn: [ '确认删除','取消']
        , yes: function (index, layero) {
            deletehouse(id,"api/House/deleteHouse",{"Id":id},function(){
                loaddata(search);
            });
        }
        , btn2: function (index, layero) {
            layer.close(index);
        }
    });
   });
   //编辑公区信息
   $(".edithouse").click(function (index,value) {
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
        area: ['80%', '90%'],
        success: function (layero, index) {
            view("domeditpublic").render('house/h-house/publicview', {
                id: id,
                ParentRoomid:parentid,
                layerindex:index
            });
        }
    });
   });
   function deletehouse(id,url,para,cllback){
     
        doc.objectQuery(url,para,function(result){
        if(result.Code==0){
            layer.msg(result.Message, {
                icon: 1,
                time: 800 //2秒关闭（如果不配置，默认是3秒）
            });
            cllback();
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
    var url ="api/House/adddepentHouse";
    var parentid = $(this).attr("id").replace("addhouse-", "");
    var $id = $("#m-wrap-body-" + parentid).children(".m-panel-body:last");
    var paradata = { "Id": parentid };
    doc.objectQuery(url, paradata, function (data) {
        var html = "<div class='m-panel-body' id='panel-body-" + data.numberData.ID + "' ><div class='m-top m-zt-k' id='m-top'><ul><li><span>" + data.numberData.ID + "</span>-<span>" + data.numberData.Name + "</span><span class='caidan-icon'  id='caidan-icon-" + data.numberData.ID + "' ><i class='layui-icon' id='lay-ic-" + data.numberData.ID + "' style='font-size:22px;'  >&#xe65f;</i></span></li><ul class='project-span-box span-box' id='span-box-" + data.numberData.ID + "'><li style='line-height: 30px;height: 30px;' class='deletedepent' id='deletedepent-"+data.numberData.ID+"'><a data='18220' class='editApartment' >删除房间</a></li><li style='line-height: 30px;height: 30px;' class='editdepent' id='editdepent-"+data.numberData.ID+"' ><a class='view-del-project'>编辑房间</a></li></ul></li></li><li><span>暂未定价</span></li><li><span>房型</span><span>面积</span><span>朝向</span></li><li><span>空置</span><span class='m-red'>1天</span></li></ul></div></div>";
        $id.after(html);
        $(".caidan-icon").mouseover(function () {
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
        //loaddata(search);
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
}


