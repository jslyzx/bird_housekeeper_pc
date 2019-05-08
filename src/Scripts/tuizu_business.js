var defaults = {
    s1:'CityName',
    s2:'AreaName',
    s3:'CellName',
    v1:null,
    v2:null,
    v3:null
}; 
var $form;
var form;
var $;
layui.use(['laypage','layer', 'htcsradio', 'laytpl', 'jquery', 'form', 'htcsLG'], function () {
    var laypage = layui.laypage
    , layer = layui.layer;
    var laytpl = layui.laytpl;
    var $ = layui.$;
    var table = layui.table;
    var doc = layui.htcsLG;
    var util = layui.util;
    $ = layui.jquery;
    form = layui.form;
    $form = $('form');
    var threeSelectData={};
    doc.objectQuery("api/Formatter/QueryCell",{},function(data1){ 
        debugger;
        threeSelectData=data1.numberData;
        treeSelect(defaults);
    }); 
    debugger;
    var tableoption = {
        domid: "#zcontract-index-table", formid: "#zcontract-search-form", arr: [[ //表头
            { type: 'checkbox' }
          , { field: 'Id'  , width: 100, title: '合同编号' }
          , { field: 'Name', width: 100, title: '租客姓名' }
          , { field: 'Status', width: 110, title: '状态', templet: formatterstatus }
          , { width: 450, title: '所属房源', templet: formatterhouse }
          , { field: 'ContractTime', width: 270, title: '合同周期', templet: formattertime }
          , { field: 'Deposit', width: 80, title: '押金' }
          , { field: 'Recent', width: 80, title: '租金' }
          , { field: 'Pinlv', width: 180, title: '付款频率',templet: formatterpinlv }
          , { field: 'Phone', width: 180, title: '租客电话' }
    ]], height: 650, url: 'api/Contract/Query',
        ismuilti: true,"tabfield":"Status"
    };
    doc.InitTable(tableoption);
    var BtnOption = {
        area: ['990px', '910px'],
        tableid: "zcontract-index-table",
        ismuilti:true,
        btnview:  "zcontract-button-view",
        toolview: "zcontract-view-btn",
        tooladd:  "zcontract-add-btn",
        tooledit: "zcontract-edit-btn",
        tooldelete:"zcontract-delete-btn",
        deletespname:"sp_pldeletecontract",
        menuid:193
    };
    doc.InitButton(BtnOption, zcontractbtnscribt);
    $("#zcontract-tuizu-btn").click(function () {
        debugger;
        var editid="layuizcontracttuizubtn";
        var view = layui.view;
        var checkStatus = table.checkStatus('zcontract-index-table')
                , getselect = checkStatus.data;
        if (getselect.length == 0) {
            layer.msg("请选择要编辑的数据");
            return;
        }
        if (getselect.length > 1) {
            layer.msg("不支持多选");
            return;
        }
        var ids = getselect[0].Id;
        layer.open({
            id:editid,
            type: 1,
            title: '退租',
            skin: 'two-layer',
          
            //anim: 4,
            shadeClose: true,//开启遮罩关闭
        
            maxmin: true, //开启最大化最小化按钮
            area: ['1100px', '900px'],
            success: function(layero,index){
                view(this.id).render($("#zcontract-tuizu-btn").attr("hturl"), {
                    id: ids,
                    tableid:"zcontract-index-table",
                    layerindex:index
                });
              }
            }); 
    });
    
    function formatterstatus(value) {
        //0 不限 1预订 4待搬入 5在租 6已到期 7 已退租 8以作废 9 财务审核中	
       if (value.Status == 4) {
           return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">待搬入</span></div>'
       }
       if (value.Status == 5) {
           return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">在租中</span></div>'
       }
       if (value.Status == 6) {
           return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">已到期</span></div>'
       }
       if (value.Status == 7) {
           return '<div><span style="padding:10px;background-color:#c2c2c2;color:#ffffff;border-radius:5px;">已退租</span></div>'
       }
       if (value.Status == 8) {
           return '<div><span style="padding:10px;background-color:#c2c2c2;color:#ffffff;border-radius:5px;">已作废</span></div>'
       }
       if (value.Status == 9) {
           return '<div><span style="padding:10px;background-color:#FFB800;color:#ffffff;border-radius:5px;">财务审核中</span></div>'
       }
}
function formatterhouse(value) {
       var adress=value.CellName + "-" + value.BuildingNumber + "栋" + value.RoomId + "室";
       if(value.HouseName!=""&&value.HouseName!=null){
           adress+="-"+value.HouseName;
       }
       return '<div>' + adress + '</div>'
   }
   function formattertime(value) {
    
       return '<div>' +util.toDateString(value.BeginTime,'yyyy年MM月dd日')	  + "→" + util.toDateString(value.EndTime,'yyyy年MM月dd日') + '</div>';
}
function formatterpinlv(value) {
    return '<div>' +value.Pinlv + '月一付</div>';
}
function treeSelect(config)
{
    config.v1 =config.v1?config.v1:"北京";
    config.v2 =config.v2?config.v2:"北京";
    config.v3 =config.v3?config.v3:"东城区";
    $.each(threeSelectData,function(k,v){
        debugger;
        appendOptionTo($form.find('select[name='+config.s1+']'),v.provinceName,v.provinceName,config.v1);
    });
    form.render();
    cityEvent(config);
    areaEvent(config);
    form.on('select('+config.s1+')', function(data) {
        cityEvent(data);
        form.on('select('+config.s2+')', function(data) {
           areaEvent(data);
        });
    });
    function cityEvent(data){
        debugger;
        $form.find('select[name='+config.s2+']').html("");
        config.v1 = data.value?data.value:config.v1;
        if(config.v1=="全部")
        {
         debugger;
         appendOptionTo($form.find('select[name='+config.s2+']'),"全部","全部",config.v2);    
         $.each(threeSelectData,function(k,v){
              if(v.mallCityList){
                $.each(v.mallCityList,function(kt,vt){
                    if(vt.cityName!="全部"){
                   appendOptionTo($form.find('select[name='+config.s2+']'),vt.cityName,vt.cityName,config.v2);
                }
                });
              }
        });
        }else{
            $.each(threeSelectData,function(k,v){
                if(v.provinceName==config.v1)
                {
                  if(v.mallCityList){
                    $.each(v.mallCityList,function(kt,vt){
                   
                       appendOptionTo($form.find('select[name='+config.s2+']'),vt.cityName,vt.cityName,config.v2);
                        
                    });
                  }
                }
            });
        }
        form.render();
        config.v2 = $('select[name='+config.s2+']').val();
        areaEvent(config);
    }
    function areaEvent(data){
        debugger
        $form.find('select[name='+config.s3+']').html("");
        config.v2 = data.value?data.value:config.v2;
        if(config.v2=="全部")
        {
         debugger;
         appendOptionTo($form.find('select[name='+config.s3+']'),"全部","全部",config.v3);
         $.each(threeSelectData,function(k,v){
         if(v.mallCityList){
            $.each(v.mallCityList,function(kt,vt){
                  $.each(vt.mallAreaList,function(ka,va){
                    if(va.areaName!="全部"){
                        appendOptionTo($form.find('select[name='+config.s3+']'),va.areaName,va.areaName,config.v3);
                    } 
                  });
            });
          }
        });
        }else{
            $.each(threeSelectData,function(k,v){
                debugger
                if(v.provinceName==config.v1||config.v1=="全部")
                {
                  if(v.mallCityList){
                    $.each(v.mallCityList,function(kt,vt){
                       if(vt.cityName==config.v2)
                       {
                          $.each(vt.mallAreaList,function(ka,va){
                              appendOptionTo($form.find('select[name='+config.s3+']'),va.areaName,va.areaName,config.v3);
                          });
                       }
                    });
                  }
                }
            });
        }
        form.render();
        form.on('select('+config.s3+')', function(data) {});
    }
    function appendOptionTo($o,k,v,d){
      var $opt=$("<option>").text(k).val(v);
      if(v==d){$opt.attr("selected", "selected")}
      $opt.appendTo($o);
    }
}
});

function reflash() {
    debugger;
    layui.use(['table'], function () {
        var table = layui.table;
        table.reload("zcontract-index-table");   
    });
}
