import{
    auth,
getAuth, signInWithEmailAndPassword, signOut , sendPasswordResetEmail
} from "../Authentication/config.js"

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);
    const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    alert(" User Login Successfully");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage , errorCode);
    alert("Error");
  });
});

const signout = document.getElementById("signoutButton");

signout.addEventListener("click" , (e)=>{
const auth = getAuth();
signOut(auth).then(() => {
   alert("User SignOut Successfully");
}).catch((error) => {
    console.log(error);
});
});

const forgetPasswordLink = document.getElementById("forgetPassword");

forgetPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    
    const email = prompt("Please enter your email address to reset your password:");
    
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
  
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        console.log(error);
        alert("Error sending reset email: ");
      });
  });