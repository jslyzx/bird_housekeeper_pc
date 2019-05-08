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
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/clean/Querylist"
,btnview:"guest-button-view",toolview:"editbaojie",tooladd:"addbaojie",tooledit:"editbaojie",tooldelete:"addbaojie",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 80, title: '编号' },
  { field: 'Name', width: 100, title: '状态',templet: Statustemp },
  { field: 'apply', width: 180, title: '申请时间' },
  { field: 'appointment', width: 180, title: '期望上门时间' },
  { field: 'house', width: 230, title: '地址' },
  { field: 'applyperson', width: 100, title: '申请人' },
  { field: 'phone', width: 100, title: '手机号' },
  { field: 'project', width: 100, title: '保洁项目' },
  { field: 'remark', width: 100, title: '描述' },
  { field: 'appointment', width: 100, title: '预约时间' },
  { width: 100, title: '紧急程度',templet: Ugenttemp  },
  { field: 'executorstr', width: 100, title: '执行人' },
  
  
]], url: config.url,ismuilti: true,search:{"status":1}
    };
        var BtnOption = {
        area: ['70%', '70%'],
        tableid: config.table,
        btnview: config.btnview,
        tooladd: config.tooladd,
        toolview: config.toolview,
        tooledit: config.tooledit,
        tooldelete:config.tooldelete,
        url:'guest/view',
        menuid:331
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
        if (value.ugent == 1) {
            return '<div >' + "普通" + '</div>'
        } 
        if (value.ugent == 2) {
            return '<div >' + "紧急" + '</div>'
        } 
        if (value.ugent == 3) {
            return '<div >' + "非常紧急" + '</div>'
        } 
        return '<div >' + "未知" + '</div>'
    }
    function Statustemp(value) {
        if (value.status == 1) {
            return '<div >' + "待处理" + '</div>'
        } 
        if (value.status == 2) {
            return '<div >' + "进行中" + '</div>'
        } 
        if (value.status == 3) {
            return '<div >' + "挂起中" + '</div>'
        } 
        if (value.status == 4) {
            return '<div >' + "已完成" + '</div>'
        } 
        return '<div >' + "未知" + '</div>'
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