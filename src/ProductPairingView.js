class ProductPairingView {
  constructor(app) {
    this.$modal = $('#product-pairing-modal')
    this.$modal.modal({ show: false})
    $('[data-close-modal]').on('click', () => {
      app.clearProductPairingId()
    })
    this.$modalBody = $('#product-pairing-modal-body')
    this.wineModalTemplate = Handlebars.compile($("#wine-modal-template").html());
    this.$modalHeaderContent = $('#wine-modal-header-content')
    this.headerContentTemplate = Handlebars.compile($("#wine-modal-header-content-template").html());
    app.onChange('productPairingId', this.render.bind(this))
  }

  render(props) {
    if(props.productPairingId) {
      this.fillAndShowModal(props.productPairings[props.productPairingId])
    } else {
      this.$modal.modal('hide')
    }
  }

  fillAndShowModal(productPairing) {
    this.$modalBody.html(this.wineModalTemplate(productPairing))
    this.$modalHeaderContent.html(this.headerContentTemplate(productPairing))
    this.$modal.modal('show');
  }
}

export default ProductPairingView;