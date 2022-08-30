const { jsPDF } = require('jspdf')
const fs = require('fs')
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
const { format } = require('date-fns')

export default function receipt(text) {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = isDev ? path.resolve("", "./receipt.pdf") : path.resolve(process.resourcesPath, "receipt.pdf")
      const doc = new jsPDF({
        orientation: 'portrait'
      });
      doc.text(`
        BarDeMu Lanches
        
        Pedido #${text.orderNumber}
        ${new Date().toLocaleDateString()} - ${format(new Date(text.createdAt), 'HH:mm')}
        
        Código de entrega: ${text.deliveryId}
        
        Nome: ${text.clientName}
        Telefone: ${text.clientPhone}
        Endereço: ${text.clientAddress}, ${text.clientAddressNumber} ${text.clientAddressData ? `Comp: ${text.clientAddressData}` : ''}
        Tipo de Pagamento: ${text.paymentType} ${text.cardFlag ? `
        Bandeira: ${text.cardFlag}` : ''}${text.coupon ? `Cupom de desconto: ${text.coupon}` : ''}
        __________________________________________________
        
        ${text.products.map((product) => {
        if(product) {
        const productLine = `${product.quantity}x ${product.name} R$${formatBRL(product.price)}${product.note && product.note.length > 0 ? `
        Obs: ${product.note}` : ''}`
        return `
        ${productLine}`
        }
        })}
        
        __________________________________________________

        Entrega: R$${formatBRL(text.deliveryPrice ? text.deliveryPrice : 0)}
        Desconto: R$${formatBRL(text.discountValue ? text.discountValue : 0)}
        Total a pagar: R$${formatBRL(text.totalValue)}
        ${text.paymentType === 'Dinheiro' ? `Troco: R$${formatBRL(text.cashChange)}` : ''}
      `, 10, 10)
      const buffer = doc.output('datauristring').split('base64,')[1]
      fs.writeFileSync(pdfPath, buffer, 'base64')
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

function formatBRL(num) {
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}