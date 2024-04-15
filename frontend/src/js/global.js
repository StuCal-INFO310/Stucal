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
  }
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Account created successfully",
  });
//   window.location.href = "dashboard.html";
}
