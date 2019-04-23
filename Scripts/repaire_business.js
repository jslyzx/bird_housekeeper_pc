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
        elem: '#BeginTime'
    });
    laydate.render({
        elem: '#EndTime'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#repaire-main-table",table:"repaire-main-table",formid:"#repaire-search-form",url:"api/Repaire/hRepairLble",formid:"#repaire-search-form",url:"api/Repaire/hRepairList"
,btnview:"guest-button-view",toolview:"repaire-edit-btn",tooladd:"repaire-add-btn",tooledit:"repaire-edit-btn",tooldelete:"repaire-delete-btn",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        tablebtnid: '#repairebtnintable',
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'Status', width: 80, title: '状态',templet:formastatus }
 
  , { field: 'CreateTime', width: 170, title: '创建时间' }
  , { field: 'AppiontTime', width: 170, title: '预约时间' }
  , { field: 'House', width: 200, title: '房源' }
  , { field: 'JournaList', width: 100, title: '报修人' }
  , { field: 'Phone', width: 150, title: '电话' }
  , { field: 'Project', width: 100, title: '维修项目' }
  , { field: 'RepairId', width: 100, title: '接单人编号' }
 
 
]], url: config.url,ismuilti: true  ,"search":{"Status":999}
    };
    var BtnOption = {
        realtable:'T_REPAIRLIST',
        area: ['80%', '80%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:177
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
                layer.msg("不是已接单状态不能直接完成");
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
    
    function formastatus(value) {
        if (value.Status == 0) {
            return '<div >' + "待接单" + '</div>'
        } 
        if (value.Status == 1) {
            return '<div >' + "已接单" + '</div>'
        } 
        if (value.Status == 2) {
            return '<div >' + "完成" + '</div>'
        } else{
            return '<div >' + "未知" + '</div>'
        }
    }
    function pricetemp(value) {
       
        if(value.MaxPrice==0){
            return '<div>' + "无限制" + '</div>'
        }
            return '<div>' + value.MinPrice+"-"+value.MaxPrice + '</div>';
    
        
    }
});