/**
 * Loads screen fragments into the device viewport at runtime.
 * Requires a local HTTP server (fetch does not work on file://).
 */

(async function loadScreens() {
  const viewport = document.getElementById("device-viewport");
  const select = document.getElementById("screen-select");
  const screens = window.TRAGO_SCREENS;

  if (!viewport || !select || !Array.isArray(screens) || screens.length === 0) {
    return;
  }

  select.replaceChildren(
    ...window.TRAGO_SCREEN_NAV_OPTIONS.map(({ id, label }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = label;
      option.selected = screens.some((screen) => screen.default && screen.id === id);
      return option;
    })
  );

  try {
    const fragments = await Promise.all(
      screens.map(async (screen) => {
        const response = await fetch(screen.file);

        if (!response.ok) {
          throw new Error(`Failed to load ${screen.file} (${response.status})`);
        }

        return response.text();
      })
    );

    viewport.insertAdjacentHTML("beforeend", fragments.join("\n"));

    viewport.querySelectorAll(".screen-panel").forEach((panel) => {
      const isActive = panel.classList.contains("screen-panel--active");
      panel.hidden = !isActive;
    });

    select.disabled = false;
  } catch (error) {
    select.disabled = false;
    viewport.innerHTML = `
      <section class="screen-load-error" role="alert">
        <p>Could not load screen previews.</p>
        <p>Run a local server from the project root, e.g. <code>python3 -m http.server</code>, then open <code>/index.html</code>.</p>
      </section>
    `;
    console.error(error);
  } finally {
    window.__screensLoaded = true;
    document.dispatchEvent(new CustomEvent("screens:loaded"));
  }
})();
