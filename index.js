document.getElementById("allBtn").addEventListener("click", () => fetchData('all'));
document.getElementById("highlightedBtn").addEventListener("click", () => fetchData('highlighted'));

async function fetchData(filterOption) {
    try {
        console.log("Fetching data for:", filterOption); // Debugging step

        const response = await fetch("http://localhost:5000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filterOption })
        });

        const data = await response.json();
        console.log("Received data:", data); // Debugging step

        const outputDiv = document.getElementById("output");

        if (!data || !data.data || data.data.length === 0) {
            outputDiv.innerHTML = "<p>No matching rows found.</p>";
            return;
        }

        outputDiv.innerHTML = ""; // Clear previous content only when new data arrives

        const table = document.createElement("table");
        table.border = "1";

        // Create table headers
        const headerRow = table.insertRow();
        Object.keys(data.data[0]).forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });

        // Populate table with data
        data.data.forEach(row => {
            const tr = table.insertRow();
            Object.values(row).forEach(cellData => {
                const td = tr.insertCell();
                td.textContent = cellData;
            });
        });

        outputDiv.appendChild(table);

        // ✅ Keep data in sessionStorage so it can be re-displayed
        sessionStorage.setItem("lastData", JSON.stringify(data.data));

        // 🛠️ Show data for 1 second, then hide it
        setTimeout(() => {
            outputDiv.style.display = "none";
        }, 1000); // Hides data after 1 second

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("output").innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    }
}

// 🛠️ Show hidden data when user clicks anywhere
document.addEventListener("click", () => {
    const outputDiv = document.getElementById("output");
    const savedData = sessionStorage.getItem("lastData");
    
    if (savedData && outputDiv.style.display === "none") {
        outputDiv.style.display = "block"; // Show the previously hidden data
        displaySavedData(JSON.parse(savedData));
    }
});

function displaySavedData(savedData) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    if (savedData.length === 0) {
        outputDiv.innerHTML = "<p>No matching rows found.</p>";
        return;
    }

    const table = document.createElement("table");
    table.border = "1";

    const headerRow = table.insertRow();
    Object.keys(savedData[0]).forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });

    savedData.forEach(row => {
        const tr = table.insertRow();
        Object.values(row).forEach(cellData => {
            const td = tr.insertCell();
            td.textContent = cellData;
        });
    });

    outputDiv.appendChild(table);
}
