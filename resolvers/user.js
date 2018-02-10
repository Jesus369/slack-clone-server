import bcrypt from "bcrypt";
import _ from "lodash";
import { tryLogin } from "../auth";

const formatErrors = (e, models) => {
  /*If error is an instance of ValidationError*/
  if (e instanceof models.sequelize.ValidationError) {
    /*Map through errors and display this message*/
    /*Using a lodash function to pick one instead of rendering the whole object*/
    return e.errors.map(selected => _.pick(selected, ["path", "message"]));
  }
  /*Otherwise if it's not a defined error as in models.user, then display this message */
  return [{ path: "name", message: "Something went wrong" }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    /*Passing in email and password*/
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    /*Hash the password then store it into db*/
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};

/* Args : Specificatons required to build a user coming from mutation's(schema folder)*/
/*grabbing models from express(index.js)*/
