import './App.css';
import { Chat } from './components/Chat/Chat';

function App() {
  return (
    <>
      <div className="stickyHeader">
        <h1 className="header user-select-none">
          Chat
          <img
            src={'/AI.png'}
            alt="logo"
            className="logo"
          />
          Role
        </h1>
      </div>
      <Chat />
    </>
  );
}

export default App;
