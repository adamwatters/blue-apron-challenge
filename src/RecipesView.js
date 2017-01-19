class RecipesView {
  constructor(app) {
    this.loadingIndicator = $('#recipes_loading-indicator')
    this.$recipesContainer = $('#recipes-container')
    this.recipeTemplate = Handlebars.compile($('#recipe-template').html());
    this.productPairingButtonTemplate = Handlebars.compile($('#product-pairing-button-template').html());
    this.handlePairingButtonClick = (pairing_id) => {
      app.selectProductPairingId(pairing_id)
    }
    app.onChange('recipes', this.render.bind(this))
    app.onChange('fetching', this.render.bind(this))
  }

  render(props) {
    if (props.fetching) {
      this.$recipesContainer.html('')
      this.loadingIndicator.css('display', 'block')
    } else {
      this.loadingIndicator.css('display', 'none')
      this.renderRecipes(props)
    }
  }

  renderRecipes(props) {
    const $recipes = $('<span></span>')
    const $rows = []
    props.recipes.forEach((recipe, index) => {

      const $recipe = $(this.recipeTemplate(recipe))

      if (recipe.wine_pairing_id) {
        const $productPairingButton = $(this.productPairingButtonTemplate({}))
        $productPairingButton.on('click', () => {
          this.handlePairingButtonClick(recipe.wine_pairing_id);
        })
        $recipe.find('.recipe').append($productPairingButton)
      }

      if (recipe.vegetarian) {
        $recipe.find('.recipe').prepend('<i class="icon-veg"></i>')
      }

      if (index % 3 === 0) {
        $rows.push($('<div class="row"></div>'))
      }

      $rows[$rows.length -1].append($recipe)
    })

    $rows.forEach($row => $recipes.append($row))

    this.$recipesContainer.html($recipes)
  }

}

export default RecipesView;