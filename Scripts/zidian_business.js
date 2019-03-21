debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    var form=layui.form;
    laydate.render({
        elem: '#ShouldReceive'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#Zafei-main-table",table:"Zafei-main-table",formid:"#Zafei-search-form",url:"api/BaseData/Querydata"
,btnview:"Zafei-button-view",toolview:"Zafei-view-btn",tooladd:"addzidian",tooledit:"editzidian",tooldelete:"deletezidian",tabfield:"Type"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 200, title: '编号' },
  { field: 'Name', width: 200, title: '名称' },
  { field: 'typename', width: 200, title: '字典类型'}
  ,{field:'IsActive', title:'是否激活', width:100, templet: '#switchTpl', unresize: true}
]], height: 620, url: config.url,ismuilti: true,
tablebtnid: '#btnintable',
"tabfield": "IsYajin",
    };
    var BtnOption = {
        area: ['1100px', '50%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: "editzafei",
        tooldelete:config.tooldelete,
        menuid:212,
        "realtable": "T_BASICS"
    };
    doc.InitButton(BtnOption, Zafeibtnscribt, tableoption);
    //监听工具栏按钮
   table.on('tool(demoEvent)', function(obj) {
       debugger;
   var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
       doc.bindCommonEvents(BtnOption, data, layEvent, url);
   });
    form.on('switch(sexDemo)', function(obj){
        debugger;
        var Id=$(obj.elem).attr("datas");
        var isactive=0;
        if(obj.elem.checked){
            isactive=1;
        }
        var tjdata={"Id":Id,"IsActive":isactive,"NotUpdatefield":["Name","Code","Type","IsYajin","TuiType"]};
        var saveoption={
            url:'api/Zafei/Savezafei',
            data:tjdata,
            tableid:config.table,
            callBack:function(resultData){
              if (resultData.Code == 0) {
                  
              
              }
          }
         }
        doc.Submit(saveoption);
       
    });  
    function yajintemp(value) {
        if (value.IsYajin == 0) {
            return '<div>' + "否" + '</div>'
        } 
        if (value.IsYajin == 1) {
            return '<div>' + "是" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    }
    function tuitemp(value) {
       
        if (value.TuiType == 0) {
            return '<div>' + "普通项" + '</div>'
        } 
        if (value.TuiType == 1) {
            return '<div>' + "退款项" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    
        
    }
    function Typetemp(value) {
       
        if (value.Type == 1) {
            return '<div>' + "固定费用" + '</div>'
        } 
        if (value.Type == 2) {
            return '<div>' + "预充值" + '</div>'
        } 
        if (value.Type == 3) {
            return '<div>' + "抄表结算" + '</div>'
        } 
        return '<div>' + "未知" + '</div>'
    
        
    }
});