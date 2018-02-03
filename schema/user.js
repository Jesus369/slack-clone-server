export default `
  type User {
    id: Int!
    username: String!
    email: String!,
    teams : [Team!]!
  }

  type Query {
    getUser(id: Int!): User!
    allUsers(id:Int!): [User!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password:String!): User!
  }
`
/*type User : define what a User requires*/
/*Query function : getUser passing in an id and will return "User"*/
/*Query function : getUsers passing in an id and will return an array of "User"*/
/*Mutation : Creating a user, passing in the fields required to create a user and returning "User"*/
