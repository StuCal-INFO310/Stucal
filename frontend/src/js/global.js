
const supabaseUrl = 'https://uncjkpkwhmqigxlwcexc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuY2prcGt3aG1xaWd4bHdjZXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzMTY4OTgsImV4cCI6MjAyNjg5Mjg5OH0.nMwtflu4l78vmFGJ4_V3LpFMLoa23UbBu22evPTwiow'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Include this in all html files that access supabase:
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>