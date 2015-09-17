//Client

//Xóa nội dung Session Errors khi vừa tạo xong template
Template.Template_PostSubmit.created = function() {
    Session.set('Errors', '');
};

//Trả lổi về template postSubmit
Template.Template_PostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('Errors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('Errors')[field] ? 'has-error' : '';
    }
});

//Submit thêm bài viết cho template postSubmit
Template.Template_PostSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        //Kiểm tra xem các trường có bị để trống không
        var errors = {};
        if ((! post.url)||(! post.title)) {
            if (! post.url) {errors.url = "Viết url đi bạn!";}
            if (! post.title) {errors.title = "Viết tiêu đề đi bạn!";}
            return Session.set('Errors', errors);
        }else{Session.set('Errors', '');}

        //Gọi Method postInsert từ server, kiểm tra và trả lổi về client
        Meteor.call('postInsert', post, function(error, result) {
            //Hiện thông báo nếu có lổi xảy ra
            if (error) return ShowError('Thêm mới bài viết không thể thực hiện vì lổi ' + error.reason);

            // Hiện thông báo khi bài viết vừa tạo có Url trùng và chuyển đến trang nội dung document đó
            if (result.postExists) {
                ShowError('Url này đã tồn tại trong bản ghi có ID là ' + result._id);
                //Router.go('Route_PostPage', {_id: result._id});
            }else{
                Router.go('Route_System');
            }
        });
    }
});
