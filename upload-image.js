var imageStore = new FS.Store.GridFS('images');

Images = new FS.Collection('images', {
 stores: [imageStore]
});

if (Meteor.isClient) {

  Template.hello.events({
    'change .myFileInput': function(event,template){
      FS.Utility.eachFile(event, function(file){
        Images.insert(file, function(err,fileObj){
          if(err){
            //handle error
          } else{
            //handle success depending what you need to do
            var userId = Meteor.userId();
            var imagesURL = {
              'profile.image':'cfs/files/images/' + fileObj._id
            };
            Meteor.users.update(userId, {$set: imagesURL});
          }
        });
      });
    }
  });

  Template.show.helpers({
      theImage: function(){
        return this.user().profile.image;
      },
      theEmail: function(){
        var user = this.user().emails[0].address;
        return user;
      }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Images.allow({
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
}
