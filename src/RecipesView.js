class RecipesView {
  constructor(app) {
    this.el = $('#recipes')
    this.recipeTemplate = Handlebars.compile($("#recipe-template").html());
    app.onChange('recipes', this.render.bind(this))
  }

  render(recipes) {
    const $recipes = $("<div></div>")
    recipes.forEach((recipe) => $recipes.append(this.recipeTemplate(recipe)))
    this.el.html($recipes)
  }

}

export default RecipesView;