const { AuthenticationError } = require('apollo-server-core');

function base64Encode(input) {
  const buffer = Buffer.from(input);
  return buffer.toString('base64');
}

function base64Decode(input) {
  const buffer = Buffer.from(input, 'base64');
  return buffer.toString('ascii');
}

module.exports = ({ authModel }) => ({
  login: async (username, password) => {
    const result = await authModel.findAll({
      where: {
        username,
        password,
      },
    });

    if (result.length == 0) {
      throw new AuthenticationError('Wrong credentials');
    }

    // PAY ATTENTION: this is completely insecure! It's just for educational purposes!
    return base64Encode(JSON.stringify(result[0]));
  },

  validateToken: (token) => {
    try {
      // PAY ATTENTION: this is completely insecure! It's just for educational purposes!
      return JSON.parse(base64Decode(token));
    } catch (e) {
      return null;
    }
  },
});
