const supabaseUrl = "https://umfamnhqjopxxtovmwsd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWhsa2h0ZGxlaWNpd2FqZndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM5OTMsImV4cCI6MjA1NjU1OTk5M30.xLINOQNf4Xqh2uy4HT9E9XX2uvEBXZzQaVtTrn3sl6g"; 
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("order-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const bookingRef = document.getElementById("booking-ref").value.trim();
    if (!bookingRef) {
        alert("Please enter a booking reference.");
        return;
    }

    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_reference", bookingRef)
        .single();

    if (error || !data) {
        document.getElementById("order-details").innerHTML = "<p>Booking not found.</p>";
        return;
    }

    document.getElementById("order-details").innerHTML = `
        <h2>Order Details</h2>
        <p><strong>Reference Number:</strong> ${data.booking_reference}</p>
        <p><strong>Status:</strong> ${data.status || "Pending"}</p>
        <p><strong>Service:</strong> ${data.service_name}</p>
        <p><strong>Total Payment:</strong> ₱${data.total_payment}</p>
    `;
});
