const card = document.querySelector(".business-card");
const flipButtons = document.querySelectorAll(".flip-button");
const copyButton = document.querySelector(".copy-button");
const copyLabel = copyButton?.querySelector(".copy-label");
const cardScene = document.querySelector(".card-scene");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (card && flipButtons.length) {
    const setFlipped = (isFlipped) => {
        card.classList.toggle("is-flipped", isFlipped);
        card.setAttribute("aria-label", isFlipped ? "Contact details" : "Digital business card");
        card.style.transform = "";
    };

    flipButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setFlipped(!card.classList.contains("is-flipped"));
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setFlipped(false);
        }
    });

    let touchStartX = 0;

    card.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    card.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > 55) {
            setFlipped(swipeDistance < 0);
        }
    }, { passive: true });
}

if (copyButton && copyLabel) {
    copyButton.addEventListener("click", async () => {
        const email = copyButton.dataset.email;

        try {
            await navigator.clipboard.writeText(email);
            copyLabel.textContent = "Email copied!";
        } catch {
            copyLabel.textContent = "Select email above";
        }

        window.setTimeout(() => {
            copyLabel.textContent = "Copy email";
        }, 1800);
    });
}

if (cardScene && !prefersReducedMotion.matches) {
    cardScene.addEventListener("pointermove", (event) => {
        if (card?.classList.contains("is-flipped") || event.pointerType === "touch") {
            return;
        }

        const bounds = cardScene.getBoundingClientRect();
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    cardScene.addEventListener("pointerleave", () => {
        card.style.transform = "";
    });
}
