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
    this.updateRecipes()
  }

  callbackRunnerFor(prop) {
    return () => {
      this.callbacksFor[prop].forEach(cb => cb(this))
    }
  }

  updateRecipes() {
    this.fetchRecipes().then(() => {
      const productPairingIds = this.recipes.filter(recipe => recipe.wine_pairing_id)
                                            .map(recipe => recipe.wine_pairing_id)
      this.productPairings.fetch(productPairingIds)
    })
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
      this.setFetchingRecipes(false)
      this.setRecipes(response[`${requestState.planTypeSelected}_plan`].recipes.map((r) => r.recipe))
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
    this.updateRecipes()
  }

  selectWeek(week) {
    this.weekSelected = week
    this.updateRecipes()
  }

}

export default App;