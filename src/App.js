import moment from 'moment'
import ProductPairings from './ProductPairings'
import Router from './Router'
import Model from './Model'

class App extends Model {
  constructor(config, models) {
    super()
    this.router = new Router(this)
    this.planTypeSelected = this.router.getParam('p') || config.planTypeSelected
    this.weekOptions = config.weekOptions
    this.weekSelected = this.router.getParam('w') || config.weekSelected
    this.mostRecentRequestAt = null
    this.fetchingRecipes = false
    this.recipes = []
    this.productPairings = new ProductPairings()
  }

  init() {
    this.fetchRecipes()
  }

  fetchRecipes() {
    this.setFetchingRecipes(true)
    const urlWeek = moment(this.weekSelected).format('YYYY_MM_DD')
    const urlPlan = this.planTypeSelected
    const requestTimeStamp = moment().format()
    const requestState = {
      timeStamp: requestTimeStamp,
      planTypeSelected: this.planTypeSelected
    }
    this.setMostRecentRequestAt(requestTimeStamp)
    $.getJSON(`/api/recipes/${urlPlan}/${urlWeek}`).then((response) => {
      if (requestState.timeStamp === this.mostRecentRequestAt) {
        const recipes = response[`${requestState.planTypeSelected}_plan`].recipes.map((r) => r.recipe)
        const productPairingIds = recipes.filter(recipe => recipe.wine_pairing_id)
                                              .map(recipe => recipe.wine_pairing_id)
        this.productPairings.createFor(productPairingIds)
        this.setFetchingRecipes(false)
        this.setRecipes(recipes)
      }
    })
  }

  setRecipes(recipes) {
    this.recipes = recipes
    this.callbackRunnerFor('recipes')()
  }

  clearRecipes() {
    this.recipes = []
    this.callbackRunnerFor('recipes')()
  }

  setMostRecentRequestAt(moment) {
    this.mostRecentRequestAt = moment;
  }

  setFetchingRecipes(bool) {
    this.fetchingRecipes = bool
    this.callbackRunnerFor('fetchingRecipes')()
  }

  selectPlanType(planType) {
    this.planTypeSelected = planType
    this.callbackRunnerFor('planTypeSelected')()
    this.clearRecipes()
    this.fetchRecipes()
  }

  selectWeek(week) {
    this.weekSelected = week
    this.callbackRunnerFor('weekSelected')()
    this.clearRecipes()
    this.fetchRecipes()
  }

}

export default App;