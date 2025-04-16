const fs = require('fs');
const bcrypt = require('bcrypt');
const usersFile = './users.json';

const newUser = {
  email: 'newuser@example.com',
  password: 'mypassword' // Plain text password
};

(async () => {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;

  let users = [];

  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  }

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  console.log('User added successfully.');
})();
