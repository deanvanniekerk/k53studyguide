import React from "react";
import ReactDOM from "react-dom";

// Save a reference to the root element for reuse
const rootElement = document.getElementById("root");

// Create a reusable render method that we can call more than once
const render = () => {
    // Dynamically import our main App component, and render it
    const App = require("./App").default;

    ReactDOM.render(<App />, rootElement);
};

if (module.hot) {
    // Support hot reloading of components.
    // Whenever the App component file or one of its dependencies
    // is changed, re-import the updated component and re-render it
    module.hot.accept("./App", () => {
        setTimeout(render);
    });
}

render();
