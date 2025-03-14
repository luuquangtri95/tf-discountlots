(() => {
  // app/scripts/pick-province.js
  new Shopify.CountryProvinceSelector("AddressCountry", "AddressProvince", {
    hideElement: "AddressProvince"
  });
})();
