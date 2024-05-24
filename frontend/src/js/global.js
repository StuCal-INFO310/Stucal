const supabaseUrl = "https://uncjkpkwhmqigxlwcexc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY2prcGt3aG1xaWd4bHdjZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMTY4OTgsImV4cCI6MjAyNjg5Mjg5OH0.nMwtflu4l78vmFGJ4_V3LpFMLoa23UbBu22evPTwiow";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let userCalendar;

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
  } else {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Login successful",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "dashboard.html";
      }
    });
  }

  console.log("Login successful:", data);
};

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
  } else {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Account created successfully",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "dashboard.html";
      }
    });
  }
}

function createCustomId(){
  const adjectives = ["happy", "sad", "angry", "excited", "bored", "tired", "hungry", "thirsty", "cold", "hot"];
  const nouns = ["dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle", "snake", "lizard", "frog"]; 
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const rand3Digit = Math.floor(100 + Math.random() * 900);
  return `${randomAdjective}${randomNoun}${rand3Digit}`;
}

// // Export the variables and functions
// module.exports = {
//   supabaseUrl,
//   supabaseKey,
//   supabase,
//   login,
//   signup,
// };



