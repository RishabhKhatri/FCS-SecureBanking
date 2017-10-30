Meteor.startup(function() {
  if (Meteor.users.find().count() == 0) {
    Accounts.createUser({
      email: "admin@bank.com",
      password: "admin@123",
      profile: {
        name: "Admin",
        email: "admin@bank.com",
        verified: true
      }
    });
    var admin = Accounts.findUserByEmail("admin@bank.com");
    Roles.addUsersToRoles(admin._id, ['admin']);
    console.log(admin._id);
  }
});
