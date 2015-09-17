//Client


//Chạy sau khi đã xây dựng xong cây DOM (lúc này chưa có template được đưa vào và chưa thực thi các code trong template như helpers, events, created, rendered)
Meteor.startup(function() {
    // Tự động thu nhỏ menu dọc nếu bề ngang bị thu nhỏ sưới 768px
    if ($(this).width() < 769) {
        $('body').addClass('body-small')
    } else {
        $('body').removeClass('body-small')
    }

    $(window).bind("resize", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });
    //----------------------------------------------------------

    // Download và sử dụng font google
    WebFontConfig = {
        google: { families: [ 'Open+Sans:300,400,600,700:latin' ] }
    };
    (function() {
        InsertJsCssFile('ajax.googleapis.com/ajax/libs/webfont/1/webfont.js','js','Before',true);
    })();
    //----------------------------------------------------------

    //Theo dõi các diễn biến và xử lý
    Tracker.autorun(function() {
        //Theo dõi chức năng monitor client, phải cài gói mizzao:user-status
        if (Meteor.userId()){
            try {
                if (!UserStatus.isMonitoring()){
                    UserStatus.startMonitor({threshold: 30000, interval: 10000, idleOnBlur: true});
                }
            }
            catch(err) {console.log(err);}
        }else{
            if (UserStatus.isMonitoring()){UserStatus.stopMonitor();}
            //Nếu không đăng nhập mà vẫn ở trong /system thì đuổi ra
            if (FlowRouter.current().path.indexOf("/system")!=-1){
                toastr.success(G_Translate.get("RequestLogout"));
                FlowRouter.go("/");
            }
        }

        //console.log('Trạng thái monitor : ' + UserStatus.isMonitoring());
        //console.log('Trạng thái không làm việc : ' + UserStatus.isIdle());
    });


});

