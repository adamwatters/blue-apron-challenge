import ProductPairing from './ProductPairing'

class ProductPairings {
  constructor(ids) {
    this.productPairings = {};
    this.active = null;
    this.callbacksFor = {};
  }

  callbackRunnerFor(prop) {
    return () => {
      this.callbacksFor[prop].forEach(cb => cb(this))
    }
  }

  fetch(ids) {
    ids.forEach(id => {
      if (!this.productPairings[id]) {
        this.productPairings[id] = new ProductPairing(id)
        this.productPairings[id].fetch()
      }
    })
  }

  setActiveProductPairing(id) {
    this.active = id
    this.callbackRunnerFor('active')()
  }

  clearActiveProductPairing() {
    this.active = null
    this.callbackRunnerFor('active')()
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