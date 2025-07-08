import './App.css';
import { Chat } from './components/Chat/Chat';

function App() {
  return (
    <>
      <div className="stickyHeader">
        <h1 className="header user-select-none">
          AI
          <img
            src={'/AI.png'}
            alt="logo"
            className="logo"
          />
          Interlocutor
        </h1>
      </div>
      <Chat />
    </>
  );
}

export default App;
