class ProductPairingView {
  constructor(app) {
    this.$el = $('#product-pairing-modal')
    this.$el.modal({ show: false})
    app.onChange('productPairing', this.render.bind(this))
  }

  render(productPairing) {
    if(productPairing) {
      this.$el.modal('show');
    }
  }
}

export default ProductPairingView;