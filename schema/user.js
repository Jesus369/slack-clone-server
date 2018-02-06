export default `
  type User {
    id: Int!
    username: String!
    email: String!,
    password: String!,
    teams : [Team!]!
  }

  type Query {
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, email: String!, password:String!): RegisterResponse!
  }
`;

/*type User : define what a User requires*/
/*Query function : getUser passing in an id and will return "User"*/
/*Query function : getUsers passing in an id and will return an array of "User"*/
/*Mutation : Creating a user, passing in the fields required to create a user and returning "User"*/
