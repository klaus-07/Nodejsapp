const formatProduct = (obj) => {
  return {
    id: obj._id,
    name: obj.name,
    category: {
      id: obj.category._id,
      name: obj.category.categoryName,
    },
    image: obj.productImage,
    price: obj.price,
    color: obj.color,
    cloth: obj.cloth,
    size: obj.size,
    isActive: obj.isActive,
    quantity: obj.quantity,
  };
};
const formatProducts = (products) => {
  return products.map(formatProduct);
};

module.exports = {
  formatProduct,
  formatProducts,
};
