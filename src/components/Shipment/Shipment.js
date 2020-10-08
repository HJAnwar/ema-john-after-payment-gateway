import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Shipment.css';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import ProcessPayment from '../ProcessPayment/ProcessPayment';

const Shipment = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [shippingData, setShippingData] = useState(null);

  const onSubmit = data => {
    setShippingData(data);
  };

  const handlePaymentSuccess = paymentId => {
    const savedCart = getDatabaseCart();
    const orderDetails = { 
      ...loggedInUser, 
      products: savedCart, 
      shipment: shippingData, 
      paymentId,
      orderTime: new Date() 
    };

    fetch('https://sleepy-forest-52700.herokuapp.com/addOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          processOrder();
          // alert('your order placed successfully');
        }
      })
  }

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div  className="register">
      <div style={{display: shippingData ? 'none': 'block'}} >
        <form className="registerForm" onSubmit={handleSubmit(onSubmit)}>
          <input className="input" name="name" value={loggedInUser.displayName} ref={register({ required: true })} placeholder="Your Name" />
          {errors.name && <span className="error">Name is required</span>}

          <input className="input" name="email" value={loggedInUser.email} ref={register({ required: true })} placeholder="Your Email" />
          {errors.email && <span className="error">Email is required</span>}

          <input className="input" name="city" ref={register({ required: true })} placeholder="Your City" />
          {errors.address && <span className="error">City is required</span>}

          <input className="input" name="address-1" ref={register({ required: true })} placeholder="Your Address-1" />
          {errors.address && <span className="error">Address-1 is required</span>}

          <input className="input" name="address-2" ref={register({ required: true })} placeholder="Your Address-2" />
          {errors.address && <span className="error">Address-2 is required</span>}

          <input className="input" name="phone" ref={register({ required: true })} placeholder="Your Phone-1 Number" />
          {errors.phone && <span className="error">Phone-1 Number is required</span>}

          <input className="input" name="phone" ref={register({ required: true })} placeholder="Your Phone-2 Number" />
          {errors.phone && <span className="error">Phone-2 Number is required</span>}

          <input  className="submitBtn" type="submit" />
        </form>
      </div>
      <div style={{display: shippingData ? 'block': 'none'}} className="col-md-6">
        <h2>Please Pay for me</h2>
        <ProcessPayment handlePayment={handlePaymentSuccess}></ProcessPayment>
      </div>
    </div>
  );
};

export default Shipment;