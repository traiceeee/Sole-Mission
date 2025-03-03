// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://fruhlkhtdleiciwajfwj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWhsa2h0ZGxlaWNpd2FqZndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM5OTMsImV4cCI6MjA1NjU1OTk5M30.xLINOQNf4Xqh2uy4HT9E9XX2uvEBXZzQaVtTrn3sl6g'
);
// Add this after your Supabase client initialization
supabaseClient
    .from('bookings')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error);
        } else {
            console.log('Supabase connection test successful');
        }
    });

const { createApp, ref, reactive } = Vue;

createApp({
    setup() {        
        const firstName = ref("");
        const lastName = ref("");
        const contactNumber = ref("");
        const email = ref("");
        const shoeBrandModel = ref("");
        const serviceType = ref("");
        const serviceName = ref("");
        const numItems = ref(1);
        const totalPayment = ref("₱0");
        const paymentMethod = ref("");
        const deliveryType = ref("");
        const address = reactive({
            street: "",
            city: "",
            postalCode: ""
        });
        const message = ref("");
        const agreeToTerms = ref(false);
        const showConfirmation = ref(false); 
        
        const serviceOptions = ref([]);
        
        const goBack = () => {
            if (window.history.length > 1) {
                window.history.back(); 
            } else {
                window.location.href = "index.html";  
            }
        };
        
        function updateServiceNames() {
            if (serviceType.value === "Cleaning") {
                serviceOptions.value = ["Deep Clean", "Sole Unyellowing"];
            } else if (serviceType.value === "Restoration") {
                serviceOptions.value = [
                    "Full Repaint",
                    "Full Outsole Reglue",
                    "Full Midsole Reglue",
                    "Sole Replacement",
                    "Sole Stitch",
                    "Partial Repaint",
                    "Partial Reglue"
                ];
            } else {
                serviceOptions.value = [];
            }
        }

        function calculateTotal() {
            let prices = {
                Cleaning: {
                    "Deep Clean": 350,
                    "Sole Unyellowing": 750                    
                },
                Restoration: {
                    "Full Repaint": 1200,
                    "Full Outsole Reglue": 1200,
                    "Full Midsole Reglue": 1500,
                    "Sole Replacement": 3500,
                    "Sole Stitch": 300,
                    "Partial Repaint": 300,
                    "Partial Reglue": 400                    
                }                
            };
            
            if (serviceType.value && serviceName.value && prices[serviceType.value] && prices[serviceType.value][serviceName.value]) {
                totalPayment.value = `₱${prices[serviceType.value][serviceName.value] * numItems.value}`;
            }            
        }
        
     
        async function submitForm() {
            try {
                if (!agreeToTerms.value) {
                    alert("Please agree to the terms and conditions.");
                    return;
                }
        
                const bookingReference = generateBookingReference(); // Generate reference
        
                console.log("Submitting booking...");
        
                const { data, error } = await supabaseClient
                    .from("bookings")
                    .insert([
                        {
                            first_name: firstName.value,
                            last_name: lastName.value,
                            contact_number: contactNumber.value,
                            email: email.value,
                            shoe_brand_model: shoeBrandModel.value,
                            service_type: serviceType.value,
                            service_name: serviceName.value,
                            num_items: numItems.value,
                            total_payment: Number(totalPayment.value.replace("₱", "")),
                            payment_method: paymentMethod.value,
                            delivery_type: deliveryType.value,
                            street_address: address.street,
                            city: address.city,
                            postal_code: address.postalCode,
                            message: message.value,
                            booking_reference: bookingReference // Save the reference
                        }
                    ])
                    .select();
        
                if (error) {
                    console.error("Supabase Error:", error);
                    alert(`Error submitting booking: ${error.message}`);
                    return;
                }
        
                console.log("Submission successful:", data);
        
                alert(`Your booking is confirmed! Reference: ${bookingReference}`);
                showConfirmation.value = true;
        
            } catch (error) {
                console.error("Submission Error:", error);
                alert(`Error submitting form: ${error.message}`);
            }
        }

        function validateContactNumber() {
            if (!/^(09\d{9})$/.test(contactNumber.value)) {
                alert("Contact number must start with '09' and be exactly 11 digits.");
                return false;
            }
            return true;
        }
        
        
        function confirmBooking() {
            const bookingReference = generateBookingReference();
            
            document.querySelector('.modal h3').textContent = "Booking Confirmed!";
            document.querySelector('.modal p').innerHTML = `
                <p class='confirmation-message'>Your booking has been confirmed successfully!</p>
                <p class='reference-number'>Your reference number is: <strong>${bookingReference}</strong></p>
            `;
            document.querySelector('.modal-buttons').innerHTML = '<button class="close-modal-button">Close</button>';
        
            document.querySelector('.close-modal-button').addEventListener('click', () => {
                closeModal();
            });
        
            showConfirmation.value = true;
        }
        
        
        
        function closeModal() {
            resetForm();
            showConfirmation.value = false;
            window.location.href = "index.html";
        }

        function resetForm() {
            firstName.value = "";
            lastName.value = "";
            contactNumber.value = "";
            email.value = "";
            shoeBrandModel.value = "";
            serviceType.value = "";
            serviceName.value = "";
            numItems.value = 1;
            totalPayment.value = "₱0";
            paymentMethod.value = "";
            deliveryType.value = "";
            address.street = "";
            address.city = "";
            address.postalCode = "";
            message.value = "";
            agreeToTerms.value = false;
            serviceOptions.value = [];
        }

        

        return {
            firstName,
            lastName,
            contactNumber,
            email,
            shoeBrandModel,
            serviceType,
            serviceName,
            numItems,
            totalPayment,
            paymentMethod,
            deliveryType,
            address,
            message,
            agreeToTerms,
            serviceOptions,
            updateServiceNames,
            calculateTotal,
            submitForm,
            confirmBooking,
            showConfirmation,
            goBack,
            closeModal,
        };

    }
}).mount("#app");