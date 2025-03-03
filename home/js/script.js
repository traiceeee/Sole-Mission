// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://fruhlkhtdleiciwajfwj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydWhsa2h0ZGxlaWNpd2FqZndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODM5OTMsImV4cCI6MjA1NjU1OTk5M30.xLINOQNf4Xqh2uy4HT9E9XX2uvEBXZzQaVtTrn3sl6g'
);


document.addEventListener("DOMContentLoaded", function () {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);


    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    const bookNowButtons = document.querySelectorAll(".book-now-btn");
    bookNowButtons.forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = "book-now.html";
        });
    });

    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const dotsContainer = document.querySelector(".dots-container");
    let slideIndex = 0;
    let autoScroll;

    if (slider && slides.length > 0 && prevButton && nextButton && dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            dot.addEventListener("click", () => jumpToSlide(index));
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll(".dot");

        function updateSlider() {
            slider.style.transform = `translateX(${-slideIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove("active"));
            dots[slideIndex].classList.add("active");
        }

        function moveSlide(step) {
            slideIndex = (slideIndex + step + slides.length) % slides.length;
            updateSlider();
            resetAutoScroll();
        }

        function jumpToSlide(index) {
            slideIndex = index;
            updateSlider();
            resetAutoScroll();
        }

        function autoSlide() {
            moveSlide(1);
        }

        function resetAutoScroll() {
            clearInterval(autoScroll);
            autoScroll = setInterval(autoSlide, 3000);
        }

        prevButton.addEventListener("click", () => moveSlide(-1));
        nextButton.addEventListener("click", () => moveSlide(1));

        const sliderContainer = document.querySelector(".slider-container");
        if (sliderContainer) {
            sliderContainer.addEventListener("mouseenter", () => clearInterval(autoScroll));
            sliderContainer.addEventListener("mouseleave", resetAutoScroll);
        }

        // Initialize slider
        updateSlider();
        autoScroll = setInterval(autoSlide, 3000);
    }

        const modal = document.getElementById("termsModal");
        const openBtn = document.getElementById("openTerms");
        const closeBtn = document.querySelector(".close");
        const termsPages = document.querySelectorAll(".terms-page");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const modalContent = document.querySelector(".modal-content");
        let currentIndex = 0;
    
        function updateModalPage() {
            termsPages.forEach((page, index) => {
                page.style.display = index === currentIndex ? "block" : "none";
            });
    
            // Scroll to the top of the modal content when changing pages
            modalContent.scrollTop = 0;
    
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === termsPages.length - 1;
        }
    
        if (modal) {
            modal.style.display = "none";
    
            if (openBtn && closeBtn) {
                openBtn.addEventListener("click", function (event) {
                    event.preventDefault();
                    modal.style.display = "flex";
                    currentIndex = 0;
                    updateModalPage();
                });
    
                closeBtn.addEventListener("click", function () {
                    modal.style.display = "none";
                });
    
                // Close modal when clicking outside
                window.addEventListener("click", function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }
    
            // Navigation event listeners
            prevBtn.addEventListener("click", function () {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateModalPage();
                }
            });
    
            nextBtn.addEventListener("click", function () {
                if (currentIndex < termsPages.length - 1) {
                    currentIndex++;
                    updateModalPage();
                }
            });
        }
    });
    

    // FEEDBACK SECTION
    document.addEventListener("DOMContentLoaded", function () {
        const stars = document.querySelectorAll(".star");
        const submitBtn = document.getElementById("submitBtn");
        let selectedRating = 0;
    
        stars.forEach(star => {
            star.addEventListener("click", function () {
                selectedRating = parseInt(this.getAttribute("data-value"));
                stars.forEach(s => s.classList.toggle("selected", s.dataset.value <= selectedRating));
            });
        });
    
        submitBtn.addEventListener("click", async function () {
            const name = document.getElementById("name").value.trim();
            const comments = document.getElementById("comments").value.trim();
    
            if (!selectedRating) {
                alert("Please select a rating before submitting.");
                return;
            }
    
            if (!comments) {
                alert("Please enter your comments.");
                return;
            }
    
            const { error } = await supabase.from("reviews").insert([{ name, rating: selectedRating, comments }]);
    
            if (error) {
                console.error("Error submitting review:", error);
                alert("Failed to submit review.");
                return;
            }
    
            alert("Review submitted successfully!");
            document.getElementById("name").value = "";
            document.getElementById("comments").value = "";
            selectedRating = 0;
            stars.forEach(s => s.classList.remove("selected"));
            loadReviews();
        });
    
        async function loadReviews() {
            const { data, error } = await supabase.from("reviews").select("name, rating, comments, created_at").order("created_at", { ascending: false });
    
            if (error) {
                console.error("Error fetching reviews:", error);
                return;
            }
    
            const reviewsContainer = document.getElementById("reviews");
            reviewsContainer.innerHTML = data.length ? "" : "<p>No reviews yet.</p>";
    
            data.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.innerHTML = `
                    <p><strong>${review.name || "Anonymous"}</strong> (${new Date(review.created_at).toLocaleDateString()})</p>
                    <p>Rating: ${"⭐".repeat(review.rating)}</p>
                    <p>${review.comments}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        }
    
        loadReviews();
    });
    
    
    