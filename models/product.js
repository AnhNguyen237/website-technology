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
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  colors: {
    type: [String],
    required: true,
    default: "Trắng"
  },
  screen: {
    type: String,
    required: true
  },
  camaraRear: {
    type: String,
    required: false
  },
  camaraFront: {
    type: String,
    required: false
  },
  memoryStorage: {
    type: String,
    required: false
  },
  ram: {
    type: String,
    required: false
  },
  cpu: {
    type: String,
    required: false
  },
  gpu: {
    type: String,
    required: false
  },
  batteryCapacity: {
    type: String,
    required: false
  },
  sim: {
    type: String,
    required: false
  },
  os: {
    type: String,
    required: false
  },
  weight: {
    type: String,
    required: false
  },
  madein: {
    type: String,
    required: false
  },
  releaseTime: {
    type: String,
    required: false
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
  images: {
    type: [String],
    required: true
  },
  dateAdded: {
    type: Date,
    required: false,
    default: Date.now
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
