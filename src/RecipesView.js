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
    const $recipes = $("<span></span>")
    const $rows = []
    props.recipes.forEach((recipe, index) => {

      const $recipe = $(this.recipeTemplate(recipe))
      if (recipe.wine_pairing_id) {
        const $productPairingButton = $(this.productPairingButtonTemplate({}))
        $productPairingButton.on('click', () => {
          this.handlePairingButtonClick(recipe.wine_pairing_id);
        })
        $recipe.append($productPairingButton)
      }

      if (index % 3 === 0) {
        $rows.push($("<div class='row'></div>"))
      }

      $rows[$rows.length -1].append($recipe)
    })

    $rows.forEach($row => $recipes.append($row))

    this.el.html($recipes)
  }

}

export default RecipesView;