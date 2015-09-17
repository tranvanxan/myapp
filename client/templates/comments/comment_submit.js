//Client

//Xóa nội dung Session Errors khi vừa tạo xong template
Template.Template_CommentSubmit.created = function() {
    Session.set('Errors', '');
};

//Trả lổi về template commentSubmit
Template.Template_CommentSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('Errors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('Errors')[field] ? 'has-error' : '';
    }
});

Template.Template_CommentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            postId: template.data._id
        };

        //Kiểm tra xem các trường có bị để trống không
        var errors = {};
        if (! comment.body) {
            errors.body = "Viết gì đó đi bạn!";
            return Session.set('Errors', errors);
        }else{Session.set('Errors', '');}

        Meteor.call('commentInsert', comment, function(error, result) {
            if (error){
                ShowError(error.reason);
            } else {
                if (result.denycomment){ShowError('Không thể bình luận vì bài viết này đã bị xóa hoặc không tồn tại!');}
                if (result._id){ShowLogs('Cám ơn bạn đã bình luận!');}
                $body.val('');
            }
        });
    }
});