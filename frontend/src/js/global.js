const supabaseUrl = "https://uncjkpkwhmqigxlwcexc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY2prcGt3aG1xaWd4bHdjZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMTY4OTgsImV4cCI6MjAyNjg5Mjg5OH0.nMwtflu4l78vmFGJ4_V3LpFMLoa23UbBu22evPTwiow";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Include this in all html files that access supabase:
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

// async function login(email, password) {
//   console.log(email, password);
//   // supabase login
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   console.log(data, error);

//   if (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: error.message,
//     });
//     return;
//   }

//   window.location.href = "dashboard.html";
// }

// async function login(email, options) {
//   console.log(email, options);
//   // supabase login
//   const { data, error } = await supabase.auth.signInWithPasswords({
//     email,
//     options,
//   });
//   console.log(data, error);

//   if (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: error.message,
//     });
//     return;
//   }

//   console.log("OTP sent successfully:", data);
//   // Handle redirection or any other action here
// }

// async function login(email, password) {
//   const loginButton = document.getElementById("login-button");
//   loginButton.addEventListener("click", async () => {
//     email = document.getElementById("email").value;
//     password = document.getElementById("password").value;

//     try {
//       await login(email, password);
//     } catch (error) {
//       console.error("Login error:", error.message);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error.message,
//       });
//     }
//   });
// }

// async function login(email, password) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     // ... rest of the login logic
//   }

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  } else{
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Login successful",
    });
  }

  // Login successful! Handle user data (optional)
  console.log("Login successful:", data);

  // Redirect to the dashboard or perform other actions
//   window.location.href = "dashboard.html";
}

// document.addEventListener("DOMContentLoaded", async () => {
//   await initializeLoginForm();
// });

async function signup(email, password) {
  console.log(email, password);
  // supabase signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  // login
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Account created successfully",
  });
//   window.location.href = "dashboard.html";
}
