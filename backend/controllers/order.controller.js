import Course from "../models/course.model.js"; // import 'Course' model to interact with course data
import Order from "../models/order.model.js"; // import 'Order' model to interact with payment order data
import razorpay from "razorpay"; // import 'razorpay' library to implement razorpay payments
import User from "../models/user.model.js"; // import 'User' model to interact with user data
import dotenv from "dotenv"; // import 'dotenv' library to load and use environment variables

dotenv.config(); // load environment variables to use them

// create an instance of 'razorpay' class and provide key ID and secret ID to it so that it can integrate and work with your account
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => { // create and export a function called 'createOrder' to create an order instance to buy a course
  try {
    const { courseId, userId } = req.body; // get unique ID of course to buy and user buying it from request body

    const course = await Course.findById(courseId); // find the course to buy from the database by it's unique ID

    // if course to buy is not found in the databse, return a 404 status code with a JSON object containing message that the course was not found
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(userId); // find the user creating the order

    // if user is not found in the databse, return a 404 status code with a JSON object containing message that the user was not found
    if (!user) return res.status(404).json({ message: "User not found" });

    // configure payment options: amount to pay would be course price (in paise) multiplied by 100 to convert it into rupees
    // payment of course will be done in 'INR' ie Indian Rupees, and payment receipt would be identified by the unique ID of course user is buying
    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `${courseId}.toString()`,
    };

    const order = await razorpayInstance.orders.create(options); // create an order instance to buy the course and provide it the configurations made

    await Order.create({
      course: courseId,
      student: userId,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    }); // persist the order so MongoDB creates the orders collection and we can track payment status

    return res.status(200).json(order); // return a 200 status code with a JSON object containing order instance made to make the payment
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};

export const verifyPayment = async (req, res) => { // create and export a function called 'verifyPayment' to verify if payment to buy a course was done
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body; // get payment details, course to buy, and user who is buying the course from request body

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id); // fetch order info of course to buy from rayzorpay order ID

    if (orderInfo.status === "paid") { // if order info contains status of course order to be paid ie user has paid for the course
      await Order.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          isPaid: true,
          paidAt: new Date(),
        },
        { new: true }
      ); // mark the saved order as paid once Razorpay confirms payment

      const user = await User.findById(userId); // find the user who has paid for the course by it's unique ID

      if (!user.enrolledCourses.includes(courseId)) { // if the course user has just bought is not present in the courses user has enrolled in
        user.enrolledCourses.push(courseId); // add the purchased course's unique ID to enrolled courses details of the user
        await user.save(); // save the changes to the database
      }

      const course = await Course.findById(courseId).populate("lectures"); // find the course by it's ID and populate it's lectures detail with data of all lectures present in the course

      if (!course.enrolledStudents.includes(userId)) { // if students enrolled in the course doesn't include the user who has bought the course
        course.enrolledStudents.push(userId); // add the user's unique ID to enrolled students details of the course
        await course.save(); // save the changes to the database
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" }); // return a 200 status code with a JSON object containing message that user has paid for the course and has been enrolled in it
    } else { // otherwise return a 400 status code with a JSON object containing message that course payment failed due to invalid payment signature
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: `An error occurred` });
  }
};
