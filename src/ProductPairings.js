import Model from './Model'
import ProductPairing from './ProductPairing'

class ProductPairings extends Model {
  constructor(ids) {
    super()
    this.productPairings = {};
    this.active = null;
    this.callbacksFor = {};
  }

  createFor(ids) {
    this.fetch(ids)
  }

  fetch(ids) {
    ids.forEach(id => {
      if (!this.productPairings[id]) {
        this.productPairings[id] = new ProductPairing(id)
        this.productPairings[id].fetch()
      }
    })
  }

  getById(id) {
    return this.productPairings[id]
  }

  setActiveProductPairing(id) {
    this.active = id
    this.callbackRunnerFor('active')()
  }

  clearActiveProductPairing() {
    this.active = null
    this.callbackRunnerFor('active')()
  }

}

export default ProductPairings;