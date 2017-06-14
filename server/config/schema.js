import casual from 'casual';

export const schema = [`
type Email {
  address: String
  verified: Boolean
}
type User {
  emails: [Email]
  firstName: String
  lastName: String
}
type Query {
  users(name: String): [User]
}
type Mutation {
  addUser(
    firstName: String!
    lastName: String!
  ): User
}
schema {
  query: Query
  mutation: Mutation
}
`];

casual.define('user', () => {
	return {
		firstName: casual.first_name,
		lastName: casual.last_name,
    emails: [{
      address: casual.email,
      verified: true,
    }]
	};
});

export const resolvers = {
  Query: {
    users(root, args) {
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push(casual.user);
      }
      return data;
    },
  },
  User: {
    emails: () => casual.user.emails,
    firstName: ({firstName}) => firstName || casual.user.firstName,
    lastName: ({lastName}) => lastName || casual.user.lastName,
  },
  Mutation: {
    addUser: (_, { firstName, lastName }) => {
      const user = casual.user;
      
      user.firstName = firstName;
      user.lastName = lastName;

      return user;
    },
  },
};