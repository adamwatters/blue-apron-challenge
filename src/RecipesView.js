class RecipesView {
  constructor(app) {
    app.onChange('recipes', (recipes) => {
      console.log(recipes)
    })
  }
}

export default RecipesView;