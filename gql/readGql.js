
const gql = require('graphql-tag')


module.exports = {
  getMeal: gql`query getMeal($find:FindMealInput){  
    getMeal(find:$find){
      id
      image
      putaway
      name
      classify
      price
    }
  }`,
  addDishes:gql`mutation addDishes($add:[DishesInput]){
    addDishes(add:$add){
      id
      image
      putaway
      name
      price
    }
  }`,
  addMeal:gql`mutation addMeal($add:[MealInput]){
    addMeal(add:$add){
      id
      name
      image
      type
      classify
      price
      poepleCount
      mealDetail
      putaway
      tableware
      clamp
      count
    }
  }`
}