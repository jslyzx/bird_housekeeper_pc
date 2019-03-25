debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate', 'form', 'util'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var form = layui.form;
    var table = layui.table;
    laydate.render({
        elem: '#ShouldReceive'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var tableoption = {
        domid: "#bill-main-table", formid: "#bill-search-form", arr: [[ //表头
    { type: 'checkbox' }
  , { field: 'Id', width: 100, title: '编号' }
  , { field: 'housename', width: 200, title: '地址' }
  , { field: 'project', width: 120, title: '费用项' }
  , { field: 'lasttime', width: 180, title: '上次抄表时间' }
  , { field: 'lastdushu', width: 180, title: '读数' }
  , { field: 'HouseType', width: 180, title: '抄表类型',templet:chaobiao }
  , { field: 'HouseType', width: 180, title: '频率',templet:pinlv }
        ]], height: 'full-230', url: 'api/chaobiao/Query',
        ismuilti: true,"tabfield":"PayStatus"
    };
   
    var BtnOption = {
        area: ['900px', '70%'],
        tableid: "bill-main-table",
        btnview: "bill-button-view",
        tableView: "bill-table-btn",
        toolview:'chaobiao',
        url:'bill/chaobiao/add',
        tooladd: "",
        tooledit: "chaobiao",
        tooldelete: "deletec",
        menuid:190
        ,"realtable":"T_OTHERFEE"
    };
   doc.InitButton(BtnOption, billbtnscribt, tableoption);
    //监听工具栏按钮
   table.on('tool(demoEvent)', function(obj) {
   var data = obj.data,
       layEvent = obj.event,
       url = $(this).data('url');
       doc.bindCommonEvents(BtnOption, data, layEvent, url);
   });    
   
        $("#isnotactive").click(function () {
            debugger;
            var url = "/api/Procedure/CmdProce";
            doc.cmdpure(url, "sp_peibei_trante0");
        });
        $('.layui-tab-content').on('click', '.layui-btn-group .layui-btn', function (e) {
            e.stopPropagation();
            let menuPanel = $(this).parent().find('.layui-dropdown-menu');
            let offsetTop = $(this).offset().top;
            let offsetLeft = $(this).offset().left;
            let offsetWidth = $(this).outerWidth();
            let offsetHeight = $(this).outerHeight();
            let menuWidth = menuPanel.width();
            let isShow = menuPanel.css('display') !== 'none';
            if (isShow) {
                menuPanel.removeAttr('show');
                menuPanel.css({
                    display: 'none'
                })
            } else {
                menuPanel.attr('show', true);
                menuPanel.css({
                    position: 'fixed',
                    left: offsetLeft + (offsetWidth / 2) + 'px',
                    top: (offsetTop + offsetHeight) + 'px',
                    display: 'flex'
                })
            }            
        })

      
      
       
        function formatterhouse(value) {
            var adress = value.CellName + "-" + value.BuildingNumber + "栋" + value.RoomId + "室";
            if (value.HouseName != "" && value.HouseName != null) {
                adress += "-" + value.HouseName;
            }
            return '<div>' + adress + '</div>'
        }
        function chaobiao(value) {
            if (value.HouseType == 1) {
                return '<span>' + "整租抄表" + '</span>'
            } 
            if (value.HouseType == 2) {
                return '<span>' + "合租抄表" + '</span>'
            } 
            if (value.HouseType == 3) {
                return '<span>' + "独栋抄表" + '</span>'
            } 
        }
        function pinlv(value) {
            if (value.pinlv == 0) {
                return '<span>' + "随租金结算" + '</span>'
            } else{
                return '<span>'+ value.pinlv+ "月一抄" + '</span>'
            }
        }
        
        function formadaoqi(value) {
            debugger;
            var day=0;
                      
            if(value.ShouldReceive == null){
                return '<span>' + "未知" + '</span>';
            }
            var d1 = new Date(util.toDateString(value.ShouldReceive, 'yyyy-MM-dd'));
            var d2 = new Date(nowDate);
            var days = d1-d2; 
            day= parseInt(days / (1000 * 60 * 60 * 24)); 
            if(day == 0){
                return '<span>' + "今日收款" + '</span>';
            }
            if (day< 0) {          
                return '<span style="color:#ff5153">' + "逾期"+day+"天" + '</span>';
            } 
            if (day>0) {
                return '<span>' +day+ "天后收款" + '</span>';
            } 
        }
        function formastatus(value) {
            if (value.Status == 0) {
                return '<span>' + "未支付" + '</span>'
            } else {
               
                return '<span>已支付</span>'
            }
        }
        function formatterreveice(value)
        {
            if(value.ShouldReceive==null){
                return "";
            }
           return  util.toDateString(value.ShouldReceive, 'yyyy-MM-dd')
        }

      
});