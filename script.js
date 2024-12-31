<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload to Google Drive</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <h1>Upload Files to Google Drive</h1>
    <div class="g_id_signin"></div>

    <!-- File Input and Upload Button -->
    <input type="file" id="fileInput" style="display:none" multiple>
    <div id="fileList"></div>
    <button id="uploadBtn" disabled>Upload</button>
    <p id="uploadStatus"></p>

    <script>
        // Step 1: Initialize Google Sign-In
        window.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "958416089916-1embl17stmkectofeqb74c54ccs38rb5.apps.googleusercontent.com",
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

            // Save the ID token in localStorage
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

                // Call function to upload the file to Google Drive
                uploadFileToGoogleDrive(file, idToken);
            });
        });

        // Function to upload file to Google Drive
        function uploadFileToGoogleDrive(file, idToken) {
            console.log("Preparing to upload:", file.name);

            // Step 1: Fetch access token using the ID token
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + idToken);
            const formData = new FormData();
            formData.append("file", file);

            // Step 2: Make a request to upload the file
            fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
                method: "POST",
                headers: headers,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    console.log(`File "${file.name}" uploaded successfully with file ID: ${data.id}`);
                    uploadStatus.textContent = `File "${file.name}" uploaded successfully!`;
                } else {
                    console.error("Error uploading file:", data);
                    uploadStatus.textContent = "Error uploading file.";
                }
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                uploadStatus.textContent = "Error uploading file.";
            });
        }

        // Function to get the ID token
        function getIdToken() {
            return window.localStorage.getItem("google_id_token");
        }
    </script>
</body>
</html>
