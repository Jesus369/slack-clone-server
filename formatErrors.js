import _ from "lodash";

export default (e, models) => {
  /*If error is an instance of ValidationError*/
  if (e instanceof models.sequelize.ValidationError) {
    /*Map through errors and display this message*/
    /*Using a lodash function to pick one instead of rendering the whole object*/
    return e.errors.map(selected => _.pick(selected, ["path", "message"]));
  }
  /*Otherwise if it's not a defined error as in models.user, then display this message */
  return [{ path: "name", message: "Something went wrong" }];
};
