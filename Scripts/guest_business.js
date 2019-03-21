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
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/Guest/Querylist"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"guest-add-btn",tooledit:"guest-edit-btn",tooldelete:"guest-delete-btn",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' },
  { field: 'Name', width: 100, title: '姓名' },
  { field: 'Phone', width: 150, title: '电话' },
  { field: 'Source', width: 100, title: '来源' },
  { field: 'IntoTime', width: 200, title: '入住时间' },
  { field: 'Huxing', width: 100, title: '户型' },
  { field: 'Other', width: 100, title: '其他' },
  { field: 'Remark', width: 100, title: '备注' },
  { width: 100, title: '状态',templet: Statustemp  },
  
  { width: 100, title: '紧急程度',templet: Ugenttemp  },
  { width: 100, title: '价格区间',templet: pricetemp  },
  { field: 'RectDate', width: 100, title: '租期',templet: zuqi  }
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
        url:'guest/view',
        menuid:172
        ,"realtable":"T_GUST"
    };
    doc.InitButton(BtnOption, guestbtnscribt, tableoption);
     //监听工具栏按钮
    table.on('tool(demoEvent)', function(obj) {
    var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        if (layEvent=== 'guest-Contract-btn') { //签约
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: ltitle,
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: data.Id,
                        tableid: "bill-main-table",
                        layerindex: index
                    });
                }
            });
        }
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
    function Ugenttemp(value) {
        if (value.Ugent == 2) {
            return '<div >' + "紧急" + '</div>'
        } 
        if (value.Ugent == 1) {
            return '<div >' + "正常" + '</div>'
        } 
        if (value.Ugent == 3) {
            return '<div >' + "延后" + '</div>'
        } 
        return '<div >' + "未知" + '</div>'
    }
    function Statustemp(value) {
        if (value.Ugent == 1) {
            return '<div >' + "待分配" + '</div>'
        } 
        if (value.Ugent == 2) {
            return '<div >' + "跟进中" + '</div>'
        } 
        if (value.Ugent == 3) {
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