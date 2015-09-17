//Server


Meteor.methods({
    //Phương thức lấy log cá nhân
    Method_Server_GetUserLog: function(userId) {
        return Collection_Logs.findOne({userid:userId});
    },

    //Phương thức lấy thông tin bạn bè, trả về một dữ liệu tĩnh ở phía client
    Method_Server_GetUserFriendList: function(userId) {
        var J_List = Meteor.users.findOne({_id:userId},{fields : {friends : 1}});
        if (J_List.friends!==undefined){
            J_List = Meteor.users.find({_id : {$in:J_List.friends }},{fields : {username : 1, status : 1},sort: {'status.online': 1}}).fetch();
        }else{J_List=null}
        return J_List;
    },

    //Phương thức tìm người dùng bằng searchstring ứng với bất kỳ từ nào trong username, kí tự i để không phân biệc chữ hoa hay thường
    Method_Server_SearchUsersByName: function(searchstring,array) {
        var J_Result=null;
        if (searchstring){
            searchstring = new RegExp(searchstring, 'i');
            if (array){
                if (!array.isArray){array=[array];}
                J_Result = Meteor.users.find({$and:[{username: searchstring },{_id : {$nin : array }}]},{fields : {username : 1, status : 1},sort: {'status.online': 1}}).fetch();
            }else{
                J_Result = Meteor.users.find({username: searchstring },{fields : {username : 1, status : 1},sort: {'status.online': 1}}).fetch();
            }
        }
        return J_Result;
    }

});
