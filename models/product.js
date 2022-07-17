const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const removeAccent = require("../util/removeAccent");

const productSchema = new Schema({
  prodType: {
    type: String,
    required: true,
    default: "Smartphone"
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: "Một sản phẩm từ Trùm Công Nghệ"
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: [String],
    required: true
  },
  productType: {
    main: [String],
    sub: [String]
  },
  color: {
    type: [String],
    required: true
  },
  pattern: {
    type: [String],
    required: false
  },
  tags: {
    type: [String],
    required: false
  },
  images: {
    type: [String],
    required: true
  },
  dateAdded: {
    type: Date,
    required: false,
    default: Date.now
  },
  materials: {
    type: [String],
    required: true
  },
  buyCounts: {
    type: Number,
    required: false,
    default: 0
  },
  viewCounts: {
    type: Number,
    required: false,
    default: 0
  },
  rating: {
    byUser: String,
    content: String,
    star: Number
  },
  comment: {
    total: {
      type: Number,
      require: false,
      default: 0
    },
    items: [
      {
        title: {
          type: String
        },
        content: {
          type: String
        },
        name: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        },
        star: {
          type: Number
        }
      }
    ]
  }
});

productSchema.methods.getNonAccentType = function() {
  return removeAccent(this.productType.main);
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
