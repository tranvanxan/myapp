//Server

//Tạo collection C_Logs lưu các hành động đã hoàn tất
Collection_Logs = new Mongo.Collection('C_Logs');

Collection_Logs.allow({
    //Chấp nhận thêm bài viết miễn là có "tồn tại" sự đăng nhập (userId khác null) của người dùng và trường userId phải gán là userId đang đăng nhập
    insert: function(userId, doc) {return (userId && doc.userId === userId);},

    //Chấp nhận xóa bài viết nếu nó tồn tại và người xóa phải có quyền admin
    remove: function(doc) { return doc && Meteor.user().isAdmin; }
});

//Phương thức xóa thông báo
Meteor.methods({
    LogInsert: function(message){
        if (Meteor.userId()) {
            if (!Collection_Logs.findOne()){
                Collection_Logs.insert({
                    userid: Meteor.userId(),
                    username: Meteor.user().username,
                    upDate:new Date()
                });
            }
            console.log('vo method');
            //Chèn thêm hành động của người bị log, giới hạn theo dõi ở 100 hành động và sắp xếp theo thời gian
            Collection_Logs.update({ userid: Meteor.userId() },
                {$set: {upDate:new Date()},
                    $push: {
                        detail : {
                            $each: [ { createDate: new Date(), event: message } ],
                            $sort: { createDate: -1 },
                            $slice: 100
                        }
                    }
                }
            );
        }
    },
    LogsRemove : function(userId){
        if (Meteor.user().isAdmin) {
            Collection_Logs.remove({userId: userId});
            return {remove:true};
        }
        return {remove:false};
    }
});