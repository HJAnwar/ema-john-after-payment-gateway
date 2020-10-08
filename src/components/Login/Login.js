import React, { useContext, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import './Login.css';
import fb from '../../imgse/fb.png';
import google from '../../imgse/google.png';
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: ''

    });


    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location= useLocation();
    const { from } = location.state || { from: {pathname:"/shop" }}
    
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }

    
    

    const handleBlur = (e) => {

        let isFieldValid = true;
        
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }

        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = isPasswordValid && passwordHasNumber;
        }

        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
            
        }
    }
    const handleSubmit = (e) => {
        if (newUser &&  user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setLoggedInUser(newUserInfo);
                    history.replace(from);
                    
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setLoggedInUser(newUserInfo);
                  
                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setLoggedInUser(newUserInfo);
                    history.replace(from);
                    
                    console.log('sign in user info', res.user);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setLoggedInUser(newUserInfo);

                });
        }
        e.preventDefault();
    }

    const signWithGoogle = () => {

        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig)
        }
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const { displayName, email } = res.user;
                const signedInUser = { name: displayName, email }
                setLoggedInUser(signedInUser);
                history.replace(from);
                

            })
            .catch(err => {
                console.log(err);
                console.log(err.message);
            })
    }
    

    const signWithFacebook = () => {

        if (firebase.apps.length === 0) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
        }
        const fbProvider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(fbProvider).then(function(result) {
            const {displayName, email} = result.user;
            const signedInUser = {name: displayName, email}
            setLoggedInUser(signedInUser);
            history.replace(from);
            
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }
    return (
        <div style={{height:"900px"}}>
            <div className='loginArea'>
                <form className="loginform" onSubmit={handleSubmit}>
                    
                    {newUser &&
                        <div className='inputBox'>
                            <input  onBlur={handleBlur} name="name" type="text" placeholder="first name" required/>
                        </div>
                    }
                    
                    <br/>
                
                    {newUser &&
                        <div className='inputBox'>
                            <input onBlur={handleBlur} name="name" type="text" placeholder="last name" required/>
                        </div>
                    }
                        <br/>
                    <div className='inputBox'> 
                        <input  onBlur={handleBlur} type="text" name='email' placeholder="email address" required />
                    </div>
                        <br />
                    <div className='inputBox'>
                        <input  onBlur={handleBlur} type="password" name="password" id="" placeholder="password" required />
                    </div>
                        <br />
                    
                        <input className="submitBtn" type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
                    

                    <div className="newSignBtn">
                        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
                        <label htmlFor="">New User Sign up</label>
                    </div>
                </form>
                <br/>
                <div className='googleOrFbSignin'>
                    <div className='googleArea'>
                        <img src={google} alt=""/>
                        <input className="signIn" onClick={signWithGoogle} type="button" value="Continue with Google" />
                    </div>
                    <br />
                    <div className='facebookArea'>
                        <img src={fb} alt=""/>
                        <input className="signIn" onClick={signWithFacebook} type="button" value="Continue with Facebook" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

// import React, { useState } from 'react';
// import { useContext } from 'react';
// import { UserContext } from '../../App';
// import { useHistory, useLocation } from 'react-router-dom';
// import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';



// function Login() {
//   const [newUser, setNewUser] = useState(false);
//   const [user, setUser] = useState({
//     isSignedIn: false,
//     name: '',
//     email: '',
//     password: '',
//     photo: ''
//   });

//   initializeLoginFramework();

//   const [loggedInUser, setLoggedInUser ] = useContext(UserContext);
//   const history = useHistory();
//   const location = useLocation();
//   let { from } = location.state || { from: { pathname: "/" } };

//   const googleSignIn = () => {
//       handleGoogleSignIn()
//       .then(res => {
//         handleResponse(res, true);
//       })
//   }

//   const fbSignIn = () => {
//       handleFbSignIn()
//       .then(res => {
//         handleResponse(res, true);
//       })

//   }

//   const signOut = () => {
//       handleSignOut()
//       .then(res => {
//           handleResponse(res, false);
//       })
//   }

//   const handleResponse = (res, redirect) =>{
//     setUser(res);
//     setLoggedInUser(res);
//     if(redirect){
//         history.replace(from);
//     }
//   }

//   const handleBlur = (e) => {
//     let isFieldValid = true;
//     if(e.target.name === 'email'){
//       isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
//     }
//     if(e.target.name === 'password'){
//       const isPasswordValid = e.target.value.length > 6;
//       const passwordHasNumber =  /\d{1}/.test(e.target.value);
//       isFieldValid = isPasswordValid && passwordHasNumber;
//     }
//     if(isFieldValid){
//       const newUserInfo = {...user};
//       newUserInfo[e.target.name] = e.target.value;
//       setUser(newUserInfo);
//     }
//   }
//   const handleSubmit = (e) => {
//     if(newUser && user.email && user.password){
//       createUserWithEmailAndPassword(user.name, user.email, user.password)
//       .then(res => {
//         handleResponse(res, true);
//       })
//     }

//     if(!newUser && user.email && user.password){
//       signInWithEmailAndPassword(user.email, user.password)
//       .then(res => {
//         handleResponse(res, true);
//       })
//     }
//     e.preventDefault();
//   }



//   return (
//     <div style={{textAlign: 'center'}}>
//       { user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
//         <button onClick={googleSignIn}>Sign In</button>
//       }
//       <br/>
//       <button onClick={fbSignIn}>Sign in using Facebook</button>
//       {
//         user.isSignedIn && <div>
//           <p>Welcome, {user.name}!</p>
//           <p>Your email: {user.email}</p>
//           <img src={user.photo} alt=""/>
//         </div>
//       }

//       <h1>Our own Authentication</h1>
//       <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
//       <label htmlFor="newUser">New User Sign up</label>
//       <form onSubmit={handleSubmit}>
//         {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/>}
//         <br/>
//         <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
//         <br/>
//         <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
//         <br/>
//         <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
//       </form>
//       <p style={{color: 'red'}}>{user.error}</p>
//       { user.success && <p style={{color: 'green'}}>User { newUser ? 'created' : 'Logged In'} successfully</p>}
//     </div>
//   );
// }

// export default Login;
