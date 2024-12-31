let apiKey = "kR9lHk7wuV9TQYuRP97zirVFySiOfqYj";
let submitBtn = document.getElementById("search-btn");

let generateGif = () => {
    // Get the search input value
    let searchBox = document.getElementById("search-box");
    let q = searchBox.value;

    // Check if the search box is empty
    if (q.trim() === "") {
        // Make the search box red and show the error message below
        searchBox.classList.add("error"); // Add 'error' class to style the input box
        let errorMessage = document.getElementById("error-message");

        // If the error message doesn't exist, create it
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.id = "error-message"; // Set the id for easy access
            errorMessage.innerText = "Please enter a search term."; // Set error message text
            errorMessage.style.color = "red"; // Style the error message text
            errorMessage.style.marginTop = "5px"; // Ensure spacing between input and error message
            errorMessage.style.display = "block"; // Force the error message to be block-level (on next line)
            searchBox.parentNode.appendChild(errorMessage); // Append the error message below the input field
        }
        return; // Stop the function if no input is provided
    } else {
        // If there is a valid input, remove error styles and message
        searchBox.classList.remove("error");
        let errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.remove(); // Remove the error message if the input is valid
        }
    }

    // Proceed with GIF generation (only if input is valid)
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".search-container").style.display = "none";
    document.querySelector(".container h1").style.display = "none";

    // We need 8 gifs to be displayed in result
    let gifCount = 9;
    // API URL
    let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
    document.querySelector(".wrapper").innerHTML = "";

    // Make a call to API
    fetch(finalURL)
        .then((resp) => resp.json())
        .then((info) => {
            console.log(info.data);
            // All gifs
            let gifsData = info.data;
            gifsData.forEach((gif) => {
                // Generate cards for every gif
                let container = document.createElement("div");
                container.classList.add("img-container");
                let iframe = document.createElement("img");
                console.log(gif);
                iframe.setAttribute("src", gif.images.downsized_medium.url);
                iframe.onload = () => {
                    // If images have loaded correctly, reduce the count when each gif loads
                    gifCount--;
                    if (gifCount === 0) {
                        // If all gifs have loaded, hide loader and display gifs UI
                        loader.style.display = "none";
                        document.querySelector(".wrapper").style.display = "flex";
                        document.querySelector(".search-container").style.display = "";
                        document.querySelector(".container h1").style.display = "";
                    }
                };
                container.append(iframe);

                // Copy link button
                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy Link";
                copyBtn.onclick = () => {
                    // Append the obtained ID to the default URL
                    let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
                    // Copy text inside the text field
                    navigator.clipboard
                        .writeText(copyLink)
                        .then(() => {
                            alert("GIF copied to clipboard");
                        })
                        .catch(() => {
                            // If navigator is not supported
                            alert("GIF copied to clipboard");
                            // Create temporary input
                            let hiddenInput = document.createElement("input");
                            hiddenInput.setAttribute("type", "text");
                            document.body.appendChild(hiddenInput);
                            hiddenInput.value = copyLink;
                            // Select input
                            hiddenInput.select();
                            // Copy the value
                            document.execCommand("copy");
                            // Remove the input
                            document.body.removeChild(hiddenInput);
                        });
                };
                container.append(copyBtn);
                document.querySelector(".wrapper").append(container);
            });
        })
        .catch((error) => {
            console.error("Error fetching GIFs:", error);
            alert("An error occurred while fetching GIFs. Please try again later.");
        });
};

// Generate Gifs on screen load or when user clicks on submit
submitBtn.addEventListener("click", generateGif);
