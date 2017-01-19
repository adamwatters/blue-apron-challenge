class RecipesView {
  constructor(app) {
    this.el = $('#recipes')
    this.recipeTemplate = Handlebars.compile($("#recipe-template").html());
    this.productPairingButtonTemplate = Handlebars.compile($("#product-pairing-button-template").html());
    this.handlePairingButtonClick = (pairing_id) => {
      app.selectProductPairingId(pairing_id)
    }
    app.onChange('recipes', this.render.bind(this))
  }

  render(props) {
    const $recipes = $("<div></div>")
    props.recipes.forEach((recipe) => {
      const $recipe = $(this.recipeTemplate(recipe))
      if (recipe.wine_pairing_id) {
        const $productPairingButton = $(this.productPairingButtonTemplate({}))
        $productPairingButton.on('click', () => {
          this.handlePairingButtonClick(recipe.wine_pairing_id);
        })
        $recipe.append($productPairingButton)
      }
      $recipes.append($recipe)
    })
    this.el.html($recipes)
  }

}

export default RecipesView;