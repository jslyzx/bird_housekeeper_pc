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
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/Account/list"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addls",tooledit:"guest-edit-btn",tooldelete:"deleteaccount",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
    , { field: 'Id', width: 100, title: '编号' },
    { field: 'accountname', width: 100, title: '账户名' },
  { field: 'account', width: 200, title: '账号' },
  { field: 'bank', width: 150, title: '开户行' },
  { field: 'zhbank', width: 300, title: '开户行支行' },
  {width: 100, title: '账号类型' ,templet: formattertype},
]], height: 620, url: config.url,ismuilti: true
    };
   
    var BtnOption = {
        area: ['1100px', '90%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:229
        ,"realtable":"T_ACCOUNTBANK"
    };
   
    doc.InitButton(BtnOption, sysuerbtnscribt, tableoption);
     //监听工具栏按钮
    table.on('tool(demoEvent)', function(obj) {
    var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
    
    
    function Ugenttemp(value) {
        if (value.Type == 2) {
            return '<div style="background-color:crimson;text-align:center;color: #f5f6f7;">' + "支出" + '</div>'
        } 
        if (value.Type == 1) {
            return '<div style="background-color: blue;text-align:center;color: #f5f6f7;">' + "收入" + '</div>'
        } 
     
    }
    function formattertype(value) {
       
        if(value.type==1){
            return "支付宝";
        }
        if(value.type==2){
           return "银行卡";
        }
     }
    function formatterctype(value) {
       
       if(value.type==1){
           return "支付宝";
       }
       if(value.type==2){
          return "微信";
       }
       if(value.type==3){
          return "银行卡";
       }
       return value.Trader; 
    }
    function formatterTrader(value) {
       
        if(value.type==1||value.type==2){
            return "账户名"+value.name+" "+"账户"+value.account;
        }
        
        if(value.type==3){
            return "银行"+value.bank+" "+"账户名"+value.name+" "+"账户"+value.account;
        }
        
     }
    
    $("#addzfb").click(function(){
        debugger;
        var url="set/base/addzfb";
        var view = layui.view;
        var editid = "layuizcbtn";
        layer.open({
            id: editid,
            type: 1,
            title: '新增支付宝账号',
            skin: 'two-layer',
            shadeClose: false, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['50%', '50%'],
            success: function(layero, index) {
                view(this.id).render(url, {
                    tableid: "guest-main-table",
                    layerindex: index
                });
            }
        });
    })
    $("#addbank").click(function(){
        debugger;
        var url="set/base/addbank";
        var view = layui.view;
        var editid = "layuizcbtn";
        layer.open({
            id: editid,
            type: 1,
            title: '新增银行卡',
            skin: 'two-layer',
            shadeClose: false, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['50%', '50%'],
            success: function(layero, index) {
                view(this.id).render(url, {
                    tableid: "guest-main-table",
                    layerindex: index
                });
            }
        });
    })
});