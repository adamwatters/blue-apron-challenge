import moment from 'moment'

class App {
  constructor(config, models) {
    this.planOptions = config.planOptions
    this.planTypeSelected = config.planTypeSelected
    this.weekOptions = config.weekOptions
    this.weekSelected = config.weekSelected
    this.mostRecentRequestAt = null
    this.fetchingRecipes = false
    this.recipes = []
    this.productPairings = models.productPairings
    this.callbacksFor = {}
  }

  init() {
    this.fetchRecipes()
  }

  callbackRunnerFor(prop) {
    return () => {
      if (this.callbacksFor[prop]) {
        this.callbacksFor[prop].forEach(cb => cb(Object.assign({}, this)))
      }
    }
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
    return $.getJSON(`/api/recipes/${urlPlan}/${urlWeek}`).then(this.handleRecipesResponse.bind(this, requestState))
  }

  handleRecipesResponse(requestState, response) {
    if (requestState.timeStamp === this.mostRecentRequestAt) {
      const recipes = response[`${requestState.planTypeSelected}_plan`].recipes.map((r) => r.recipe)
      const productPairingIds = recipes.filter(recipe => recipe.wine_pairing_id)
                                            .map(recipe => recipe.wine_pairing_id)
      this.productPairings.createFor(productPairingIds)
      this.setFetchingRecipes(false)
      this.setRecipes(recipes)
    }
  }

  onChange(attribute, callback) {
    if(this.callbacksFor.hasOwnProperty(attribute)) {
      this.callbacksFor[attribute].push(callback)
    } else {
      this.callbacksFor[attribute] = [callback]
    }
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
    this.clearRecipes()
    this.fetchRecipes()
  }

}

export default App;