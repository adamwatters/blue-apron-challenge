import moment from 'moment'

class App {
  constructor(config, recipesView) {
    this.planOptions = config.planOptions;
    this.planTypeSelected = config.planTypeSelected;
    this.weekOptions = config.weekOptions;
    this.weekSelected = config.weekSelected;
    this.productPairingId = null;
    this.fetching = false;
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
    this.fetchRecipes()
        .then(this.callbackRunnerFor('recipes'))
        .then(this.fetchProductPairings.bind(this))
  }

  fetchRecipes() {
    this.setFetching(true)
    const urlWeek = moment(this.weekSelected).format('YYYY_MM_DD')
    const urlPlan = this.planTypeSelected
    return $.getJSON(`/api/recipes/${urlPlan}/${urlWeek}`).then(response => {
      this.setFetching(false)
      this.recipes = response[`${this.planTypeSelected}_plan`].recipes.map((r) => r.recipe)
    })
  }

  fetchProductPairings() {
    const productPairings = {};
    const productPairingRequests = this.recipes.filter(recipe => recipe.wine_pairing_id).map(recipe => {
      return $.getJSON(`/api/product_pairings/${recipe.wine_pairing_id}`)
    })
    Promise.all(productPairingRequests).then(responses => {
      responses.forEach(response => {
        productPairings[response.product_pairings[0].paired_product.id] = response.product_pairings[0].paired_product.producible.wine
      })
    })
    this.productPairings = productPairings;
  }

  onChange(attribute, callback) {
    if(this.callbacksFor.hasOwnProperty(attribute)) {
      this.callbacksFor[attribute].push(callback)
    } else {
      this.callbacksFor[attribute] = [callback]
    }
  }

  setFetching(bool) {
    this.fetching = bool
    this.callbackRunnerFor('fetching')()
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