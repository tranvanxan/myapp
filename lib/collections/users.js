//Server + Client

Meteor.users.allow({
    //Chỉ có admin mới được thêm người dùng
    insert: function (userId, doc) {
        var u = Meteor.users.findOne({_id:userId});
        return (u && u.isAdmin);
    },
    // Chỉ user đang đăng nhập hoặc admin mới có quyền sửa đổi
    update: function (userId, doc, fields, modifier) {
        if (userId && doc._id === userId) {
            return true;
        }
        var u = Meteor.users.findOne({_id:userId});
        return (u && u.isAdmin);
    },
    //Chỉ có admin mới được xóa người dùng
    remove: function (userId, doc) {
        var u = Meteor.users.findOne({_id:userId});
        return (u && u.isAdmin);
    },
    fetch: ['_id']
});

Meteor.users.deny({
    // Không được sửa trường isAdmin
    update: function (userId, doc, fields, modifier) {
        return _.contains(fields, 'isAdmin');
    }
});