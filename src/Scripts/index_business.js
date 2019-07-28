layui.use(['table', 'htcsradio', 'echarts', 'htcsLG', 'laydate','carousel','element'], function () {
    var table = layui.table;
    var mymod = layui.htcsradio;
    debugger;
    var $ = layui.jquery;
    var util = layui.util;
    var doc = layui.htcsLG;
     var laytpl = layui.laytpl;
    var laydate = layui.laydate;
    var carousel = layui.carousel;
    var device = layui.device();
    var element = layui.element;
    var form = layui.form;
    var tableid="index-daishou-table";
    //库存选项
    var option = { data: null, rdefault: 1 };
    //逾期数据选项
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    //加载基础数据
    var nowDate = mymod.getnowdate("yyyy/MM/dd");
    //是否加载表菜单
    var isloadmenu=true;
    var chosedate;
    laydate.render({
        elem: '#billdate'
    });
    if ($("#billdate").val() == "") {
        chosedate = nowDate;
    }
    else {
        chosedate = $("#billdate").val();
    }
    var url = "api/Statistics/Query";
    //加载赋值数据
    initLoad(1, function (data, chartdata, datakucun) {
        debugger;
        //加载顶部数字统计
        InitTablekucun(datakucun);
        InitChart(chartdata);
        InitDaiban();
        InitNumber(data);
        InitwebiBill(0,"index-daishou-table",isloadmenu);
    });
 
    //切换刷新数据
    element.on('tab(test1)', function(){
        debugger;
        var layid=this.getAttribute('lay-id');
        if(layid==111){ 
            debugger;
            isloadmenu=false;
            tableid="index-daishou-table";
            $("#daishoubtn").show();
            InitwebiBill(0,"index-daishou-table",isloadmenu);
        }
        if(layid==222){ 
            debugger;
            isloadmenu=false;
            tableid="index-daifu-table";
            $("#daishoubtn").hide();
            Initybill();
        }
        if(layid=="333"){
            tableid="index-tuifang-table";
            $("#daishoubtn").hide();
            Inittuizu();
            
        }
        
     });
    mymod.CreateInput($("#housetype"), option, function (result) {
        debugger;
        initLoad(result, function (data, chartdata, datakucun) {
            debugger;
            InitTablekucun(datakucun);
            InitChart(chartdata);
        });
    });
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        debugger;
        table.reload(tableid, { where: {"yuqitype":result} });
    });
    function initLoad(housetype,callback) {
        doc.objectQuery(url, { date: chosedate, housetype: housetype }, function (result) {
            debugger;
            var data = result.numberData;
            var chartdata = [data.Stock.Vacancy10, data.Stock.Vacancy20, data.Stock.Vacancy30
      , data.Stock.Vacancyover30];
            var datakucun = [{
                "ALL": data.Stock.ALL
                 , "Configuration": data.Stock.Configuration
                 , "Vacancy": data.Stock.Vacancy
                 , "Rent": data.Stock.Rent
                 ,"RentPert":data.Stock.RentPert
            }];
            callback(data, chartdata, datakucun);
        });
    }
    function InitNumber(realdata) {
        debugger;
       
        var getTplcaiwu = indexcaiwuscript.innerHTML
        , viewcaiwu = document.getElementById('index-caiwu-view');
        laytpl(getTplcaiwu).render(realdata, function (html) {
            viewcaiwu.innerHTML = html;
        });
        var getTplyuding = indexyudingscript.innerHTML
        , viewyuding = document.getElementById('index-yuding-view');
        laytpl(getTplyuding).render(realdata, function (html) {
            viewyuding.innerHTML = html;
        });
         //轮播切换
       $('.layadmin-carousel').each(function(){
        var othis = $(this);
        carousel.render({
          elem: this
          ,width: '100%'
          ,arrow: 'none'
          ,interval: othis.data('interval')
          ,autoplay: othis.data('autoplay') === true
          ,trigger: (device.ios || device.android) ? 'click' : 'hover'
          ,anim: othis.data('anim')
        });
      });
       
    }
    function InitTablekucun(kucundata) {
        var tableoption = {
            domid: "#index-kucun-table", arr: [[
                { field: 'Content', title: '内容' }
                  , { field: 'Pdate', title: '待办日期' }
                  , { field: 'Status', title: '状态' }
       
                ]], height: 580, url: 'api/Bw/Query', done: function (res) {
                debugger;
                if (res.Code == 1001) {
                    var admin = layui.admin;
                    admin.events.logout();
                }
            }
        };
        doc.InitTable(tableoption);
        table.render({
            elem: '#index-kucun-table'
        , data: kucundata
        , cellMinWidth: 60 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        , cols: [[
        { field: 'ALL', title: '全部',width: 100 }
      , { field: 'Configuration', title: '配置中' ,width: 100}
      , { field: 'Vacancy', title: '空置中',width: 100 }
      , { field: 'Rent', title: '已出租',width: 100 }
      , {
          field: 'RentPert', width: 90,title: '空置率', templet: function (value) {
             
              return "<span style='color:red;font-size:larger;'>" + value.RentPert +"</span>"
          }
      }
        ]]
        });
    }
    function InitDaiban() {
        var tableoption = {
            domid: "#index-daiban-table", arr: [[
                { field: 'Content', title: '内容' }
                  , { field: 'Pdate', title: '待办日期' }
                  , { field: 'Status', title: '状态', templet: formastatus1  }
       
                ]], height: 580, url: 'api/Bw/Query'
        };
        doc.InitTable(tableoption);
        daibanevent();
    }
    function formastatus1(value) {
        if (value.Status == 0) {
            return '<span>' + "待办" + '</span>'
        } else {
            return '<span>已处理</span>'
        }
    }
    function daibanevent(){
        $("#daibanadd").click(function () {
            var editid="layuidaibanaddbtn";
            var view = layui.view;
            layer.open({
                id:editid,
                type: 1,
                title: '新增待办',
                skin: 'two-layer',
                //anim: 4,
                shadeClose: true,//开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1100px', '50%'],
                success: function(layero,index){
                    view(this.id).render($("#daibanadd").attr("hturl"), {
                        tableid:"index-daiban-table",
                        layerindex:index
                    });
                  }
                }); 
        });
    }
  
    function InitwebiBill(Type,table1,isloadmenu) {
        var ddomid="#"+table1;
        var nowDate = mymod.getnowdate("yyyy-MM-dd");
        var tableoption = {
            domid: ddomid, formid: "#guest-search-form1", arr: [[ //表头
                { type: 'checkbox' }
              , { field: 'Id', width: 80, title: '编号' }
              , {  field: 'Id',title: '到期时间', templet: formadaoqi,width: 120  }
              
              , {field: 'Id', title: '收租时间',width: 120,templet:formatterreveice }
              , { field: 'Id',width: 300, title: '房间', field: 'HouseName'}
              , { field: 'TeantName', width: 100, title: '租客姓名' }
              , { field: 'Amount', width: 120, title: '金额' }
        ]], height: 580, url: 'api/Bill/Querylist',
            ismuilti: true, "search":{"BillType":0,"PayStatus":0,"Object":2,"OrderbyTime":1},tablebtnid: '#btnintable',
        };
        var BtnOption = {
            area: ['900px', '90%'],
            tableid: table1,
            btnview: "bill-button-view",
            tableView: "bill-table-btn",
            toolview: 'bill-view-btn',
            tooladd: "bill-add-btn",
            tooledit: "bill-edit-btn",
            tooldelete:"bill-delete-btn",
            menuid: 108,
            isloadmenu:isloadmenu,
            "realtable": "T_BILL",
            url:'bill/z-bill/view',//查看界面路径
            formatterbtn:['formatterbtn']
        };
        doc.InitButton(BtnOption, billbtnscribt, tableoption);
        //监听工具栏按钮
        table.on('tool(demoEvent)', function(obj) {
        var data = obj.data,
            layEvent = obj.event,
            url = $(this).data('url');
            debugger;
        if (layEvent === 'bill-receivebtn') { //收款
            if(data.BillType!=0){
                layer.msg("不是收款单，无法进行收款操作");
                return;
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '收款',
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: data.Id,
                        tableid: table1,
                        layerindex: index,
                        btnOption:BtnOption
                    });
                }
            });
        }
        if (layEvent === 'signbill') { //标记账单
            var url="api/Procedure/signbill";
            var pdata={};
            pdata.Ids=data.Id;
            pdata.Other=data.PayStatus;
            doc.objectQuery(url, pdata, function (data) {
                debugger;
                if(data.Code==0){
                    layer.msg(data.Message, {
                        icon: 1,
                        time: 800 //2秒关闭（如果不配置，默认是3秒）
                    });
                doc.reflash(BtnOption.tableid,BtnOption);
                }else{
                    layer.open({
                        title: '温馨提示'
                        , content: data.Message
                    });
                }
            });
        }
        if (layEvent=== 'fukuan') { //处理账单
            if(data.BillType!=1&&data.BillType!=0){
                layer.msg("未知账单无法操作");
                return;
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            var lurl="";
            var ltitle="";
            if(data.BillType==1){
                lurl="bill/z-bill/fukuan";
                ltitle="付款";
            }
            if(data.BillType==0){
                lurl="bill/y-bill/receive";
                ltitle="收款";
            }
            layer.open({
                id: editid,
                type: 1,
                title: ltitle,
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
                success: function(layero, index) {
                    view(this.id).render(lurl, {
                        id: data.Id,
                        tableid: table1,
                        layerindex: index,
                        btnOption:BtnOption
                    });
                }
            });
        }
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
       });
       $("#bill-sendmessage-btn").click(function(){
        debugger;
            var checkStatus = table.checkStatus('index-daishou-table')
                    , getselect = checkStatus.data;
            if (getselect.length == 0) {
                layer.msg("请选择要处理的数据");
                return;
            }  
            var arrphone=[];
            $.each(getselect,function(index,value){
               var phone={};
               phone.Phone=value.Phone;
               phone.name=value.TeantName;
               arrphone.push(phone);
            });
            //调用发送短信接口
            var duanxinurl="api/Bill/pcuizu";
            doc.objectQuery(duanxinurl, arrphone, function (data) {
                debugger;
                if(data.Code==0){
                
                    layer.msg(data.Message, {
                        icon: 1,
                        time: 800 //2秒关闭（如果不配置，默认是3秒）
                    });
                }else{
                    layer.open({
                        title: '温馨提示'
                        , content: data.Message
                    });
                }
            });
    })
        function formatterhouse(value) {
            var adress = "";
            if (value.HouseName != "" && value.HouseName != null) {
                adress +=value.HouseName;
            }
            return '<div>' + adress + '</div>'
        }
      
        
    }
    function Initybill() {
        var tableoption = {
            domid: "#index-daifu-table",
            formid: "#guest-search-form1",
            arr: [
                [ //表头
                    { type: 'checkbox' }, { field: 'Id', width: 100, title: '编号' }, { field: 'TeantName',title: '到期时间', templet: formadaoqi, width: 150 }, {field: 'TeantName', title: '收租时间',width: 120,templet:formatterreveice },{field: 'TeantName', width: 200, title: '房间', field: 'HouseName' }, { field: 'TeantName', width: 100, title: '姓名' }, { field: 'Amount', width: 100, title: '金额' }
                ]
            ],
            url: 'api/Bill/Querylist',
            ismuilti: true,
            "tabfield": "PayStatus",
            tablebtnid: '#billbtnintable',
            "search":{"BillType":1,"PayStatus":0,"Object":2,"OrderbyTime":1}
        };
        var BtnOption = {
            area: ['900px', '90%'],
            tableid: "index-daifu-table",
            btnview: "ybill-button-view",
            tableView: "bill-table-btn",
            toolview: 'bill-view-btn',
            tooladd: "bill-add-btn",
            tooledit: "bill-edit-btn",
            tooldelete: "bill-delete-btn",
            url:'bill/z-bill/view',//查看界面路径
            menuid: 108,
            "realtable": "T_BILL",
            formatterbtn:['formatterbtn']
        };
        doc.InitButton(BtnOption, ybillbtnscribt , tableoption);
         //监听工具栏按钮
        table.on('tool(demoEvent2)', function(obj) {
        var data = obj.data,
            layEvent = obj.event,
            url = $(this).data('url');
            debugger;
        if (layEvent === 'bill-receivebtn') { //收款
            if(data.BillType!=0){
                layer.msg("不是收款单，无法进行收款操作");
                return;
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            layer.open({
                id: editid,
                type: 1,
                title: '收款',
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
                success: function(layero, index) {
                    view(this.id).render(url, {
                        id: data.Id,
                        tableid: "index-daifu-table",
                        layerindex: index,
                        btnOption:BtnOption
                    });
                }
            });
        }
        if (layEvent === 'signbill') { //标记账单
            var url="api/Procedure/signbill";
            var pdata={};
            pdata.Ids=data.Id;
            pdata.Other=data.PayStatus;
            doc.objectQuery(url, pdata, function (data) {
                debugger;
                if(data.Code==0){
                    layer.msg(data.Message, {
                        icon: 1,
                        time: 800 //2秒关闭（如果不配置，默认是3秒）
                    });
                doc.reflash(BtnOption.tableid,BtnOption);
                }else{
                    layer.open({
                        title: '温馨提示'
                        , content: data.Message
                    });
                }
            });
        }
        if (layEvent=== 'fukuan') { //处理账单
            if(data.BillType!=1&&data.BillType!=0){
                layer.msg("未知账单无法操作");
                return;
            }
            var editid = "layuibillreceivebtn";
            var view = layui.view;
            var lurl="";
            var ltitle="";
            if(data.BillType==1){
                lurl="bill/z-bill/fukuan";
                ltitle="付款";
            }
            if(data.BillType==0){
                lurl="bill/y-bill/receive";
                ltitle="收款";
            }
            layer.open({
                id: editid,
                type: 1,
                title: ltitle,
                skin: 'two-layer',
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['1000px', '90%'],
                success: function(layero, index) {
                    view(this.id).render(lurl, {
                        id: data.Id,
                        tableid: "index-daifu-table",
                        layerindex: index,
                        btnOption:BtnOption
                    });
                }
            });
        }
       
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
     $("#bill-sendmessage-btn").click(function(){
        debugger;
            var checkStatus = table.checkStatus('bill-main-table')
                    , getselect = checkStatus.data;
            if (getselect.length == 0) {
                layer.msg("请选择要处理的数据");
                return;
            }  
            var arrphone=[];
            $.each(getselect,function(index,value){
               var phone={};
               phone.Phone=value.Phone;
               arrphone.push(phone);
            });
            //调用发送短信接口
            var duanxinurl="api/Bill/pcuizu";
            doc.objectQuery(duanxinurl, arrphone, function (data) {
                debugger;
                if(data.Code==0){
                
                    layer.msg(data.Message, {
                        icon: 1,
                        time: 800 //2秒关闭（如果不配置，默认是3秒）
                    });
                }else{
                    layer.open({
                        title: '温馨提示'
                        , content: data.Message
                    });
                }
            });
    })
    $("#isnotactive").click(function() {
        // debugger;
        var url = "/api/Procedure/CmdProce";
        doc.cmdpure(url, "sp_peibei_trante0");
    });
        function formatterhouse(value) {
            var adress = value.CellName + "-" + value.BuildingNumber + "栋" + value.RoomId + "室";
            if (value.HouseName != "" && value.HouseName != null) {
                adress += "-" + value.HouseName;
            }
            return '<div>' + adress + '</div>'
        }
    
        function formatterzhouqi(value) {
            // debugger;
            if (value.BeginTime == null || value.EndTime == null) {
                return '<div>' + '</div>'
            }
            if (value.BeginTime == "0001-01-01 00:00:00" || value.EndTime == "0001-01-01 00:00:00") {
                return '<div>' + '</div>'
            }
            // debugger;
            var begintime = util.toDateString(value.BeginTime.replace(/-/g, '/'), 'yyyy/MM/dd');
            var endtime = util.toDateString(value.EndTime.replace(/-/g, '/'), 'yyyy/MM/dd');
            return '<div>' + begintime + " - " + endtime + '</div>';
        }
    
        
        function formasign(value) {
            debugger;
            var result="";
            var result1="";
            var retu=value.sign;
            if(value.stage!=0){
                retu+="-"+value.stage+"期"
            }
           
            if(value.PayStatus==5){
              
                result1='<span style="background-color: #FF5722;color:white;padding:3px;margin-left:2px;">暂停打款</span>'
            }
            result='<span>' +retu+ '</span>';
            return result+result1;
        }
        function formastatus(value) {
            if (value.Status ==1) {
                return '<span>' + "已逾期" + '</span>'
            } 
            if (value.Status ==2) {
                return '<span>' + "应处理" + '</span>'
            } 
            if (value.Status ==3) {
                return '<span>' + "待处理" + '</span>'
            } 
            if (value.Status ==4) {
                return '<span>' + "已处理" + '</span>'
            } 
            
        }
        function formatype(value) {
            if (value.BillType == 0) {
                return '<span>' + "收款单" + '</span>'
            } if (value.BillType ==1) {
                return '<span>' + "付款单" + '</span>'
            }
            if (value.BillType ==3) {
                return '<span>' + "退款单" + '</span>'
            }
            return '<span>' + "未知" + '</span>'
        }
       
    
        function formatterreveice(value) {
            if (value.ShouldReceive == null) {
                return "";
            }
            return util.toDateString(value.ShouldReceive, 'yyyy-MM-dd')
        }
    }
    function Inittuizu() {
        var tableoption = {
            domid: "#index-tuifang-table", formid: "#zcontract-search-form", arr: [[ //表头
               { field: 'Id'  , width: 100, title: '合同编号' }
              , { field: 'Name', width: 100, title: '租客姓名' }
              , { field: 'Phone', width: 150, title: '租客电话' }
              , { width: 170, title: '所属房源', templet: formatterhouse,field: 'ContractTime' }
              , { field: 'Status', width: 100, title: '状态', templet: formatterstatus,field: 'ContractTime' }
              , { field: 'ContractTime', width: 150, title: '到期时间', templet: formattertime,field: 'ContractTime' }
              ,{ field: 'Deposit', width: 80, title: '押金' }
              , { field: 'Recent', width: 80, title: '租金' }
           
           
        ]], height: 650, url: 'api/Contract/Query',
            ismuilti: true,"tabfield":"Status",tablebtnid: '#conbtnintable',search:{"Status":6}
        };
        var BtnOption = {
            area: ['1200px', '90%'],
            editarea: ['1200px', '90%'],
            tableid: "index-tuifang-table",
            ismuilti:true,
            btnview:  "zcontract-button-view",
            toolview: "zcontract-view-btn",
            tooladd:  "zcontract-add-btn",
            tooledit: "zcontract-edit-btn",
            tooldelete:"zcontract-delete-btn",
            deletespname:"sp_deletecontract",
            menuid:165
        };
        doc.InitButton(BtnOption, zcontractbtnscribt, tableoption);
        //监听工具栏按钮
        table.on('tool(demoEvent1)', function(obj) {
        var data = obj.data,
            layEvent = obj.event,
            url = $(this).data('url');
            debugger;
            if (layEvent === 'zcontract-tuizu-btn') { //退租
                if(data.Status!=1&&data.Status!=5&&data.Status!=6){
                    layer.msg("合同状态不为待签约和在租中不能进行退租操作");
                    return;
                }
                var editid="layuizcontracttuizubtn";
                var view = layui.view;
                layer.open({
                    id: editid,
                    type: 1,
                    title: '退租',
                    skin: 'two-layer',
    
                    //anim: 4,
                    shadeClose: true, //开启遮罩关闭
    
                    maxmin: true, //开启最大化最小化按钮
                    area: ['1000px', '90%'],
                    success: function(layero, index) {
                        view(this.id).render(url, {
                            id: data.Id,
                            tableid: "index-tuifang-table",
                            layerindex: index
                        });
                    }
                });
            }
            if (layEvent === 'zcontract-xuzu-btn') { //续租
                if(data.Status!=1&&data.Status!=5&&data.Status!=6){
                    layer.msg("合同状态不为待签约和在租中不能进行续租操作");
                    return;
                }
                var editid="layuizcontracttuizubtn";
                var view = layui.view;
                layer.open({
                    id: editid,
                    type: 1,
                    title: '续租',
                    skin: 'two-layer',
    
                    //anim: 4,
                    shadeClose: true, //开启遮罩关闭
    
                    maxmin: true, //开启最大化最小化按钮
                    area: ['1000px', '90%'],
                    success: function(layero, index) {
                        view(this.id).render(url, {
                            id: data.Id,
                            tableid: "index-tuifang-table",
                            layerindex: index
                        });
                    }
                });
            }
            doc.bindCommonEvents(BtnOption, data, layEvent, url);
     });  
     
    function formatterhouse(value) {
           var adress="";
           if(value.HouseName!=""&&value.HouseName!=null){
               adress+=value.HouseName;
           }
           return '<div>' + adress + '</div>'
       }
       function formattertime(value) {
        
           return '<div>'+ util.toDateString(value.EndTime,'yyyy年MM月dd日') + '</div>';
    }
    function formatterpinlv(value) {
        return '<div>' +value.Pinlv + '月一付</div>';
    }
    }
    function InitChart(chartdata) {
        var layecharts = layui.echarts;
        var myChart = layecharts.init(document.getElementById('index-kucun-chart'));
        // 指定图表的配置项和数据
        var option3 = {
            title: {
                text: '空置天数'
            },
            tooltip: {},
            legend: {
                data: ['空置天数']
            },
            xAxis: {
                data: ["<10天", "11-20天", "21-30天", ">30天"]
            },
            yAxis: {},
            series: [{
                name: '天数',
                type: 'bar',
                data: chartdata
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option3);
    }
    $("#bill-sendmessage-btn").click(function(){
            debugger;
            var checkStatus = table.checkStatus('index-daishou-table'),getselect = checkStatus.data;
            if (getselect.length == 0) {
                layer.msg("请选择要处理的数据");
                return;
            }  
            var arrphone=[];
            $.each(getselect,function(index,value){
               var phone={};
               phone.Phone=value.Phone;
               phone.name=value.TeantName;
               arrphone.push(phone);
            });
            //调用发送短信接口
            var duanxinurl="api/Bill/pcuizu";
            doc.objectQuery(duanxinurl, arrphone, function (data) {
                debugger;
                if(data.Code==0){
                
                    layer.msg(data.Message, {
                        icon: 1,
                        time: 800 //2秒关闭（如果不配置，默认是3秒）
                    });
                }else{
                    layer.open({
                        title: '温馨提示'
                        , content: data.Message
                    });
                }
            });
    })
    function formatterhouse(value) {
        var adress = value.CellName + "-" + value.BuildingNumber + "栋" + value.RoomId + "室";
        if (value.HouseName != "" && value.HouseName != null) {
            adress += "-" + value.HouseName;
        }
        return '<div>' + adress + '</div>'
    }
    function formatterzhouqi(value) {
        debugger;
        if(value.BeginTime==null||value.EndTime==null){
            return '<div>'+'</div>'
        }
        if(value.BeginTime=="0001-01-01 00:00:00"||value.EndTime=="0001-01-01 00:00:00"){
            return '<div>'+'</div>'
        }
        debugger;
        var begintime=util.toDateString(value.BeginTime, 'yyyy-MM-dd');
        var endtime=util.toDateString(value.EndTime, 'yyyy-MM-dd');
        return '<div>' + begintime+" - "+endtime + '</div>';
    }
    
    function formadaoqi(value) {
        // debugger;
        var day = value.Day;
        
        if (value.ShouldReceive == null) {
            return '<span>' + "未知" + '</span>';
        }
        if (value.PayStatus == 1) {
            return '<span>' + util.toDateString(value.BeginTime.replace(/-/g, '/'), 'yyyy/MM/dd') + '</span>'
        } 
       
        if (day == 0) {
            return '<span>' + "今日" + '</span>';
        }
        if (day > 0) {
           
            return '<span style="color:#ff5153">' + "逾期" + day + "天" + '</span>';
        }
        if (day < 0) {
            day=0-day;
            return '<span>' + day + "天后" + '</span>';
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
       return  util.toDateString(value.ShouldReceive.replace(/-/g, '/'), 'yyyy/MM/dd')
    }
});
function formatterbtn(value,field,name){
    debugger;
     if(field=="signbill"){
        if(value.PayStatus==0){
            return "标记暂停打款";
        }
        if(value.PayStatus==5){
         return "恢复正常打款";
        }
        return name;
     }
     if(field=="fukuan"){
        if(value.sign=="租客退款"){
            return "租客退款";
        }
        if(value.sign=="业主退款"){
            return "业主退款";
        }
       if(value.BillType==0){
           return "收款";
       }
       if(value.BillType==1){
        return "付款";
       }
       return name;
    }
     return name;
 }
function formatterstatus(value) {
    //0 不限 1预订 4待搬入 5在租 6已到期 7 已退租 8以作废 9 财务审核中
    if (value.Status ==1) {
        return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">待签约</span></div>'
    }	
   if (value.Status == 4) {
       return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">待搬入</span></div>'
   }
   if (value.Status == 5) {
       return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">在租中</span></div>'
   }
   if (value.Status == 2) {
      return '<div><span style="padding:10px;background-color:#1bb974;color:#ffffff;border-radius:5px;">在租中</span></div>'
   }
   if (value.Status == 6) {
       if(value.Day>0){
        return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">逾期'+value.Day+'天</span></div>'
       }
       if(value.Day<0){
        value.Day=0-value.Day;
        return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">'+value.Day+'天后</span></div>'
       }
       if(value.Day==0){
        return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">今天到期</span></div>'
       }
       return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">即将到期</span></div>'
   }
   if (value.Status == 7) {
       return '<div><span style="padding:10px;background-color:#c2c2c2;color:#ffffff;border-radius:5px;">已退租</span></div>'
   }
   if (value.Status == 8) {
       return '<div><span style="padding:10px;background-color:#c2c2c2;color:#ffffff;border-radius:5px;">已作废</span></div>'
   }
   if (value.Status == 9) {
       return '<div><span style="padding:10px;background-color:#FFB800;color:#ffffff;border-radius:5px;">退租中</span></div>'
   }
}