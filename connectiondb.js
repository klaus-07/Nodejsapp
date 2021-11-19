const bcrypt = require("bcrypt");
const Admin = require("./models/admin");
const adminEmail = "admin@email.com";
const adminPassword = "password";
const seedAdmin = () => {
  return new Promise(async (resolve, reject) => {
    const totalAdmin = await Admin.find({}).countDocuments();

    if (totalAdmin === 0) {
      try {
        const password = adminPassword;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const insertAdmin = {
          email: adminEmail,
          password: hash,
        };
        await new Admin(insertAdmin).save();
      } catch (error) {
        console.log("error:", error);
      }
      resolve();
    } else {
      resolve();
    }
  });
};

// const check = async () => {
//   seedAdmin();
// };
module.exports = seedAdmin;
