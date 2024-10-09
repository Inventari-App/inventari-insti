module.exports = function checkComandaIsRebuda(invoice) {
    const hasNoRebuts = invoice.invoiceItems.some(invoiceItem => {
        return invoiceItem.rebuts.some(({ rebut }) => !rebut);
    });
    return !hasNoRebuts;
};
export {};
