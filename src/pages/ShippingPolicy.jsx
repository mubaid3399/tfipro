const ShippingPolicy = () => {
  return (
    <div className="mx-auto w-[90%] max-w-4xl py-24 text-sm text-slate-700">
      <h1 className="mb-6 text-2xl font-normal text-slate-900">Shipping Policy</h1>
      <div className="flex flex-col gap-4 font-normal leading-relaxed">
        <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. Please note that during high-volume periods or promotional events, processing times may be slightly extended.</p>
        <p>Shipping charges for your order will be calculated and displayed at checkout. We offer a variety of shipping options, including standard, expedited, and next-day delivery, depending on your location. Delivery delays can occasionally occur due to unforeseen circumstances, such as weather conditions, carrier delays, or customs processing for international orders.</p>
        <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available. You can track your package directly on the carrier's website using the provided tracking number.</p>
        <p>If you haven't received your order within the estimated delivery days, please contact us with your name and order number, and we will look into it for you. We take lost or delayed packages very seriously and will work with the carrier to resolve any issues promptly.</p>
        <p>For international orders, your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. TFiPro is not responsible for these charges if they are applied and are your responsibility as the customer.</p>
        <p>If your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.</p>
      </div>
    </div>
  )
}

export default ShippingPolicy
