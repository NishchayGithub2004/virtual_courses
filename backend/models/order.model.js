import mongoose from "mongoose"; // import 'mongoose' library to create MongoDB schema

const orderSchema = new mongoose.Schema( // create a schema for order payment that contains the following properties
  {
    // course that is being purchased which takes a document of 'Course' collection and must be given
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    // student who is buying the course which takes a document of 'User' collection and must be given
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // order ID of rayzorpay which takes string value and must be given
    razorpay_order_id: {
      type: String,
      required: true
    },
    // payment ID of rayzorpay which takes string value and must be given
    razorpay_payment_id: {
      type: String
    },
    // signature of rayzorpay account which takes string value
    razorpay_signature: {
      type: String
    },
    // amount to pay which takes number value and must be given
    amount: {
      type: Number,
      required: true
    },
    // currency of payment that takes string value and has a default value of indian rupees ie if no value is provided to this field, indian rupess will be taken as value
    currency: {
      type: String,
      default: "INR"
    },
    // boolean value that tells whether the money is paid and has a default value of false ie if no value is provided to this field, false will be taken as value
    isPaid: {
      type: Boolean,
      default: false
    },
    // date when the money was paid and takes 'Date' object as value
    paidAt: {
      type: Date
    }
  },
  { timestamps: true } // store the time a document is added or updated in the collection
);

const Order = mongoose.model("Order", orderSchema); // create a model named 'Order' with the order payment schema

export default Order; // export the Order model
