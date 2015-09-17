//Server + Client

//Tạo collection C_Comments ở cả 2 môi trường và gán vào biến Collection_Comments
Collection_Comments = new Mongo.Collection('C_Comments');

//Phương thức chấp nhận hoặc từ chối
//Chỉ có tác dụng nếu client sử dụng lệnh trực tiếp insert, update hay remove từ Browser hoặc Browser Console
//Không kiểm tra nếu client gọi một methods của server để xử lý
Collection_Comments.allow({
    //Chấp nhận thêm bài viết miễn là có "tồn tại" sự đăng nhập (userId khác null) của người dùng và trường userId phải gán là userId đang đăng nhập
    insert: function(userId, doc) {return (userId && doc.userId === userId);},

    //Chấp nhận sửa đổi bài viết nếu nó thuộc người dùng đang đăng nhập
    update: function(userId, doc) { return doc && doc.userId === userId; },

    //Chấp nhận xóa bài viết nếu nó thuộc người dùng đang đăng nhập
    remove: function(userId, doc) { return doc && doc.userId === userId; },

    //Chỉ lấy trường userId để kiểm tra cho phương thức update hoặc remove ở trên
    fetch: ['userId']
});


//Phương thức thêm, xóa bình luận
Meteor.methods({
    commentInsert: function(commentAttributes) {
        check(this.userId, String);
        check(commentAttributes, {
            postId: String,
            body: String
        });
        var user = Meteor.user();
        var post = Collection_Posts.findOne(commentAttributes.postId);

        //Nếu không có bài viết được tìm thấy thì báo lổi
        if (!post){
            return {denycomment:true};
        }

        var comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        comment._id = Collection_Comments.insert(comment);

        //Cập nhật lại trường commentsCount theo tổng số bình luận thuộc về bài viết này
        Collection_Posts.update(comment.postId, {$set: {commentsCount : Collection_Comments.find({postId:comment.postId}).count()}});

        //Tạo thông báo đến chủ của bài viết là có 1 comment
        createCommentNotification(comment);

        return {_id:comment._id};
    },
    commentDelete: function(commentId,commentpostId){
        Collection_Comments.remove(commentId);

        //Xóa notification có liên quan đến commentId này
        Collection_Notifications.remove({commentId:commentId});

        //Trừ đi 1 cho bộ đếm bình luận của bài viết
        Collection_Posts.update(commentpostId, {$inc: {commentsCount: -1}});

        return {_id:commentId};
    }
});