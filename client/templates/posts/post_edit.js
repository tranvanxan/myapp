//Client

//Xóa nội dung Session Errors khi vừa tạo xong template
Template.Template_PostEdit.created = function() {
    Session.set('Errors', '');
};

//Trả lổi về template postSubmit
Template.Template_PostEdit.helpers({
    errorMessage: function(field) {
        return Session.get('Errors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('Errors')[field] ? 'has-error' : '';
    }
});

//Submit sửa bài viết cho template postEdit
Template.Template_PostEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var postProperties = {
            id: this._id,
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            submitted: new Date()
        };

        //Kiểm tra xem các trường có bị để trống không
        var errors = {};
        if ((! postProperties.url)||(! postProperties.title)) {
            if (! postProperties.url) {errors.url = "Viết url đi bạn!";}
            if (! postProperties.title) {errors.title = "Viết tiêu đề đi bạn!";}
            return Session.set('Errors', errors);
        }else{Session.set('Errors', '');}

        //Gọi Method postEdit từ server, kiểm tra và trả lổi về client
        Meteor.call('postEdit', postProperties, function(error, result) {
            //Hiện thông báo nếu có lổi xảy ra
            if (error) return ShowError('Cập nhật bài viết không thể thực hiện vì lổi ' + error.reason);

            // Hiện thông báo khi bài viết vừa tạo có Url trùng
            if (result.postExists) {
                ShowError('Url này đã tồn tại trong bản ghi có ID là ' + result._id);
            }else{
                ShowLogs('Bạn đã sửa bài viết có ID ' + result._id);
                Router.go('Route_System');
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Bạn muốn xóa bài viết có ID " + this._id)) {
            //Posts.remove(this._id);
            Meteor.call('postDelete', this._id, function(error, result) {
                if (error) {
                    ShowError(error.reason);
                }else{
                    ShowLogs('Đã xóa bài viết có ID ' + result._id);
                }
            });
            Router.go('Route_System');
        }
    }
});