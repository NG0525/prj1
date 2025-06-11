// Initialize Stripe with your test mode public key
var stripe = Stripe('pk_test_51OwL5n03Fdx7MPy8XXkIqDnM0jFXk6KQghiPUWo7QP9YKxhObYxzUFbrbbjmL7JijZceVpaMrWROM4teZT39a6CX00Iz1vwi8X');

// Populate form fields from session storage on page load
window.addEventListener('DOMContentLoaded', function () {
    // Get values from session storage
    var storedFirstName = sessionStorage.getItem('first-name');
    var storedLastName = sessionStorage.getItem('last-name');
    var storedEmail = sessionStorage.getItem('email');
    var storedPhone = sessionStorage.getItem('phone');
    var storedDateOfBirth = sessionStorage.getItem('date-of-birth');
    var storedGender = sessionStorage.getItem('gender');
    var storedProfilePic = sessionStorage.getItem('profile_pic');
    // var storedPassportImg = sessionStorage.getItem('passport_img');
    var storedGuests = sessionStorage.getItem('guests');
    var storedRsvpDate = sessionStorage.getItem('rsvp_date');
    var storedRsvpTime = sessionStorage.getItem('rsvp_time');
    var storedMessage = sessionStorage.getItem('message');

    // Polutale form fields with sessions stored values
    if (storedFirstName) { document.getElementById('first-name').value = storedFirstName; sessionStorage.removeItem('first-name'); }
    if (storedLastName) { document.getElementById('last-name').value = storedLastName; sessionStorage.removeItem('last-name'); }
    if (storedEmail) { document.getElementById('email').value = storedEmail; sessionStorage.removeItem('email'); }
    if (storedPhone) { document.getElementById('phone').value = storedPhone; sessionStorage.removeItem('phone'); }
    if (storedDateOfBirth) { document.getElementById('date-of-birth').value = storedDateOfBirth; sessionStorage.removeItem('date-of-birth'); }
    if (storedGender) { document.getElementById('gender').value = storedGender; sessionStorage.removeItem('gender'); }
    if (storedProfilePic) {
        // If pictire exists in cookie, display pic
        document.getElementById('profile_pic').value = storedProfilePic;
        document.getElementById('profile_pic').src = storedProfilePic;
        document.getElementById('profile_pic').style.display = "block";
        // If pictire exists in cookie, disable take pic button
        document.getElementById('takePic').value = "Picture Taken: Reload page to retake";
        document.getElementById('takePic').style.backgroundColor = "darkgray";
        document.getElementById('takePic').style.color = "black";
        // Remove cached pic from cookie
        sessionStorage.removeItem('profile_pic');
    }
    // if (storedPassportImg) { document.getElementById('passport_img') = storedPassportImg; sessionStorage.removeItem('passport_img'); }
    if (storedGuests) { document.getElementById('guests').value = storedGuests; sessionStorage.removeItem('guests'); }
    if (storedRsvpDate) { document.getElementById('rsvp_date').value = storedRsvpDate; sessionStorage.removeItem('rsvp_date'); }
    if (storedRsvpTime) { document.getElementById('rsvp_time').value = storedRsvpTime; sessionStorage.removeItem('rsvp_time'); }
    if (storedMessage) { document.getElementById('message').value = storedMessage; sessionStorage.removeItem('message'); }

    if (storedFirstName, storedLastName) {
        // Change paymentt button to paid
        const paymentButton = document.getElementById('payment_method')
        paymentButton.value = "Payment Complete"
        paymentButton.disabled = true
        paymentButton.style.backgroundColor = "lightgreen"
        paymentButton.style.color = "gray"
    }
});

// Function to handle payment button click event
document.getElementById('payment_method').addEventListener('click', function (event) {
    // Prevent the default button behavior
    event.preventDefault();

    // Get the number of guests from the form

    var sessionFirstName = document.getElementById('first-name').value;
    var sessionLastName = document.getElementById('last-name').value;
    var sessionEmail = document.getElementById('email').value;
    var sessionPhone = document.getElementById('phone').value;
    var sessionDateOfBirth = document.getElementById('date-of-birth').value;
    var sessionGender = document.getElementById('gender').value;
    var sessionProfilePic = document.getElementById('profile_pic').value;
    // var sessionPassportImg = document.getElementById('passport_img').files[0];
    var sessionGuests = parseInt(document.getElementById('guests').value);
    var sessionRsvpDate = document.getElementById('rsvp_date').value;
    var sessionRsvpTime = document.getElementById('rsvp_time').value;
    var sessionMessage = document.getElementById('message').value;

    // Check if names are valid
    if (sessionFirstName == "" || sessionLastName == "") {
        alert("Please enter valid first and last name");
        return;
    }    // Check if email, phone, gender is valid
    if (sessionEmail == "" || sessionPhone == "" || sessionGender == "Unselected") {
        alert("Please enter valid email, phone number and gender");
        return;
    }    // Check if dob is valid
    if (sessionDateOfBirth == "") {
        alert("Please enter a valid Date of Birth.");
        return;
    }     // Check if sessionGuests is a valid number
    if (isNaN(sessionGuests) || sessionGuests < 1) {
        alert("Please enter a valid number of guests.");
        return;
    }   // Check if RSVP is valid
    if (sessionRsvpDate == "" || sessionRsvpTime == "") {
        alert("Please enter a valid RSVP Date and Time.");
        return;
    } // Check if passport is uploaded
    // if (sessionPassportImg == "") {
    //     alert("Please upload passport");
    //     return;
    // }


    sessionStorage.setItem('first-name', sessionFirstName);
    sessionStorage.setItem('last-name', sessionLastName);
    sessionStorage.setItem('email', sessionEmail);
    sessionStorage.setItem('phone', sessionPhone);
    sessionStorage.setItem('date-of-birth', sessionDateOfBirth);
    sessionStorage.setItem('gender', sessionGender);
    sessionStorage.setItem('profile_pic', sessionProfilePic);
    // sessionStorage.setItem('passport_img', sessionPassportImg);
    sessionStorage.setItem('guests', sessionGuests);
    sessionStorage.setItem('rsvp_date', sessionRsvpDate);
    sessionStorage.setItem('rsvp_time', sessionRsvpTime);
    sessionStorage.setItem('message', sessionMessage);

    // Convert sessionGuests to a string for clientReferenceId
    var clientReferenceId = sessionGuests.toString();

    // Create a Stripe Checkout session
    stripe.redirectToCheckout({
        // Pass guest count as a custom field
        clientReferenceId: clientReferenceId,
        // Provide success and cancel URLs if needed
        successUrl: window.location.href, // Return to the same page after payment
        cancelUrl: window.location.href,  // Return to the same page if payment is canceled
        // Pass the total amount
        lineItems: [{
            price: 'price_1OwLGd03Fdx7MPy8CmvFbNdX', // Replace with your price ID
            quantity: sessionGuests,
        }],
        mode: 'payment',
    }).then(function (result) {
        // Handle any errors
        if (result.error) {
            alert(result.error.message);
            console.error(result.error.message);
        }
    });

});


