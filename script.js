document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('demo-waitlist-form');
    const formStatusMessage = document.getElementById('form-status-message');
    const waitlistCounter = document.getElementById('waitlist-count');
    
    // API URL - change this to your deployed Vercel URL
    const API_URL = 'https://your-vercel-app-name.vercel.app/api/waitlist';
    
    // Fetch the current waitlist count on page load
    fetchWaitlistCount();
    
    // Form submission handler
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          instagram: document.getElementById('instagram').value,
          interest: document.getElementById('interest').value
        };
        
        // Display loading state
        formStatusMessage.textContent = 'Processing your request...';
        formStatusMessage.className = 'text-gray-700';
        
        try {
          // Submit form data to API
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Success
            formStatusMessage.textContent = 'Thank you for joining our waitlist! We\'ll be in touch soon.';
            formStatusMessage.className = 'text-green-600 font-medium';
            waitlistForm.reset();
            
            // Update waitlist count
            if (data.count && waitlistCounter) {
              waitlistCounter.textContent = data.count;
            }
          } else {
            // API Error
            formStatusMessage.textContent = data.message || 'Something went wrong. Please try again.';
            formStatusMessage.className = 'text-red-600 font-medium';
          }
        } catch (error) {
          // Network Error
          console.error('Error submitting form:', error);
          formStatusMessage.textContent = 'Network error. Please check your connection and try again.';
          formStatusMessage.className = 'text-red-600 font-medium';
        }
      });
    }
    
    // Function to fetch waitlist count
    async function fetchWaitlistCount() {
      if (waitlistCounter) {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();
          
          if (response.ok && data.count !== undefined) {
            // Set initial count with animation
            animateCounter(0, data.count);
          }
        } catch (error) {
          console.error('Error fetching waitlist count:', error);
          // Default to 0 if there's an error
          waitlistCounter.textContent = '0';
        }
      }
    }
    
    // Simple counter animation
    function animateCounter(start, end) {
      let current = start;
      const increment = Math.max(1, Math.floor((end - start) / 20));
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          clearInterval(timer);
          current = end;
        }
        waitlistCounter.textContent = current;
      }, 50);
    }
  });