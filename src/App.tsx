import { Button } from '@mantine/core';
import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Button>Hello world!</Button>
    </div>
  );
}

export default App;
