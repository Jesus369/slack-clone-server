import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      /*Grab and blend the user ID with the secret, unwrap the secret and find the ID*/
      /*Request user's token when they make a request*/
      user: _.pick(user, ["id"])
    },
    secret,
    {
      /*expiresIn can be modified depending on what sensetive data is stored in the JWT*/
      expiresIn: "1h"
    }
  );
  /*After createToken expires, the user can refresh the page to get the same token*/
  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "id")
    },
    secret2,
    {
      /*Expires in 7 days then the user will have to re-login*/
      expiresIn: "7d"
    }
  );
  return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models, SECRET) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  try {
    jwt.verify(refreshToken, user.refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    SECRET,
    user.refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  /*Finding a user with the given email*/
  const user = await models.User.findOne({ where: { email }, raw: true });
  /*Throw an error is user not found*/
  if (!user) {
    return {
      ok: false,
      errors: [{ path: "email", message: "Invalid email" }]
    };
  }
  /*comparing the String password to the Hashed password*/
  const valid = await bcrypt.compare(password, user.password);
  /*Throw an error if passwords do not match*/
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: "password", message: "Invalid password" }]
    };
  }

  const refreshTokenSecret = user.password + SECRET2;

  /*After login*/
  /*Create a token*/
  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    refreshTokenSecret
  );
  /*How the tokens will look. Objective is to store an ID into the string*/
  // token = 234kjh234.234jh23kj4h.564k5jh45kj
  // refreshToken = 234kjh234.234jh23kj4h.564k5jh45kj

  return {
    ok: true,
    token,
    refreshToken
  };
};
