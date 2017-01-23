import moment from 'moment'
import ProductPairings from './ProductPairings'

class App {
  constructor(config, models) {
    this.planOptions = config.planOptions
    this.planTypeSelected = config.planTypeSelected
    this.weekOptions = config.weekOptions
    this.weekSelected = config.weekSelected
    this.mostRecentRequestAt = null
    this.fetchingRecipes = false
    this.recipes = []
    this.productPairings = new ProductPairings()
    this.callbacksFor = {}
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

  callbackRunnerFor(prop) {
    return () => {
      if (this.callbacksFor[prop]) {
        this.callbacksFor[prop].forEach(cb => cb(Object.assign({}, this)))
      }
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