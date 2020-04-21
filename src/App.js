import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {

  const [user,setUser] = useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''

  }) 

  const provider = new firebase.auth.GoogleAuthProvider();

  const signInBtn = ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL,email } = res.user;

      const signedInUser = {
        isSignedIn :true,
        name: displayName,
        email:email,
        photo:photoURL

      }

      setUser(signedInUser);

     // console.log(displayName, photoURL,email)
    })
    .catch(err =>{
      console.log(err.code);
      console.log(err.email);
      console.log(err.credential);

    })

    
  }

  const signOutBtn = () =>{
    firebase.auth().signOut()
    .then(res=>{
      const signedOutUser ={
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        password:'',
        error:'',
        isValid:false,
        existingUser:false
      }
      setUser(signedOutUser);

    })
    .catch(err =>{

    })

  }

  const is_valid_email = email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  const is_valid_pass = pass => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(pass);
  /*
  (?=.*\d)          // should contain at least one digit
  (?=.*[a-z])       // should contain at least one lower case
  (?=.*[A-Z])       // should contain at least one upper case
  [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
  */

  const handleChange = e =>{
    const newUserInfo = {
      ...user
    };
// email Validation
    let isValid = true;
    if(e.target.name === "password"){
      isValid = is_valid_pass(e.target.value) ; 
    }
    if(e.target.name === "email"){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name ==="name"){
      isValid = e.target.value;
    }

    //console.log(e.target.name,e.target.value);
    newUserInfo[e.target.name] = e.target.value ;
    // console.log(newUserInfo);
    newUserInfo.isValid = isValid ;
    setUser(newUserInfo);
  }

  const createAccount = (event)=>{
    if(user.isValid){
      
      //console.log(user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(/*user.name,*/ user.email, user.password)
      .then(res =>{
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error ='';
        setUser(createdUser);
      })
      .catch(err =>{
        // var errorCode =err.code;
        // var errorMessage = err.message;
        // console.log(errorCode);
        // console.log(errorMessage);

        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    else{
      console.log("There is an error between pass or email",{email: user.email, pass:user.pass})
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event =>{

    if(user.isValid){
      
      //console.log(user.email, user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error ='';
        setUser(createdUser);
      })
      .catch(err =>{
        // var errorCode =err.code;
        // var errorMessage = err.message;
        // console.log(errorCode);
        // console.log(errorMessage);

        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }

    event.preventDefault();
    event.target.reset();
  }

  const switchForm = event =>{
   //console.log( event.target.checked) ;
   const createdUser = {...user};
   createdUser.existingUser = event.target.checked;
   setUser(createdUser);

  }

  return (
    <div className="App">
      
      {
       user.isSignedIn ? <button onClick={signOutBtn}>Sign Out</button> :
       <button onClick={signInBtn}>Sign In</button>
      }

      {
        user.isSignedIn && 
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
          <img style={{borderRadius:'80%',height:'200px',width:'200px'}} src={user.photo} alt=""/>
        </div>
      }

      <h2>Form Validation & Authentication</h2>

      <input type="checkbox" name="switchForm"  onChange={switchForm}/>
      <label htmlFor="switchFor"> Log In</label>

      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
          
          <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Email" required/>
          <br/>
          <br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Enter Your Password" required/>
          <br/>
          <br/>
          <input type="submit" value="Submit"/>

      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
          <input type="text" onBlur={handleChange} name="name" placeholder="Enter Your Name" required/>
          <br/>
          <br/>
          <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Email" required/>
          <br/>
          <br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Enter Your Password" required/>
          <br/>
          <br/>
          <input type="submit" value="Create Account"/>

      </form>

      {
        user.error && <p style={{color:'red',fontWeight:'700'}}>{user.error}</p>
      }
     
    </div>
  );
}

export default App;
