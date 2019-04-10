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
    });
    InitwebiBill(0,"index-daishou-table",isloadmenu);
    //切换刷新数据
    element.on('tab(test1)', function(){
        debugger;
        var layid=this.getAttribute('lay-id');
        if(layid==222){ 
            debugger;
            isloadmenu=false;
            InitwebiBill(1,"index-daifu-table",isloadmenu);
          
        }
        if(layid=="333"){
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
        table.reload("index-daishou-table", { where: {"Status":result} });
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
            domid: ddomid, formid: "#zcontract-search-form", arr: [[ //表头
                { type: 'checkbox' }
              , { field: 'Id', width: 80, title: '编号' }
              , {  title: '到期时间', templet: formadaoqi,width: 120  }
              
              , { title: '收租时间',width: 120,templet:formatterreveice }
              , { width: 300, title: '房间', field: 'HouseName'}
              , { field: 'TeantName', width: 100, title: '租客姓名' }
              , { field: 'Amount', width: 120, title: '金额' }
        ]], height: 580, url: 'api/Bill/Querylist',
            ismuilti: true,search:{"BillType":Type}
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
            "realtable": "T_BILL"
        };
        doc.InitButton(BtnOption, guestbtnscribt, tableoption);
        //监听工具栏按钮
        table.on('tool(demoEvent)', function(obj) {
        var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
       });
        function formatterhouse(value) {
            var adress = "";
            if (value.HouseName != "" && value.HouseName != null) {
                adress +=value.HouseName;
            }
            return '<div>' + adress + '</div>'
        }
      
        
    }
    function Inittuizu() {
        var tableoption = {
            domid: "#index-tuifang-table", formid: "#zcontract-search-form", arr: [[ //表头
               { field: 'Id'  , width: 100, title: '合同编号' }
              , { field: 'Name', width: 100, title: '租客姓名' }
              , { width: 250, title: '所属房源', templet: formatterhouse }
              , { field: 'ContractTime', width: 170, title: '到期时间', templet: formattertime }
              , { field: 'Deposit', width: 80, title: '押金' }
              , { field: 'Recent', width: 80, title: '租金' }
           
              , { field: 'Phone', width: 180, title: '租客电话' }
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
                            tableid: "bill-main-table",
                            layerindex: index
                        });
                    }
                });
            }
            if (layEvent === 'zcontract-xuzu-btn') { //续租
                if(data.Status!=1&&data.Status!=5){
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
                            tableid: "bill-main-table",
                            layerindex: index
                        });
                    }
                });
            }
            doc.bindCommonEvents(BtnOption, data, layEvent, url);
     });  
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
           if (value.Status == 6) {
               return '<div><span style="padding:10px;background-color:#FF5722;color:#ffffff;border-radius:5px;">已到期</span></div>'
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
        var day = 0;
        
        if (value.ShouldReceive == null) {
            return '<span>' + "未知" + '</span>';
        }
        if (value.PayStatus == 1) {
            return '<span>' + util.toDateString(value.ShouldReceive.replace(/-/g, '/'), 'yyyy/MM/dd') + '</span>'
        } 
        var d1 = new Date(util.toDateString(value.ShouldReceive.replace(/-/g, '/'), 'yyyy/MM/dd'));
        var d2 = new Date(nowDate);
        var days = d1 - d2;
        day = parseInt(days / (1000 * 60 * 60 * 24));
        if (day == 0) {
            return '<span>' + "今日收款" + '</span>';
        }
        if (day < 0) {
            day=0-day;
            return '<span style="color:#ff5153">' + "逾期" + day + "天" + '</span>';
        }
        if (day > 0) {
            return '<span>' + day + "天后收款" + '</span>';
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