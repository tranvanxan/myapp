//Server + Client

Collection_Notifications = new Mongo.Collection('C_Notifications');

Collection_Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return doc && doc.userId === userId && fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

//Tạo hàm createCommentNotification thêm thông báo cho người dùng
createCommentNotification = function(comment) {
    var post = Collection_Posts.findOne(comment.postId);
    if (comment.userId !== post.userId) {
        Collection_Notifications.insert({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            createDate: new Date(),
            read: false
        });
    }
};

//Phương thức xóa thông báo
Meteor.methods({
    NotificationRemove : function(){
        if (Meteor.userId()) {
            Collection_Notifications.remove({userId: Meteor.userId(), read: true});
            return {remove:true};
        }
        return {remove:false};
    }
});