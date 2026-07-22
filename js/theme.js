const button = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

function updateThemeIcon() {
    if (document.body.classList.contains("dark")) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}

if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    document.body.classList.add("dark");
}

if (button) {
    updateThemeIcon();

    button.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

        updateThemeIcon();
    });
}