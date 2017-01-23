import Model from './Model'

class ProductPairing extends Model {
  constructor(id) {
    super()
    this.id = id
    this.product = null
    this.fetching = false
  }

  fetch() {
    this.setFetching(true)
    return $.getJSON(`/api/product_pairings/${this.id}`).then(response => {
      const id = response.product_pairings[0].paired_product.id
      this.product = response.product_pairings[0].paired_product.producible.wine
      this.setFetching(false)
    })
  }

  setFetching(bool) {
    this.fetching = bool
    this.callbackRunnerFor('fetching')()
  }

}

export default ProductPairing;