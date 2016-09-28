
This is some example code that will insert a Tinypay payment button into a div with the id "#tinypay-button".
The reveal function can do whatever you want, so it can easily plug into whatever mechanism you're already using
to protect your content.

```
<script>
  var reveal = function () { $("#hidden-section").show(); $("#CTA").hide(); };
  MP.Configure({
    // In wei
    pricePerView: "4328994800000000", // in wei this is $0.05 at Ether ~= 11.5 USD
    // This is the address we showed you in step 3
    userClientMicropayContractAddress: "0x2C28De2422732AB77EFdA8854597A960FaB7A77B",
    // This is the function triggered when payment is received successfully
    callback: reveal,
    // The target div for a tinypay button
    targetId: "#tinypay-button"
  }).Init();
</script>
```
