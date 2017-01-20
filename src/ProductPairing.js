class ProductPairing {
  constructor(id) {
    this.id = id
    this.product = null
    this.fetching = false //this shouldn't be initialized as true
    this.callbacksFor = {};
  }

  callbackRunnerFor(prop) {
    return () => {
      if (this.callbacksFor[prop]) {
        this.callbacksFor[prop].forEach(cb => cb(Object.assign({}, this)))
      }
    }
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

  onChange(attribute, callback) {
    if(this.callbacksFor.hasOwnProperty(attribute)) {
      this.callbacksFor[attribute].push(callback)
    } else {
      this.callbacksFor[attribute] = [callback]
    }
  }

}

export default ProductPairing;