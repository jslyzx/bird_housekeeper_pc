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
    var config={tableid:"#repaire-main-table",table:"repaire-main-table",formid:"#repaire-search-form",url:"api/Renovation/Querylist"
,btnview:"guest-button-view",toolview:"repaire-view-btn",tooladd:"repaire-add-btn",tooledit:"Renovationedit",tooldelete:"repaire-delete-btn",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        tablebtnid: '#repairebtnintable',
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'HouseName', width: 180, title: '房间名称' }
  , { field: 'budget', width: 170, title: '预算' }
  , { field: 'createtime', width: 170, title: '创建时间' }
  , { field: 'createperson', width: 100, title: '创建人' }

 
 
]], height: 'full-230', url: config.url,ismuilti: true  ,"search":{"Status":999}
    };
    var BtnOption = {
        realtable:'T_REPAIRLIST',
        area: ['1100px', '900px'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.tooledit,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:223
    };
    doc.InitButton(BtnOption, repairebuttonview, tableoption);
  //监听工具栏按钮
  table.on('tool(demoEvent)', function(obj) {
      debugger;
    var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        if (layEvent === 'repaire-Receipt-btn') { //接单
            if(data.Status!=0){
                layer.msg("不是待接单状态不能接单");
                return;
            }
            var datafield={};
            datafield.Id=data.Id;
            var saveoption={
                url:'api/Repaire/Receipt',
                data:datafield,
                callBack:function(resultData){
                  if (resultData.Code == 0) {
                    var tableid = tableoption.domid.replace("#", "");
                    doc.queryPara({},tableid);
                  }
              }
             }
            doc.Submit(saveoption);
        }
        if (layEvent === 'overrepaire') { //完成维修
            if(data.Status!=1){
                layer.msg("不是已接单状态不能接单");
                return;
            }
            var datafield={};
            datafield.Id=data.Id;
            var saveoption={
                url:'api/Repaire/End',
                data:datafield,
                callBack:function(resultData){
                  if (resultData.Code == 0) {
                    table.reload(config.tabfield);
                  }
              }
             }
            doc.Submit(saveoption);
        }
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
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
    function formastatus(value) {
        if (value.Status == 0) {
            return '<div style="background-color:crimson;text-align:center;color: #f5f6f7;">' + "待接单" + '</div>'
        } 
        if (value.Status == 1) {
            return '<div style="background-color: blue;text-align:center;color: #f5f6f7;">' + "已接单" + '</div>'
        } 
        if (value.Status == 2) {
            return '<div style="background-color: #4e5b66;text-align:center;color: #f5f6f7;">' + "完成" + '</div>'
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
});