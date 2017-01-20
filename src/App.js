import moment from 'moment'

class App {
  constructor(config) {
    this.planOptions = config.planOptions;
    this.planTypeSelected = config.planTypeSelected;
    this.weekOptions = config.weekOptions;
    this.weekSelected = config.weekSelected;
    this.productPairingId = null;
    this.mostRecentRequestAt = null;
    this.fetchingRecipes = false;
    this.recipes = [];
    this.productPairings = {};
    this.callbacksFor = {};
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
    this.fetchRecipes().then(this.fetchProductPairings.bind(this))
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

  fetchProductPairings() {
    const productPairingRequests = this.recipes.filter(recipe => recipe.wine_pairing_id).map(recipe => {
      if (!this.productPairings[recipe.wine_pairing_id]) {
        return $.getJSON(`/api/product_pairings/${recipe.wine_pairing_id}`)
      } else {
        return Promise.resolve(null)
      }
    })
    productPairingRequests.forEach(request => {
      request.then(this.handleProductPairingResponse.bind(this))
    })
  }

  handleProductPairingResponse(response) {
    if (response){
      const id = response.product_pairings[0].paired_product.id
      this.productPairings[id] = response.product_pairings[0].paired_product.producible.wine
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

  selectProductPairingId(productPairingId) {
    this.productPairingId = productPairingId
    this.callbackRunnerFor('productPairingId')()
  }

  clearProductPairingId() {
    this.productPairingId = null
    this.callbackRunnerFor('productPairingId')()
  }

}

export default App;