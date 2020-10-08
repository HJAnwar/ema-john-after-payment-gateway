import React from 'react';
import './Inventory.css'


const Inventory = () => {
    const handleAddProduct = () => {
        const product = {};
        fetch('http://localhost:5000/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
    }
    return (
        <div className='register'>
            <form className="registerForm">
                <h3>Add Product</h3>
                    <input  className="input" name='name'  type="text" placeholder="name" />
                    <input  className="input" name='text'  type="text"  placeholder="text" />
                    <input  className="input" name='key'  type="" placeholder="key"  />
                    <input  className="input" name='title'  type="text" placeholder="title"  required />
                    <input  className="input" name='description'  type="text" placeholder="description" id='description' required />
                    <br/>
                    <button className="submitBtn" onClick={handleAddProduct}>Add Product</button>
            </form>
            
        </div>
    );
};

export default Inventory;