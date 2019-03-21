debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    laydate.render({
        elem: '#ShouldReceive'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#autotaskservice-main-table",table:"autotaskservice-main-table",formid:"#autotaskservice-search-form",url:"api/autotaskservice/Querylist"
,btnview:"autotaskservice-button-view",toolview:"autotaskservice-view-btn",tooladd:"autotaskservice-add-btn",tooledit:"autotaskservice-edit-btn",tooldelete:"autotaskservice-delete-btn",tabfield:"Type"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'ShowName', width: 200, title: '计划任务名称' }
  , { field: 'ServerIp', width: 200, title: '服务器地址' }
  , { field: 'Port', width: 100, title: '端口号' }
  , { field: 'Scheduler', width: 200, title: '计划实例' }
  , { field: 'CreationDATE', width: 200, title: '创建时间' }
  
  , { field: 'ModifidDate', width: 200, title: '修改时间' }
 
  , { field: 'ModifierId', width: 200, title: '修改人' }

  
]], height: 620, url: config.url,ismuilti: true
    };
    var BtnOption = {
        area: ['1100px', '900px'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:185
    };
    doc.InitButton(BtnOption, autotaskservicebtnscribt, tableoption);
    //监听工具栏按钮
   table.on('tool(demoEvent)', function(obj) {
   var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
       doc.bindCommonEvents(BtnOption, data, layEvent, url);
       debugger;
       if (layEvent === 'autotaskservice-guanli') { 
        var editid = "layuibillreceivebtn";
        var view = layui.view;
        var datas={};
        datas.ServerIp = data.ServerIp;
        datas.Port = data.Port;
        datas.Scheduler = data.Scheduler;
        layer.open({
            id:editid,
            type: 1,
            title: '计划任务管理',
            skin: 'two-layer',
          
            //anim: 4,
            shadeClose: true,//开启遮罩关闭
        
            maxmin: true, //开启最大化最小化按钮
            area: ['1500px', '900px'],
            success: function(){
                view(this.id).render(url, {
                    datas: datas,
                    tableid:"autotaskservice-main-table"
                });
              }
            }); 
    }
   });
    function Ugenttemp(value) {
        if (value.Urgent == 1) {
            return '<div style="background-color:crimson;text-align:center;color: #f5f6f7;">' + "紧急" + '</div>'
        } 
        if (value.Urgent == 2) {
            return '<div style="background-color: blue;text-align:center;color: #f5f6f7;">' + "正常" + '</div>'
        } 
        if (value.Urgent == 3) {
            return '<div style="background-color: #4e5b66;text-align:center;color: #f5f6f7;">' + "延后" + '</div>'
        } else{
            return '<div style="background-color: #4e5b66;text-align:center;color: #f5f6f7;">' + "未知" + '</div>'
        }
    }
    function pricetemp(value) {
       
        if(value.MaxPrice==0){
            return '<div>' + "无限制" + '</div>'
        }
            return '<div>' + value.MinPrice+"-"+value.MaxPrice + '</div>';
    
        
    }
    //计划任务管理
    $("#autotaskservice-guanli").click(function () {
        debugger;
        var editid="autotaskserviceguanlibtn";
        var view = layui.view;
        var checkStatus = table.checkStatus('autotaskservice-main-table')
                , getselect = checkStatus.data;
        if (getselect.length == 0) {
            layer.msg("请选择要编辑的数据");
            return;
        }
        if (getselect.length > 1) {
            layer.msg("不支持多选");
            return;
        }
        var datas={};
        datas.ServerIp = getselect[0].ServerIp;
        datas.Port = getselect[0].Port;
        datas.Scheduler = getselect[0].Scheduler;
        layer.open({
            id:editid,
            type: 1,
            title: '计划任务管理',
            skin: 'two-layer',
          
            //anim: 4,
            shadeClose: true,//开启遮罩关闭
        
            maxmin: true, //开启最大化最小化按钮
            area: ['1500px', '900px'],
            success: function(){
                view(this.id).render($("#autotaskservice-guanli").attr("hturl"), {
                    datas: datas,
                    tableid:"autotaskservice-main-table"
                });
              }
            }); 
     
    });
});