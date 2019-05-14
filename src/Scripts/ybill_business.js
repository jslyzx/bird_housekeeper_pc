// debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate', 'form', 'util'], function() {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy/MM/dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var form = layui.form;
    var table = layui.table;
    laydate.render({
        elem: '#BeginTime'
    });
    laydate.render({
        elem: '#EndTime'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function(result) {
    });
    var tableoption = {
        domid: "#bill-main-table",
        formid: "#bill-search-form",
        arr: [
            [ //表头
                { type: 'checkbox' }, { field: 'Id', width: 100, title: '编号' }, { title: '应付时间', templet: formadaoqi, width: 150 }, { title: '账单周期', width: 200, templet: formatterzhouqi }, { width: 250, title: '房间', field: 'HouseName' }, { field: 'TeantName', width: 100, title: '租客姓名' }, { field: 'Phone', width: 120, title: '租客电话' }, { field: 'Amount', width: 100, title: '金额' }, {  templet: formasign, width:200, title: '标记' },{  field: 'Remark', width:100, title: '备注' }
            ]
        ],
        url: 'api/Bill/Querylist',
        ismuilti: true,
        "tabfield": "PayStatus",
        tablebtnid: '#billbtnintable',
        "search":{"BillType":1,"PayStatus":0,"Object":2,"OrderbyTime":1}
    };
    //查询条件
    form.on('select(Type)', function(data){
        debugger;
        var tableid = tableoption.domid.replace("#", "");
        doc.queryPara({"BillType":1},tableid);
    });  
    form.render('');
    // doc.InitTable(tableoption);
    
    var BtnOption = {
        area: ['900px', '90%'],
        tableid: "bill-main-table",
        btnview: "bill-button-view",
        tableView: "bill-table-btn",
        toolview: 'bill-view-btn',
        tooladd: "bill-add-btn",
        tooledit: "bill-edit-btn",
        tooldelete: "bill-delete-btn",
        menuid: 108,
        url:'bill/y-bill/view',//查看界面路径
        "realtable": "T_BILL",
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
                        tableid: "bill-main-table",
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
                        tableid: "bill-main-table",
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
            return '<span>' + "今日收款" + '</span>';
        }
        if (day > 0) {
           
            return '<span style="color:#ff5153">' + "逾期" + day + "天" + '</span>';
        }
        if (day < 0) {
            day=0-day;
            return '<span>' + day + "天后收款" + '</span>';
        }
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