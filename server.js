import { ApolloServer, gql } from "apollo-server";

let tweets = [
	{
		id: "1",
		text: "first one!",
		userId: "2",
	},
	{
		id: "2",
		text: "second one!",
		userId: "1",
	}
];

let users = [
	{
		id: "1",
		name: "박하나",
	},
	{
		id: "2",
		name: "박둘",
		phone: "010-3283-0645",
	}
];

const typeDefs = gql`
	"""회원 정보"""
  type User {
		"""회원 ID"""
		id: ID!
		"""회원 이름"""
    name: String!
		"""회원 전화번호"""
		phone: String!
  }
	"""트윗 정보"""
  type Tweet {
    id: ID!
    text: String!
		userId: String!
    author: User!
  }
  type Query {
		allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
	Query: {
		allUsers() {
			return users;
		},
		allTweets() {
			return tweets;
		},
		tweet(root, { id }) {
			return tweets.find(tweet => tweet.id === id);
		},
	},
	Mutation: {
		postTweet(_, { text, userId }) {
			const newTweet = {
				id: tweets.length + 1,
				text,
			}
			tweets.push(newTweet);
			return newTweet;
		},
		deleteTweet(_, { id }) {
			const tweet = tweets.find(tweet => tweet.id === id);
			if (!tweet) return false;
			tweets = tweets.filter(tweet => tweet.id !== id);
			return true;
		}
	},
	User: {
		phone({ phone }) {
			if (!phone) return '010';
			return phone;
		}
	},
	Tweet: {
		author({ userId }) {
			return users.find(user => user.id === userId)
		}
	}
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
