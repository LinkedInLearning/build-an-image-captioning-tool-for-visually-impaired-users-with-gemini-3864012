let caption;

// Image Preview
document.getElementById('imageInput').addEventListener('change', function() {
    var imagePreview = document.getElementById('imagePreview');
    var file = this.files[0];
    if(file) {
        imagePreview.src = URL.createObjectURL(file);
    } else {
        imagePreview.src = "https://placehold.co/500x300/orange/white"; 
    }
});

//Display Caption
function displayCaption(caption) {
    var captionContainer = document.getElementById('captionContainer');
    var imageCaption = document.getElementById('imageCaption');
    imageCaption.textContent = caption;
    captionContainer.style.display = "block";
}

//Submit button
document.getElementById('submitBtn').addEventListener('click', function() {
    var imageInput = document.getElementById('imageInput');
    if(imageInput.files.length > 0){
        var file = imageInput.files[0];
        displayCaption("Processing..."); // Placeholder text
        getCaptionForImage(file); // Mock function to simulate getting a caption
    }
});


//Process Caption
async function getCaptionForImage(imageFile){
    
    // Create a FormData object and append the file
    let formData = new FormData();
    formData.append('file', imageFile);

    try {
        let response = await axios.post('http://localhost:3000/caption-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Handle success
        if (response.data) {
            caption = response.data;
            console.log(caption); 
            displayCaption(caption); 
            
        }
    } catch (error) {
        // Handle error
        displayCaption(error);
    }
}


// Voicing Button
document.getElementById('speakBtn').addEventListener('click', function() {
    speakText(caption)
});

// Speech function
function speakText(text) {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        // Create a new instance of SpeechSynthesisUtterance
        var speech = new SpeechSynthesisUtterance(text);

        // Optionally, set some parameters
        speech.lang = 'en-US'; // Set the language
        speech.rate = 1; // Set the speed, 1 is the default rate
        speech.pitch = 1; // Set the pitch, 1 is the default pitch

        // Speak the text
        window.speechSynthesis.speak(speech);
    } else {
        // Speech synthesis not supported
        alert("Sorry, your browser does not support text-to-speech!");
    }
}
