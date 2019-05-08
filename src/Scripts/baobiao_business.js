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
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/baobiao/Query"
,btnview:"guest-button-view",toolview:"baobiaoview",tooladd:"guest-add-btn",tooledit:"guest-edit-btn",tooldelete:"guest-delete-btn",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' },
  { field: 'vacant', width: 100, title: '空置时间' },
  { field: 'profit', width: 100, title: '房间收益' },
  { field: 'updatetime', width: 200, title: '更新时间' },
  { field: 'cellname', width: 240, title: '小区名称' },
  { width: 100, title: '房源类型',templet: Ugenttemp  },

]], height: 'full-230', url: config.url,ismuilti: true
    };
        var BtnOption = {
        area: ['1100px', '90%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        menuid:228
        ,"realtable":"T_GUST"
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
        if (value.recenttype == 2) {
            return '<div>' + "合租" + '</div>'
        } 
        if (value.recenttype == 1) {
            return '<div>' + "整租" + '</div>'
        } 
        if (value.recenttype == 3) {
            return '<div>' + "独栋" + '</div>'
        } 
       
    }
    function Statustemp(value) {
        if (value.Ugent == 1) {
            return '<div style="background-color:crimson;text-align:center;color: #f5f6f7;">' + "待分配" + '</div>'
        } 
        if (value.Ugent == 2) {
            return '<div style="background-color: blue;text-align:center;color: #f5f6f7;">' + "跟进中" + '</div>'
        } 
        if (value.Ugent == 3) {
            return '<div style="background-color: #4e5b66;text-align:center;color: #f5f6f7;">' + "已完成" + '</div>'
        } 
        return '<div style="background-color: #4e5b66;text-align:center;color: #f5f6f7;">' + "未知" + '</div>'
    }
    function pricetemp(value) {
        if(value.MaxPrice==0){
            return '<div>' + "无限制" + '</div>'
        }
        return '<div>' + value.MinPrice+"-"+value.MaxPrice + '</div>';
    }
    function zuqi(value) {
       
        return '<div>' + value.RectDate+"月"+'</div>'; 
    }
});