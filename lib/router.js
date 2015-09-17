//Server + Client

var V_Redirect;

//--------------------------------------------System Panel----------------------------------------------------------
//Nếu đã đăng nhập sẽ chuyển đến trang lưu trong V_Redirect
Accounts.onLogin(function() {
    //Lấy lại đường dẫn đã đánh đánh trên address trước khi login, chuyển người dùng đã đăng nhập về đường dẫn này
    if (V_Redirect){FlowRouter.go(V_Redirect);}
});

FlowRouter.notFound={
    action: function() {
        if (FlowRouter.current().path.indexOf("/system")!=-1){
            BlazeLayout.render('Template_Layout', {Template_Content: 'Template_NotFound'});
        }
        else{
            BlazeLayout.render('Template_FrontPage', {Template_Content: 'Template_NotFoundPage'});
        }
    }
};

//Định tuyến Login
FlowRouter.route('/login', {
    name: "Route_Login",
    subscriptions: function(params) {
        this.register('Register_UserData', Meteor.subscribe('Channel_UserData'));
    },
    action: function(params, queryParams) {
        if (Meteor.userId()){FlowRouter.go('/system');}
        else{
            if (!V_Redirect){V_Redirect="/system";}
            BlazeLayout.render('Template_Login');
        }
    },
    triggersEnter: [function(context, redirect) {
        IsSystem();
    }]
});

//Định tuyến Logout
FlowRouter.route('/logout', {
    name: "Route_Logout",
    action: function(params, queryParams) {
        if (Meteor.userId()) {
            toastr.success(G_Translate.get("CompleteSignOut"));
            Meteor.logout();
            G_Assistant.set("");
        }
        FlowRouter.go('/');
    }
});

//Tạo phương thức loggedIn kiểm tra đăng nhập cho các định tuyến yêu cầu phải đăng nhập
var loggedIn = FlowRouter.group({
    subscriptions: function(params) {
        this.register('Register_UserData', Meteor.subscribe('Channel_UserData'));
        this.register('Register_UserData', Meteor.subscribe('Channel_Notifications'));
    },
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()||Meteor.loggingIn()) {
            var RouteCurrent = FlowRouter.current();
            if (RouteCurrent.route.name!=='Route_Login') {
                V_Redirect=RouteCurrent.path;
            }
            FlowRouter.go('Route_Login');
        }
    }]
});

//Tạo nhóm định tuyến bắt đầu từ /system và bị bắt phải đăng nhập
var systemRoutes = loggedIn.group({
    prefix: '/system',
    name: 'RouteGroup_System',
    triggersEnter: [function(context, redirect) {
        //Tải lại Css và ngôn ngữ
        IsSystem();
    }]
});

//Tạo định tuyến root từ systemRoutes (tức là /system/)
systemRoutes.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render('Template_Layout', {Template_Content: 'Template_DaskBoard'});
    },
    triggersEnter: [function(context, redirect) {

    }]
});

//Tạo định tuyến /posts từ systemRoutes (tức là /system/posts)
systemRoutes.route('/posts', {
    subscriptions: function(params) {
        this.register('Register_Posts', Meteor.subscribe('Channel_Posts'));
    },
    action: function(params, queryParams) {
        BlazeLayout.render('Template_Layout', {Template_Content: 'Template_PostsList'});
    },
    triggersEnter: [function(context, redirect) {

    }]
});

//--------------------------------------------Front Page------------------------------------------------------------
//Tạo nhóm định tuyến bắt đầu từ /
var frontpageRoutes = FlowRouter.group({
    prefix: '/',
    name: 'RouteGroup_Frontpage',
    triggersEnter: [function(context, redirect) {
        IsSystem();
    }]
});

//Tạo định tuyến root từ systemRoutes (tức là /system/)
frontpageRoutes.route('/', {
    name:'Route_FirstPage',
    action: function(params, queryParams) {
        BlazeLayout.render('Template_FrontPage', {Template_Content: 'Template_FirstPage'});
    },
    triggersEnter: [function(context, redirect) {

    }]
});


//Phương thức thêm hoặc gỡ Css và ngôn ngữ tương ứng với trang system hoặc trang frontpage
IsSystem = function() {
    if (FlowRouter.current().path.indexOf("/system")!=-1||FlowRouter.current().path.indexOf("/login")!=-1) {
        if ($('link[href="/system/css/style.css"]').length == 0) {
            InsertJsCssFile('/system/css/animate.css','css');
            InsertJsCssFile('/system/css/style.css','css');
        }
        if ($('script[src="/system/languages/'+G_Lang.get()+'.js"]').length == 0) {
            InsertJsCssFile('/system/languages/' + G_Lang.get() + '.js', 'js', 'Before', false);
        }
    }
    else{
        if ($('link[href="/system/css/style.css"]').length > 0 ) {
            RemoveJsCssFile('/system/css/animate.css', 'css');
            RemoveJsCssFile('/system/css/style.css', 'css');
        }
        if ($('script[src="/system/languages/'+G_Lang.get()+'.js"]').length > 0 ) {
            RemoveJsCssFile('/system/languages/' + G_Lang.get() + '.js', 'js');
        }
    }
};

/*
//-------------------------------------------------Iron:Router--------------------------------------------------
//Khai báo cấu hình định tuyến-------------------------------------------------Begin
//Cấu hình định tuyến
Router.configure({
    //layoutTemplate: 'Template_FirstPage',
    loadingTemplate: 'Template_Spinner_Wave',
    notFoundTemplate: 'Template_NotFound',
});

//Cấu hình 2 định tuyến chính kèm 2 layout khác nhau
Router.route('/', {
    name: 'Route_FrontPage',
    layoutTemplate: 'Template_FrontPage',
    template: 'Template_FirstPage'
});

Router.route('/system', {
    name: 'Route_System',
    layoutTemplate: 'Template_Layout',
    template: 'Template_DaskBoard',
    before: function () {
        if(!Meteor.user()) {
            this.layout("Template_Login");
            this.next();
        }else{
            this.next();
        }
    },
    WaitOn: function() { return [Meteor.subscribe('Channel_Notifications'),Meteor.subscribe('Channel_UserData')]; }
});
//Khai báo cấu hình định tuyến-------------------------------------------------End




//Định tuyến tĩnh--------------------------------------------------------------Begin
//Định tuyến tĩnh cho tạo bài viết mới
Router.route('/system/submit', {name: 'Route_PostSubmit', template: 'Template_PostSubmit'});
//Định tuyến tĩnh cho đăng nhập
Router.route('/login', {name: 'Route_LoginLayout', template: 'Template_Login'});
//Định tuyến tĩnh--------------------------------------------------------------End




//Điều khiển định tuyến--------------------------------------------------------Begin
//Dành cho template postsList
PostsListController = RouteController.extend({
    template: 'Template_PostsList',
    increment: 5,
    postsLimit: function() {
        //Nếu this.params.postsLimit có trị là null thì trả về this.increment, ngược lại thì trả về parseInt(this.params.postsLimit)
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        //console.log(this.sort);
        return {sort: this.sort, limit: this.postsLimit()};
    },
    subscriptions: function() {
        //console.log(this.findOptions());
        this.postsSub = Meteor.subscribe('Channel_Posts', this.findOptions());
    },
    posts: function() {
        //console.log(this.findOptions());
        return Collection_Posts.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.posts().count() === this.postsLimit();
        return {
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPostsController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.Route_NewPosts.path({postsLimit: this.postsLimit() + this.increment})
    }
});

BestPostsController = PostsListController.extend({
    sort: {votes: -1,submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.Route_BestPosts.path({postsLimit: this.postsLimit() + this.increment})
    }
});
//Điều khiển định tuyến--------------------------------------------------------End






//Định tuyến động--------------------------------------------------------------Begin
//Cho cấu trúc /posts/:_id/edit
Router.route('/system/posts/:_id/edit', {
    name: 'Route_PostEdit',
    template: 'Template_PostEdit',
    waitOn: function() {
        return Meteor.subscribe('Channel_SinglePost', this.params._id);
    },
    data: function() { return Collection_Posts.findOne(this.params._id); }
});
//Cho cấu trúc url /post/id, đầu tiên tìm dữ liệu comment có postId trùng với _id trả về trước rồi mới đến dữ liệu post
Router.route('/system/posts/:_id', {
    name: 'Route_PostPage',
    template: 'Template_PostPage',
    waitOn: function() {
        return [Meteor.subscribe('Channel_SinglePost', this.params._id), Meteor.subscribe('Channel_Comments', this.params._id)];
    },
    data: function() { return Collection_Posts.findOne(this.params._id); }
});
//Cho cấu trúc /:postsLimit?
// dấu chấm ? cuối cùng là định tuyến không bắt buộc phải có tham số postLimit,
// tức là http://localhost:3000 cũng được hoặc http://locakhost:3000/25 cũng được

Router.route('/system/posts', {name: 'Route_ListPosts',layoutTemplate: 'Template_Layout',controller: NewPostsController});
Router.route('/system/posts/new/:postsLimit?', {name: 'Route_NewPosts',layoutTemplate: 'Template_Layout',controller: NewPostsController});
Router.route('/system/posts/best/:postsLimit?', {name: 'Route_BestPosts',layoutTemplate: 'Template_Layout',controller: BestPostsController});
//Định tuyến động--------------------------------------------------------------End







//Kiểm tra trước trước khi định tuyến------------------------------------------Begin
//Nếu không tìm thấy dữ liệu ở định tuyến postPage thì trả về template notFound
//Router.onBeforeAction('dataNotFound', {only: 'Route_PostPage'});

//Nếu chưa đăng nhập thì không cho định tuyến và chuyển qua template accessDenied
//Router.onBeforeAction(requireRole, {only: 'Route_System'});
//Kiểm tra trước trước khi định tuyến------------------------------------------End






//Hàm kiểm tra trước trước khi định tuyến--------------------------------------Begin
var requireRole = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('Template_AccessDenied');
        }
    } else {
        this.next();
    }
};
//Hàm kiểm tra trước trước khi định tuyến--------------------------------------End
*/