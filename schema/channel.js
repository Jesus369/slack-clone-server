export default `
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages : [Message!]!
    user: [User!]!
}

type Mutation {
  createChannel(teamId: Int!, name: String!, public: Boolean=false): Boolean!
  }
`
