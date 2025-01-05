import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const update = async () => {
      await import("./update");
    };
    update();
  }, []);
  return <>app</>;
}

export default App;
