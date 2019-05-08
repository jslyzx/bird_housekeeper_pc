// debugger;
function LoadData(id,tableid,layerindex){
    layui.use(['table', 'htcsradio', 'htcsLG', 'laydate', 'form','laytpl', 'util'], function() {
        var util = layui.util;
        var laytpl = layui.laytpl;
        var $ = layui.$;
        var mymod = layui.htcsradio;
        var nowDate = mymod.getnowdate("yyyy-MM-dd");
        var doc = layui.htcsLG;
        var laydate = layui.laydate;
        var form = layui.form;
        var table = layui.table;
        var clos=[[ 
            { field: 'Id' , width: 80, title: '编号' }
            , { field: 'HouseName', width: 200, title: '房间' }
            , { field: 'profit', width: 100, title: '收益'}
            , { field: 'vacant', width: 200, title: '空置天数'}
            , { field: 'updatetime', width: 200, title: '上次更新时间'}
            ]];
        var tableoption = {
            domid: "#bill-main-table",
            formid: "#bill-search-form",
            arr: clos,
            height:500,
            url: 'api/baobiaochild/Query',
            ismuilti: true,
            "tabfield": "PayStatus",
            tablebtnid: '#billbtnintable',
            "search":{"housereportid":id}
        };
        form.render('');
        var BtnOption = {
            area: ['900px', '90%'],
            tableid: "bill-main-table",
            btnview: "bill-button-view",
            tableView: "bill-table-btn",
            toolview: 'Renovationelistview',
            tooladd: "bill-add-btn",
            tooledit: "Renovationelistedit",
            tooldelete: "bill-delete-btn",
            menuid: 888,
            "realtable": "T_BILL",
            btnjishu:2
        };
        doc.InitButton(BtnOption, billbtnscribt, tableoption);
       
      
        function formastatus(value) {
            if (value.status == 1) {
                return '<span>' + "未审核" + '</span>'
            } 
            if (value.status == 2) {
                return '<span>' + "审核失败" + '</span>'
            } 
            if (value.status == 3) {
                return '<span>' + "审核成功" + '</span>'
            } 
        }
        
      
    
      
    
    
    });
    }