debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var laytpl = layui.laytpl;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    var url="api/Enterprise/querycompany";
    var form = layui.form;
    laydate.render({
        elem: '#BeginTime'
    });
    laydate.render({
        elem: '#EndTime'
    });
    form.render('');
    debugger;
    //加载详情
    doc.objectQuery(url, {}, function (data) {
        debugger;
        var getTpl = sysuereditscript.innerHTML
      , view = document.getElementById('viewmoney');
        laytpl(getTpl).render(data.numberData, function (html) {
            view.innerHTML = html;
        }); 
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
                shadeClose: false, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['40%', '60%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                       
                        tableid: "guest-main-table",
                        layerindex: index
                    });
                }
            });
        })
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/order/Query"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addls",tooledit:"guest-edit-btn",tooldelete:"deletels",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
    , { field: 'Id', width: 100, title: '订单编号' },
  { field: 'CreateTime', width: 200, title: '创建时间' },
  { field: 'House', width: 200, title: '地址' },
  { field: 'zkName', width: 100, title: '租客姓名' },
  { field: 'Pone', width: 140, title: '租客电话'},
  { field: 'TradingDate', width: 100, title: '账务类型',templet: formasign },
  { field: 'zftype', width: 100, title: '支付方式' },
  { field: 'Amount', width: 100, title: '订单金额' },
  { field: 'Amount', width: 100, title: '到账类型',templet: formatterTrader },
 
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
    
    
    function formasign(value) {
        if (value.type == 1) {
            return '电费'
        } 
        if (value.Type == 2) {
            return '账单'
        } 
     return '未知';
    }
    function formatterTrader(value) {
        debugger;
       if(value.ispt==0){
           return "到账商家";
       }
       if(value.ispt==0){
        return "到账平台";
       }
     
    }
   
});