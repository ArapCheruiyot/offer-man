// Step 1: Google Auth Initialization
window.onload = () => {
    window.google.accounts.id.initialize({
        client_id: "984320726352-ujftcdtj90svqoaud5g6d31lee5jb25k.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    window.google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { theme: "outline", size: "large" } // Customize the button style
    );
};

// Step 2: Handle the credential response (sign-in)
function handleCredentialResponse(response) {
    const idToken = response.credential;
    console.log('Encoded JWT ID token: ' + idToken);
    alert("Sign-In successful! Token in console.");

    // Display the file input and upload button after sign-in
    document.getElementById('fileInput').style.display = 'inline-block';
    document.getElementById('uploadBtn').disabled = false;
}

// Step 3: File Selection
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

fileInput.addEventListener('change', event => {
    fileList.innerHTML = '';
    Array.from(event.target.files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.textContent = file.name;
        fileList.appendChild(fileItem);
    });
});

// Step 4: Upload File to Google Drive
const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0]; // Assuming one file is selected
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const idToken = getIdToken(); // Get the signed-in user's token
    if (!idToken) {
        alert('Please sign in first.');
        return;
    }

    uploadFileToGoogleDrive(file, idToken);
});

// Step 5: Upload file to Google Drive
function uploadFileToGoogleDrive(file, idToken) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`, // Pass the ID token for authentication
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('File uploaded successfully', data);
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('File upload failed', error);
        alert('File upload failed.');
    });
}

// Helper function to retrieve the ID token
function getIdToken() {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        return auth2.currentUser.get().getAuthResponse().id_token;
    }
    return null;
}
