import { Invoice } from "../models/invoice"

module.exports = function checkComandaIsRebuda (invoice: Invoice) {
  const hasNoRebuts = invoice.invoiceItems.some(invoiceItem => {
    return invoiceItem.rebuts.some(({ rebut }) => !rebut)
  })
  return !hasNoRebuts
}
