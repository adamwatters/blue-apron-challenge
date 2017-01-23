import ProductPairing from './ProductPairing'

class ProductPairings {
  constructor(ids) {
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

}

export default ProductPairings;