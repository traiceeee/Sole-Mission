const { createClient } = supabase;
const supabaseClient = createClient(
    'https://fruhlkhtdleiciwajfwj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWhsa2h0ZGxlaWNpd2FqZndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM5OTMsImV4cCI6MjA1NjU1OTk5M30.xLINOQNf4Xqh2uy4HT9E9XX2uvEBXZzQaVtTrn3sl6g'
);

document.getElementById("track-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const reference = document.getElementById("booking-reference").value.trim();
    
    if (!email || !reference) {
        alert("Please enter both email and booking reference.");
        return;
    }
    
    const { data, error } = await supabaseClient
        .from("status")
        .select("booking_reference, first_name, last_name, service_name, total_payment, delivery_type, status")
        .eq("email", email)
        .eq("booking_reference", reference)
        .single();
    
    if (error || !data) {
        alert("No booking found with the provided details.");
        return;
    }
    
    document.getElementById("ref-number").textContent = data.booking_reference;
    document.getElementById("customer-name").textContent = `${data.first_name} ${data.last_name}`;
    document.getElementById("service").textContent = data.service_name;
    document.getElementById("payment").textContent = `₱${data.total_payment}`;
    document.getElementById("delivery").textContent = data.delivery_type;
    document.getElementById("status").textContent = data.status;
    
    document.getElementById("status-result").classList.remove("hidden");
});
