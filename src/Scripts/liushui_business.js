debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util','multiSelect'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy/MM/dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var form = layui.form;
    var table = layui.table;
    var multiSelect = layui.multiSelect;
      // 三级联动数据
      var leftFilter = {
        currentProvince: '',
        currentCity: '',
        currentArea: '',
        provinceOptions: [],
        cityOptions: [],
        areaOptions: [],
        provinceList: [],
        cityList: [],
        areaList: []
    }
    var filterUrl = 'api/Formatter/QueryPCCell1';
    initFilter();

    function initFilter(){
      doc.objectQuery(filterUrl, {"Type": '0'}, function (data) {
          var provinceList = data.numberData;
          var cityList = [];
          var provinceOptions = [];
          var currentProvince = leftFilter.currentProvince;
          for (var i in provinceList) {
              cityList = provinceList[i].mallCityList; 
              provinceOptions.push('<option value="'+ provinceList[i].provinceName +'">'+ provinceList[i].provinceName +'</option>');
          }
          leftFilter.provinceOptions  = provinceOptions;
          leftFilter.cityList = cityList;
          leftFilter.provinceList = provinceList;
          selectProvince();
          $('select[name="CityName"]').append(leftFilter.provinceOptions.join(''));
          $('select[name="AreaName"]').append(leftFilter.cityOptions.join(''));
          // $('.area-list').append(leftFilter.areaOptions.join(''))
          form.render();
      })
    }

    form.on('select(CityName)', function (data) {
        leftFilter.currentProvince = data.value;
        for (let i in leftFilter.provinceList) {
            if (leftFilter.currentProvince === leftFilter.provinceList[i].provinceName) {
                leftFilter.cityList = leftFilter.provinceList[i].mallCityList;
            }
        }
        selectProvince();
        $('select[name="AreaName"]').html(leftFilter.cityOptions.join(''));
        form.render();
        $('#guest-search-form button[lay-filter="search"]').click();
    })

    
    form.on('select(AreaName)', function (data) {
        leftFilter.currentCity = data.value;
        for (let i in leftFilter.cityList) {
            if (leftFilter.currentCity === leftFilter.cityList[i].cityName) {
                leftFilter.areaList = leftFilter.cityList[i].mallAreaList;
            }
        }
        selectCity();
        $('select[name="CellName2"]').html(leftFilter.areaOptions.join(''));
        form.render();
        multiSelect.init();
        $('#guest-search-form button[lay-filter="search"]').click();
    })

    form.on('select(CellName)', function (data) {
      var vals = []
      $('.layui-form-checked span').each(function() {
        vals.push($(this).text());
      })
      $('#CellName').val(vals.join(','));
      $('#guest-search-form button[lay-filter="search"]').click();
    })
    form.on('select(Source)', function (data) {
      $('#guest-search-form button[lay-filter="search"]').click();
    })
    form.on('select(CostName)', function (data) {
        $('#guest-search-form button[lay-filter="search"]').click();
    })
    form.on('select(PayType)', function (data) {
        $('#guest-search-form button[lay-filter="search"]').click();
    })
    function selectProvince () {
            var provinceList = leftFilter.provinceList;
            var currentProvince =  leftFilter.currentProvince;
            var cityList = leftFilter.cityList;
            var cityOptions = [];
            var currentCity = '';
            var areaList = [];
            areaList = getAreaList();
            cityOptions.push('<option value="">请选择</option>');
            for (var i in cityList) {
                cityOptions.push('<option value="'+ cityList[i].cityName +'">'+ cityList[i].cityName +'</option>')
            }
            
            leftFilter.areaList = areaList;
            leftFilter.cityOptions = cityOptions;

            selectCity();
        }

        function getAreaList () {
            var cityList = leftFilter.cityList;
            var areaList = [];
            for (var i in cityList) {
                areaList = [].concat(areaList, cityList[i].mallAreaList || []);
            }
            return areaList;
        }

        function selectCity () {
            var areaList = leftFilter.areaList;
            var cityList = leftFilter.cityList;
            var areaOptions = [];
            var currentArea = '';
            areaOptions.push('<option value="">请选择</option>');
            for (var i in areaList) {
                areaOptions.push('<option value="'+ areaList[i].areaName +'">'+ areaList[i].areaName +'</option>')
            }
            
            leftFilter.areaOptions = areaOptions;
        }
    laydate.render({
        elem: '#BeginTime'
    });
    laydate.render({
        elem: '#EndTime'
    });
    var option1 = { data: [{ "value": 0, "text": "全部" }, { "value": 2, "text": "逾期" }, { "value": 3, "text": "今天" }, { "value": 4, "text": "1-7天" }], rdefault: 0 };
    mymod.CreateInput($("#yuqitype"), option1, function (result) {
        
    });
    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/Finance/Querylist"
,btnview:"guest-button-view",toolview:"guest-view-btn",tooladd:"addls",tooledit:"guest-edit-btn",tooldelete:"deletels",tabfield:"Status"};
    var tableoption = {
        tabfield:config.tabfield,
        domid: config.tableid, formid:config.formid, arr: [[ //表头
    { type: 'checkbox' }
    , { field: 'Id', width: 100, title: '编号' },
  { field: 'PayMentNumber', width: 120, title: '支付流水号' },
  { field: 'CostName', width: 100, title: '费用名称	' },
  { field: 'Amount', width: 100, title: '交易金额' },
  { field: 'TYPE', width: 100, title: '收支类型' ,templet: Ugenttemp},
  { field: 'TradingDate', width: 200, title: '交易时间' },
  { field: 'PayType', width: 100, title: '支付方式' },
  { field: 'Transaoctor', width: 100, title: '办理人' },
  { field: 'HouseName', width: 200, title: '房源' },
  { field: 'Remark', width: 180, title: '备注' }
 
]], url: config.url,ismuilti: true
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
    debugger;
    doc.InitButton(BtnOption, guestbtnscribt, tableoption);
     //监听工具栏按钮
    table.on('tool(demoEvent)', function(obj) {
    var data = obj.data,
        layEvent = obj.event,
        url = $(this).data('url');
        doc.bindCommonEvents(BtnOption, data, layEvent, url);
    });
    function Ugenttemp(value) {
        if (value.Type == 2) {
            return '<div >' + "支出" + '</div>'
        } 
        if (value.Type == 1) {
            return '<div>' + "收入" + '</div>'
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