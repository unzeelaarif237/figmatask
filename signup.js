import {
    getAuth, createUserWithEmailAndPassword
    } from "../Authentication/config.js";
    
    
    const signupForm = document.getElementById("signup-form");
    
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value; 
      console.log(email, password);
    
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user)
        alert("User Created Successfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          alert("Error ");
        });
    
    });