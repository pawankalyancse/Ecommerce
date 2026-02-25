const { gql } = require('graphql-tag');

const productTypeDef = gql`
scalar DateTime

type Product {
  _id: ID!
  name: String!
  price: Float!
  description: String!
  category: String!
  subCategory: String!
  sizes: [String!]
  images: [String!]
  reviews: [String!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  allProducts: [Product!]!
  singleProduct(productId: ID!): Product
}
`
module.exports = { productTypeDef }