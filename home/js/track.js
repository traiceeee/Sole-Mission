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

    console.log("Tracking booking for:", { email, reference });

    const { data, error } = await supabaseClient
    .from("status")
    .select("booking_reference, first_name, last_name, service_name, total_payment, delivery_type, status")
    .eq("email", email)
    .eq("booking_reference", reference)
    .maybeSingle();  // Prevents errors when no data is found

// Log any errors from Supabase  
if (error) {
    console.error("Supabase Error:", error.message); // Logs error details in console
    alert("Error fetching booking details. Please try again.");
    return;
}

// Debugging: Log the response from Supabase  
console.log("Supabase Response:", data); 

// Handle case where no booking is found  
if (!data) {
    alert("No booking found with the provided details.");
    return;
}

// Update the page with booking details  
document.getElementById("ref-number").textContent = data.booking_reference;
document.getElementById("customer-name").textContent = `${data.first_name} ${data.last_name}`;
document.getElementById("service").textContent = data.service_name;
document.getElementById("payment").textContent = `₱${data.total_payment}`;
document.getElementById("delivery").textContent = data.delivery_type;
document.getElementById("status").textContent = data.status;

document.getElementById("status-result").classList.remove("hidden");

});
