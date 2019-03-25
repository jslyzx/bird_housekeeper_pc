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
        elem: '#CreateTime'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/Finance/Querylist"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addls",tooledit:"guest-edit-btn",tooldelete:"deletels",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
    , { field: 'Id', width: 100, title: '编号' },
  { field: 'PayMentNumber', width: 200, title: '支付流水号' },
  { field: 'CostName', width: 100, title: '费用名称	' },
  { field: 'Amount', width: 100, title: '交易金额' },
  { field: 'TYPE', width: 100, title: '收支类型' ,templet: Ugenttemp},
  { field: 'TradingDate', width: 200, title: '交易时间' },
  { field: 'PayType', width: 100, title: '支付方式' },
  { field: 'Transaoctor', width: 200, title: '办理人' },
  { field: 'Remark', width: 300, title: '备注' }
 
]], url: config.url,ismuilti: true
    };
   
    var BtnOption = {
        area: ['1100px', '90%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:202
        ,"realtable":"T_FINANCE"
    };
    debugger;
    doc.InitButton(BtnOption, guestbtnscribt, tableoption);
     //监听工具栏按钮
    table.on('tool(demoEvent)', function(obj) {
    var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
    function Ugenttemp(value) {
        if (value.Type == 2) {
            return '<div >' + "支出" + '</div>'
        } 
        if (value.Type == 1) {
            return '<div>' + "收入" + '</div>'
        } 
     
    }
    function formatterTrader(value) {
        debugger;
       if(value.Trader==undefined){
           return "";
       }
       return value.Trader; 
    }
});