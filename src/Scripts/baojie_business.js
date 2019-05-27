debugger;
layui.use(['table', 'htcsradio', 'htcsLG', 'laydate','util','multiSelect'], function () {
    var util = layui.util;
    var $ = layui.$;
    var mymod = layui.htcsradio;
    var nowDate = mymod.getnowdate("yyyy-MM-dd");
    var doc = layui.htcsLG;
    var laydate = layui.laydate;
    var table = layui.table;
    var form = layui.form;
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
          $('select[name="cityname"]').append(leftFilter.provinceOptions.join(''));
          $('select[name="areaname"]').append(leftFilter.cityOptions.join(''));
          // $('.area-list').append(leftFilter.areaOptions.join(''))
          form.render();
      })
    }

    form.on('select(cityname)', function (data) {
        leftFilter.currentProvince = data.value;
        for (let i in leftFilter.provinceList) {
            if (leftFilter.currentProvince === leftFilter.provinceList[i].provinceName) {
                leftFilter.cityList = leftFilter.provinceList[i].mallCityList;
            }
        }
        selectProvince();
        $('select[name="areaname"]').html(leftFilter.cityOptions.join(''));
        form.render();
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
    form.on('select(areaname)', function (data) {
        leftFilter.currentCity = data.value;
        for (let i in leftFilter.cityList) {
            if (leftFilter.currentCity === leftFilter.cityList[i].cityName) {
                leftFilter.areaList = leftFilter.cityList[i].mallAreaList;
            }
        }
        selectCity();
        $('select[name="cellname"]').html(leftFilter.areaOptions.join(''));
        form.render();
        multiSelect.init();
        $('#guest-search-form button[lay-filter="search"]').click();
    })

    form.on('select(cellname)', function (data) {
      var vals = []
      $('.layui-form-checked span').each(function() {
        vals.push($(this).text());
      })
      $('#cellname').val(vals.join(','));
      $('#guest-search-form button[lay-filter="search"]').click();
    })


    form.on('select(ugent)', function (data) {
      $('#guest-search-form button[lay-filter="search"]').click();
    })
    form.on('select(RecentType)', function (data) {
        $('#guest-search-form button[lay-filter="search"]').click();
    })
   

    var config={tableid:"#guest-main-table",table:"guest-main-table",formid:"#guest-search-form",url:"api/clean/Querylist"
,btnview:"guest-button-view",toolview:"editbaojie",tooladd:"addbaojie",tooledit:"editbaojie",tooldelete:"addbaojie",tabfield:"status"};
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