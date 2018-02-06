import bcrypt from "bcrypt";
import _ from "lodash";

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
    /*Hash the password then store it into db*/
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message:
                  "The password must be between 5 and 100 characters long"
              }
            ]
          };
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword
        });
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
