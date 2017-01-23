import moment from 'moment'
import ProductPairingButtonView from './ProductPairingButtonView'

class RecipesView {
  constructor(app) {
    this.loadingIndicator = $('#recipes_loading-indicator')
    this.$recipesContainer = $('#recipes-container')
    this.recipeTemplate = Handlebars.compile($('#recipe-template').html());
    app.onChange('recipes', this.render.bind(this))
    app.onChange('fetchingRecipes', this.render.bind(this))
  }

  render(props) {
    if (props.fetchingRecipes) {
      this.$recipesContainer.html('')
      this.loadingIndicator.css('display', 'block')
    } else if (props.recipes.length > 0) {
      this.loadingIndicator.css('display', 'none')
      this.renderRecipes(props)
    }
  }

  renderRecipes(props) {
    const $recipes = $('<div class="recipe-group"></div>')
    const $rows = []
    props.recipes.forEach((recipe, index) => {

      const $recipe = $(this.recipeTemplate(recipe))

      if (recipe.wine_pairing_id) {
        const productPairing = props.productPairings.getById(recipe.wine_pairing_id)
        const productPairingView = new ProductPairingButtonView(productPairing, props)
        const $productPairingButton = productPairingView.build()
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

    const planTypeDisplayNames = {
      two_person: 'Two Person Plan',
      family: 'Family Plan'
    }

    const displayWeek = moment(props.weekSelected).format('MMMM Do');
    const displayPlanType = planTypeDisplayNames[props.planTypeSelected]

    $recipes.append(`<h1 class="page-title">${displayPlanType} for the Week of ${displayWeek}</h1>`)

    $rows.forEach($row => $recipes.append($row))

    this.$recipesContainer.html($recipes)
  }

}

export default RecipesView;