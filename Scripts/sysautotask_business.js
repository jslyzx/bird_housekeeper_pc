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
    var config={tableid:"#SysAutoTask-main-table",table:"SysAutoTask-main-table",formid:"#SysAutoTask-search-form",url:"api/SysAutoTask/Querylist"
,btnview:"SysAutoTask-button-view",toolview:"SysAutoTask-view-btn",tooladd:"SysAutoTask-add-btn",tooledit:"SysAutoTask-edit-btn",tooldelete:"SysAutoTask-delete-btn",tabfield:"Type"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'JobName', width: 200, title: '任务名称' }
  , { field: 'JobGroup', width: 200, title: '任务组' }
  , { field: 'JobDesc', width: 300, title: '任务描述' }
  , { field: 'JobSpName', width: 100, title: '存储过程' }
  , { field: 'JobClassName', width: 200, title: '类的名称' }
  , { field: 'TotalSeconds', width: 100, title: '执行次数' }
 

  
]], url: config.url,ismuilti: true
    };
    var BtnOption = {
        area: ['1100px', '900px'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:183
    };
    doc.InitButton(BtnOption, SysAutoTaskbtnscribt, tableoption);
    //监听工具栏按钮
   table.on('tool(demoEvent)', function(obj) {
   var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
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
    function pricetemp(value) {
       
        if(value.MaxPrice==0){
            return '<div>' + "无限制" + '</div>'
        }
            return '<div>' + value.MinPrice+"-"+value.MaxPrice + '</div>';
    
        
    }
});