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
    process.env.MAIL_URL = "smtp://postmaster%40mg.rishabhkhatri.com:6cafe5b65fac8d3f59a4d4c1797df16e@smtp.mailgun.org:587"
  }
});
