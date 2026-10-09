// Keep React, Ionic and the question bank out of the initial marketing page load.
const triggers = document.querySelectorAll<HTMLButtonElement>("[data-quiz-demo-open]");
const labels = new Map(Array.from(triggers, button => [button, button.innerHTML]));
let loading = false;

const loadDemo = async (event: MouseEvent) => {
  event.preventDefault();
  if (loading) return;
  loading = true;
  const trigger = event.currentTarget as HTMLButtonElement;
  const originalContent = labels.get(trigger)!;
  triggers.forEach(button => { button.disabled = true; });
  trigger.setAttribute("aria-busy", "true");
  trigger.textContent = "Loading your quiz…";
  try {
    const { mountDemo } = await import("./demo-bootstrap");
    mountDemo(trigger.dataset.analyticsLocation ?? "unknown");
    triggers.forEach(button => button.removeEventListener("click", loadDemo));
    trigger.innerHTML = originalContent;
  } catch {
    // A failed download remains retryable without taking away the store links.
    trigger.textContent = "Couldn’t load the quiz. Try again";
  } finally {
    trigger.removeAttribute("aria-busy");
    triggers.forEach(button => { button.disabled = false; });
    loading = false;
  }
};

triggers.forEach(button => button.addEventListener("click", loadDemo));
