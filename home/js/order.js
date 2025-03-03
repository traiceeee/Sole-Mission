const supabaseUrl = "https://fruhlkhtdleiciwajfwj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWhsa2h0ZGxlaWNpd2FqZndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM5OTMsImV4cCI6MjA1NjU1OTk5M30.xLINOQNf4Xqh2uy4HT9E9XX2uvEBXZzQaVtTrn3sl6g"; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Fetching order data...");

document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim().toLowerCase();
    const bookingReference = document.getElementById("booking_reference").value.trim();
    
    const { data, error } = await supabase
        .from("status")
        .select("booking_reference, service_name, total_payment, status")
        .eq("email", email)
        .eq("booking_reference", bookingReference)
        .single(); // Expecting only one matching order
    
    console.log("Data:", data, "Error:", error);
    
    if (!data || error) {
        console.error("Error fetching order:", error);
        document.getElementById("order-details").innerHTML = 
            "<p>Booking not found. Please check your details.</p>";
        return;
    }
    
    const totalPayment = data.total_payment !== null ? `₱${data.total_payment}` : "Not available";
    
    document.getElementById("order-details").innerHTML = `
        <h2>Order Details</h2>
        <p><strong>Reference Number:</strong> ${data.booking_reference}</p>
        <p><strong>Status:</strong> ${data.status || "Pending"}</p>
        <p><strong>Service:</strong> ${data.service_name}</p>
        <p><strong>Total Payment:</strong> ${totalPayment}</p>
    `;
});

