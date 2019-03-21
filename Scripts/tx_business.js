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
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/caiwutx/Query"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addls",tooledit:"guest-edit-btn",tooldelete:"deletels",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
    , { field: 'Id', width: 100, title: '提现编号' },
    { field: 'createtime', width: 200, title: '申请时间' },
  { field: 'amount', width: 100, title: '金额	' },
  { field: '', width: 100, title: '账户类型	',templet: formatterctype   },
  { field: 'Amount', width: 300, title: '收款账号',templet: formatterTrader  },
  { field: 'TradingDate', width: 100, title: '状态' ,templet: formattertype},
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
        menuid:202
        ,"realtable":"T_FINANCE"
    };
   
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
            return '<div style="background-color:crimson;text-align:center;color: #f5f6f7;">' + "支出" + '</div>'
        } 
        if (value.Type == 1) {
            return '<div style="background-color: blue;text-align:center;color: #f5f6f7;">' + "收入" + '</div>'
        } 
     
    }
    function formattertype(value) {
       
        if(value.Status==0){
            return "待处理";
        }
        if(value.Status==1){
           return "提现失败";
        }
        if(value.Status==2){
           return "提现成功";
        }
        return value.Trader; 
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
    
    $("#zbank").click(function(){
        debugger;
        var url="set/base/zbank";
        var view = layui.view;
        var editid = "layuizcbtn";
        layer.open({
            id: editid,
            type: 1,
            title: '转出',
            skin: 'two-layer',
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['40%', '40%'],
            success: function(layero, index) {
                view(this.id).render(url, {
                   
                    tableid: "guest-main-table",
                    layerindex: index
                });
            }
        });
    })
});