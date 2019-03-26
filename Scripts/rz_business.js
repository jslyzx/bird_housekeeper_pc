debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    var houseid=parent.houseid;

    laydate.render({
        elem: '#CreateTime'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/RzService/Querylist"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addrzz",tooledit:"guest-edit-btn",tooldelete:"deletels",tabfield:"Status"
};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
   
  { field: 'createtime', width: 150, title: '创建时间' },
  { field: 'House', width: 200, title: '房源' },
  { field: 'type', width: 200, title: '类型' },
  { field: 'content', width: 200, title: '内容' },
  { field: 'create', width: 100, title: '创建人' },
  
 
]], url: config.url,ismuilti: true,
search:{"houseid":houseid}
    };
   
    var BtnOption = {
        area: ['60%', '50%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:237
        ,"realtable":"T_FINANCE"
    };
    debugger;
    doc.InitButton(BtnOption, guestbtnscribt, tableoption);
    $("#addrz").click(function(){
        var editid = "layuibillreceivebtn";
        var view = layui.view;
        layer.open({
            id: editid,
            type: 1,
            title: '新增日志',
            skin: 'two-layer',
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area:  ['80%', '80%'],
            success: function(layero, index) {
                view(this.id).render('house/rz/add', {
                    houseid:houseid,
                    tableid: "guest-main-table",
                    layerindex: index
                });
            }
        });
    })
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
    function formatterTrader(value) {
        debugger;
       if(value.Trader==undefined){
           return "";
       }
       return value.Trader; 
    }
});