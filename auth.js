import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from "lodash";

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ["id", "isAdmin"])
    },
    secret,
    {
      expiresIn: "1m"
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "id")
    },
    secret2,
    {
      expiresIn: "7d"
    }
  );
  return Promise.all([createToken, createRefreshToken]);
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

export const tryLogin = async (email, password, models, SECRET) => {
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

  /*After login*/
  /*Create a token*/
  const [token, refreshToken] = await createTokens(
    user,
    SECRET,
    user.refreshSecret
  );

  return {
    ok: true,
    token,
    refreshToken
  };
};
