//Server + Client

//FS.debug = true;

Collection_Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images")]
});

Collection_Images.deny({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    },
    download: function(){
        return false;
    }
});

Collection_Images.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    },
    download: function(){
        return true;
    }
});