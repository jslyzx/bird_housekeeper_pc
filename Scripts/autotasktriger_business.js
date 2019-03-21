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
    var config={tableid:"#autotasktriger-main-table",table:"autotasktriger-main-table",formid:"#autotasktriger-search-form",url:"api/autotasktriger/Querylist"
,btnview:"autotasktriger-button-view",toolview:"autotasktriger-view-btn",tooladd:"autotasktriger-add-btn",tooledit:"autotasktriger-edit-btn",tooldelete:"autotasktriger-delete-btn",tabfield:"Type"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'ShowName', width: 200, title: '名称' }
  , { field: 'CronExpression', width: 200, title: '表达式' }
  
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
        menuid:186
    };
    doc.InitButton(BtnOption, autotasktrigerbtnscribt, tableoption);
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