// Step 1: Initialize Google Sign-In
window.onload = () => {
    window.google.accounts.id.initialize({
        client_id: "YOUR_CLIENT_ID",
        callback: handleCredentialResponse,
        scope: "https://www.googleapis.com/auth/drive.file"
    });

    window.google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { theme: "outline", size: "large" }
    );
};

// Step 2: Handle User Sign-In
function handleCredentialResponse(response) {
    const idToken = response.credential;
    console.log("Encoded JWT ID token:", idToken);
    alert("Sign-In successful!");

    window.localStorage.setItem("google_id_token", idToken);
    document.getElementById("fileInput").style.display = "inline-block";
    document.getElementById("uploadBtn").disabled = false;
}

// Step 3: Display Selected Files
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", event => {
    fileList.innerHTML = ""; // Clear previous list
    Array.from(event.target.files).forEach(file => {
        const fileItem = document.createElement("div");
        fileItem.textContent = file.name;
        fileList.appendChild(fileItem);
    });
});

// Step 4: Handle File Upload
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

uploadBtn.addEventListener("click", () => {
    const files = fileInput.files;

    if (!files.length) {
        alert("Please select at least one file to upload.");
        return;
    }

    if (!confirm("Are you sure you want to upload the selected files?")) {
        return;
    }

    const idToken = getIdToken();
    if (!idToken) {
        alert("Please sign in first.");
        return;
    }

    Array.from(files).forEach(file => {
        // Provide feedback to the user
        uploadStatus.textContent = `Uploading ${file.name}...`;

        // Simplified upload function for testing
        uploadFileToGoogleDrive(file, idToken);
    });
});

function uploadFileToGoogleDrive(file, idToken) {
    console.log("Preparing to upload:", file.name);

    // Simulated success message
    setTimeout(() => {
        console.log(`File "${file.name}" uploaded successfully.`);
        uploadStatus.textContent = `File "${file.name}" uploaded successfully!`;
    }, 2000); // Simulate a delay for testing
}

function getIdToken() {
    return window.localStorage.getItem("google_id_token");
}
