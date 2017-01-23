class Model {
  constructor() {
    this.callbacks = []
    this.counter = 0
  }

  callbackRunnerFor(attribute) {
    return () => {
      this.callbacks.filter(cb => {
        return cb.attribute === attribute
      }).forEach(cb => {
        cb.callback(Object.assign({}, this))
      })
    }
  }

  onChange(attribute, callback) {
    this.counter ++
    const cbObject = {
      id: this.counter,
      attribute: attribute,
      callback: callback,
    }
    this.callbacks.push(cbObject)
    return this.counter
  }

  removeListener(id) {
    this.callbacks = this.callbacks.filter(cb => {
      return cb.id !== id
    })
  }

}

export default Model;