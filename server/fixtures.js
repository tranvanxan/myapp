//Server

//Nếu chưa có dữ liệu trong collection posts từ biến Posts thì tạo mẫu cho nó
if (Collection_Posts.find().count() === 0) {
    var now = new Date().getTime();

    // create two users
    var AdminId = Meteor.users.insert({
        "_id" : "poqciS8g29rnPcJqP",
        "createdAt" : now,
        "services" : {
            "password" : {
                "bcrypt" : "$2a$10$z2IV4S2TOaiAdrQhoB2WTewiIRjzHqkzp2VSvXkf8b3GsERKyYsca"
            },
            "resume" : {
                "loginTokens" : []
            }
        },
        "settings" : {
            "otherlogin" : false,
            "language" : "vn",
            "log" : true
        },
        "username" : "admin",
        "profile" : {fisrtname : "Administrator"},
        "isAdmin" : true,
        "friends" : [
            "LvgMJ8rguKajvJd4d"
        ]
    });

    var XanId = Meteor.users.insert({
        "_id" : "LvgMJ8rguKajvJd4d",
        "createdAt" : now,
        "services" : {
            "password" : {
                "bcrypt" : "$2a$10$z2IV4S2TOaiAdrQhoB2WTewiIRjzHqkzp2VSvXkf8b3GsERKyYsca"
            },
            "resume" : {
                "loginTokens" : []
            }
        },
        "settings" : {
            "otherlogin" : false,
            "language" : "vn",
            "log" : false
        },
        "username" : "tranvanxan",
        "profile" : {fisrtname : "Xan", lastname : "Tran Van"},
        "friends" : []
    });

    var Admin = Meteor.users.findOne(AdminId);
    var Xan = Meteor.users.findOne(XanId);

    var telescopeId = Collection_Posts.insert({
        title: 'Introducing Telescope',
        userId: Xan._id,
        author: Xan.profile.fisrtname,
        url: 'http://sachagreif.com/introducing-telescope/',
        submitted: new Date(now - 7 * 3600 * 1000),
        commentsCount: 2,
        upvoters: [],
        votes: 0
    });

    Collection_Comments.insert({
        postId: telescopeId,
        userId: Admin._id,
        author: Admin.profile.fisrtname,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'Interesting project Sacha, can I get involved?'
    });

    Collection_Comments.insert({
        postId: telescopeId,
        userId: Admin._id,
        author: Admin.profile.fisrtname,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'You sure can Tom!'
    });

    Collection_Posts.insert({
        title: 'Meteor',
        userId: Xan._id,
        author: Xan.profile.fisrtname,
        url: 'http://meteor.com',
        submitted: new Date(now - 10 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });

    Collection_Posts.insert({
        title: 'The Meteor Book',
        userId: Xan._id,
        author: Xan.profile.fisrtname,
        url: 'http://themeteorbook.com',
        submitted: new Date(now - 12 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });

    for (var i = 0; i < 10; i++) {
        Collection_Posts.insert({
            title: 'Test post #' + i,
            author: Admin.profile.fisrtname,
            userId: Admin._id,
            url: 'http://google.com/?q=test-' + i,
            submitted: new Date(now - i * 3600 * 1000),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
    }
}