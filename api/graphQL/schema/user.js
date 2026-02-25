const { gql } = require('graphql-tag');

const userTypeDef = gql`
    type Product{
        
    }
    type Cart {

    }
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        cart: [Cart!]
        OTP: Int!
        role: String!
        verified: Boolean!
    }
`