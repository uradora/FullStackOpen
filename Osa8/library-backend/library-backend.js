const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const MONGODB_URI = 'mongodb+srv://merirajama:sticksstones@cluster0.lfvm3uy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ) : Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author
    createUser(
      username: String!
      favoriteGenre: String!
    ) : User
    login(
      username: String!
      password: String!
    ) : Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return await Book.find( { genres: { $in: args.genre }}).populate('author')
      }
      return await Book.find({}).populate('author')
    },
    allAuthors: async (root, args) => {
      return Author.find({}) 
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Book: {
    author: async (root) => {
      return await (await Author.find({})).find(author => {
        return author.name === root.author.name
      })
    }
  },
  Author: {
    bookCount: async (root) => {
      return await Book.find( { author: { $in: root._id } } ).countDocuments()
  }},
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      console.log('täällä')
      console.log(args)

      const authorToFind = await Author.findOne({ name: args.author })
      if (!authorToFind) {
        const author = new Author({ 
          name: args.author,
          born: null
        })
        const book = new Book({ ...args, author: author })
        try {
          await author.save()
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return book
      }
      const book = new Book({ ...args, author: authorToFind })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
        return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo 
      console.log(author)
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
      },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
