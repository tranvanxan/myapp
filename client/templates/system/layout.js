//Client

Template.Template_Layout.events({
    //Tạo nút ẩn hiện vùng con có class collapse-link
    "click .collapse-link": function (event, template) {
        $(event.target).toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        var ibox = $(event.target).closest('div.ibox');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    },
    //Tạo nút tắt vùng con có class collapse-link
    "click .close-link" : function (event, template) {
        var content = $(event.target).closest('div.ibox');
        content.remove();
    }
});

Template.Template_Layout.rendered = function() {
    //Khai báo hiển thị thông báo toastr
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    //Tìm tất cả Checkbox có class js-switch thì chuyển nó qua dạng switchery
    var js_switch = Array.prototype.slice.call(document.querySelectorAll('.js-switch-green'));
    js_switch.forEach(function(html) {
        var switchery = new Switchery(html, {className:"switchery", color: '#1AB394'});
    });
    js_switch = Array.prototype.slice.call(document.querySelectorAll('.js-switch-red'));
    js_switch.forEach(function(html) {
        var switchery = new Switchery(html, {className:"switchery", color: '#ED5565'});
    });
    js_switch = Array.prototype.slice.call(document.querySelectorAll('.js-switch-green-small'));
    js_switch.forEach(function(html) {
        var switchery = new Switchery(html, {className:"switchery-small", color: '#1AB394'});
    });
    js_switch = Array.prototype.slice.call(document.querySelectorAll('.js-switch-red-small'));
    js_switch.forEach(function(html) {
        var switchery = new Switchery(html, {className:"switchery-small", color: '#ED5565'});
    });

    // Tạo hiệu ứng cho main menu
    $('#side-menu').metisMenu();

    // Tạo thanh cuộn cho main menu
    $(window).bind("load", function () {
        if ($("body").hasClass('fixed-sidebar')) {
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    });

    // Phóng to - thu nhỏ main menu
    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });

    // Ẩn hiện menu người dùng
    $('.right-sidebar-toggle').click(function(){
        $('#right-sidebar').toggleClass('sidebar-open');
    });

    // Tạo thanh cuộn cho menu người dùng
    $('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // Dy chuyển modal vào thẻ body
    $('.modal').appendTo("body");

    // Điều chỉnh main menu, thanh điều hướng, khung nội dung
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if(navbarHeigh > wrapperHeigh){
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if(navbarHeigh < wrapperHeigh){
            $('#page-wrapper').css("min-height", $(window).height()  + "px");
        }

    }
    fix_height();

    // Nếu main menu đang bật chức năng cố định thì tự động tạo thanh cuộn cho nó
    $(window).scroll(function(){
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav') ) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    //Tự điều chỉnh main menu, thanh điều hướng, khung nội dung khi có thao tác load, resize hoặc scroll
    $(document).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    //Tạo hiệu ứng chú giải nhỏ cho các đối tượng có thuộc tính data-toggle=popover
    $("[data-toggle=popover]").popover();


    // Thêm thanh cuộn cho đối tượng có class .full-height-scroll
    $('.full-height-scroll').slimscroll({
        height: '100%'
    });

    //Hàm tạo hiệu ứng mượt cho main menu
    function SmoothlyMenu() {
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 300);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    }

    //Hàm dy chuyển vùng con trong khung nội dung
    function WinMove() {
        var element = "[class*=col]";
        var handle = ".ibox-title";
        var connect = "[class*=col]";
        $(element).sortable(
            {
                handle: handle,
                connectWith: connect,
                tolerance: 'pointer',
                forcePlaceholderSize: true,
                opacity: 0.8
            })
            .disableSelection();
    }

    // Hàm kiểm tra trình duyệt có hổ trợ HTML 5 để lưu trữ cục bộ các biến
    function localStorageSupport() {
        return (('localStorage' in window) && window['localStorage'] !== null)
    }

    //---------------------------------Theme-Config----------------------------------------------
    //Hiện thông báo
    $('#showalert').click(function () {
        if ($('#showalert').is(':checked')) {
            if (LocalStorageOk()) {
                localStorage.showalert = 'on';
            }
        } else{
            if (LocalStorageOk()) {
                localStorage.showalert = 'off';
            }
        }
    });
    //Giữ thanh điều hướng
    $('#fixednavbar').click(function () {
        if ($('#fixednavbar').is(':checked')) {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            $("body").removeClass('boxed-layout');
            $("body").addClass('fixed-nav');
            $('#boxedlayout').prop('checked', false);
            if (LocalStorageOk()) {
                localStorage.boxedlayout='off';
            }
            if (LocalStorageOk()) {
                localStorage.fixednavbar='on';
            }
        } else {
            $(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
            $("body").removeClass('fixed-nav');
            if (LocalStorageOk()) {
                localStorage.fixednavbar='off';
            }
        }
    });
    // Giữ yên main menu
    $('#fixedsidebar').click(function () {
        if ($('#fixedsidebar').is(':checked')) {
            $("body").addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
            if (LocalStorageOk()) {
                localStorage.fixedsidebar='on';
            }
        } else {
            $('.sidebar-collapse').slimscroll({destroy: true});
            $('.sidebar-collapse').attr('style', '');
            $("body").removeClass('fixed-sidebar');
            if (LocalStorageOk()) {
                localStorage.fixedsidebar='off';
            }
        }
    });
    // Thu gọn main menu
    $('#collapsemenu').click(function () {
        if ($('#collapsemenu').is(':checked')) {
            $("body").addClass('mini-navbar');
            SmoothlyMenu();
            if (LocalStorageOk()) {
                localStorage.collapse_menu='on';
            }
        } else {
            $("body").removeClass('mini-navbar');
            SmoothlyMenu();
            if (LocalStorageOk()) {
                localStorage.collapse_menu='off';
            }
        }
    });
    // Thu gọn cửa sổ
    $('#boxedlayout').click(function () {
        if ($('#boxedlayout').is(':checked')) {
            $("body").addClass('boxed-layout');
            $('#fixednavbar').prop('checked', false);
            $(".navbar-fixed-top").removeClass('navbar-fixed-top').addClass('navbar-static-top');
            $("body").removeClass('fixed-nav');
            $(".footer").removeClass('fixed');
            $('#fixedfooter').prop('checked', false);
            if (LocalStorageOk()) {
                localStorage.fixednavbar='off';
            }
            if (LocalStorageOk()) {
                localStorage.fixedfooter='off';
            }
            if (LocalStorageOk()) {
                localStorage.boxedlayout='on';
            }
        } else {
            $("body").removeClass('boxed-layout');
            if (LocalStorageOk()) {
                localStorage.boxedlayout='off';
            }
        }
    });
    // Giữ thanh trạng thái
    $('#fixedfooter').click(function () {
        if ($('#fixedfooter').is(':checked')) {
            $('#boxedlayout').prop('checked', false);
            $("body").removeClass('boxed-layout');
            $(".footer").addClass('fixed');
            if (LocalStorageOk()) {
                localStorage.boxedlayout='off';
            }
            if (LocalStorageOk()) {
                localStorage.fixedfooter='on';
            }
        } else {
            $(".footer").removeClass('fixed');
            if (LocalStorageOk()) {
                localStorage.fixedfooter='off';
            }
        }
    });

    // Màu sắc
    $('.spin-icon').click(function () {
        $(".theme-config-box").toggleClass("show");
    });

    // Màu mặc định
    $('.s-skin-0').click(function () {
        $("body").removeClass("skin-1");
        $("body").removeClass("skin-2");
        $("body").removeClass("skin-3");
        localStorage.skinstyle=null;
    });
    // Màu xanh / trắng
    $('.s-skin-1').click(function () {
        $("body").removeClass("skin-2");
        $("body").removeClass("skin-3");
        $("body").addClass("skin-1");
        localStorage.skinstyle='skin-1';
    });
    // Màu xanh / xám
    $('.s-skin-2').click(function () {
        $("body").removeClass("skin-1");
        $("body").removeClass("skin-3");
        $("body").addClass("skin-2");
        localStorage.skinstyle='skin-2';
    });
    // Màu vàng / đỏ tía
    $('.s-skin-3').click(function () {
        $("body").removeClass("skin-1");
        $("body").removeClass("skin-2");
        $("body").addClass("skin-3");
        localStorage.skinstyle='skin-3';
    });

    //Lấy lại các thông số về theme config để hiển thị nút trong bản theme config
    if (LocalStorageOk()) {
        var showalert = localStorage.showalert;
        var collapse = localStorage.collapse_menu;
        var fixedsidebar = localStorage.fixedsidebar;
        var fixednavbar = localStorage.fixednavbar;
        var boxedlayout = localStorage.boxedlayout;
        var fixedfooter = localStorage.fixedfooter;
        if (showalert == 'on') {
            $('#showalert').prop('checked','checked')
        }
        if (collapse == 'on') {
            $('#collapsemenu').prop('checked','checked')
        }
        if (fixedsidebar == 'on') {
            $('#fixedsidebar').prop('checked','checked')
        }
        if (fixednavbar == 'on') {
            $('#fixednavbar').prop('checked','checked')
        }
        if (boxedlayout == 'on') {
            $('#boxedlayout').prop('checked','checked')
        }
        if (fixedfooter == 'on') {
            $('#fixedfooter').prop('checked','checked')
        }
    }

    //Lấy lại các thông số về theme config để hiển thị
    if (LocalStorageOk()) {
        var collapse = localStorage.collapse_menu;
        var fixedsidebar = localStorage.fixedsidebar;
        var fixednavbar = localStorage.fixednavbar;
        var boxedlayout = localStorage.boxedlayout;
        var fixedfooter = localStorage.fixedfooter;
        var skinstyle = localStorage.skinstyle;

        var body = $('body');

        if (skinstyle!=null){
            body.removeClass("skin-1");
            body.removeClass("skin-2");
            body.removeClass("skin-3");
            body.addClass(skinstyle);
        }

        if (fixedsidebar == 'on') {
            body.addClass('fixed-sidebar');
            $('.sidebar-collapse').slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }

        if (collapse == 'on') {
            if(body.hasClass('fixed-sidebar')) {
                if(!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }
            } else {
                if(!body.hasClass('body-small')) {
                    body.addClass('mini-navbar');
                }

            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }

        if (fixedfooter == 'on') {
            $(".footer").addClass('fixed');
        }
    }
};

Template.Template_Layout.helpers({

});
