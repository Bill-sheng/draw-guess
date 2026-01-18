import { useState, useEffect, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import './index.css';

// Game Constants
const WORDS = ['APPLE', 'SUN', 'TREE', 'HOUSE', 'CAR', 'CAT', 'DOG', 'COMPUTER', 'PIZZA', 'ROCKET'];
const SYSTEM_NAMES = ['AI Bot', 'Guesser 9000', 'Robo-Eye', 'Neural Net'];
const WRONG_GUESSES_DB = {
  'APPLE': ['Ball', 'Red Circle', 'Fruit', 'Cherry', 'Tomato', 'Bomb'],
  'SUN': ['Ball', 'Circle', 'Moon', 'Cookie', 'Coin', 'Wheel'],
  'TREE': ['Broccoli', 'Flower', 'Bush', 'Leaf', 'Forest', 'Garden'],
  'HOUSE': ['Box', 'Garage', 'Barn', 'Tent', 'Building', 'Hut'],
  'CAR': ['Box', 'Truck', 'Bus', 'Train', 'Van', 'Cart'],
  'CAT': ['Dog', 'Fox', 'Tiger', 'Lion', 'Panther', 'Kitten'],
  'DOG': ['Cat', 'Wolf', 'Bear', 'Horse', 'Fox', 'Puppy'],
  'COMPUTER': ['TV', 'Microwave', 'Screen', 'Laptop', 'Tablet', 'Phone'],
  'PIZZA': ['Moon', 'Cookie', 'Pie', 'Cheese', 'Plate', 'Wheel'],
  'ROCKET': ['Pen', 'Tower', 'Plane', 'Missile', 'Pencil', 'Arrow']
};

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, won, lost
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [currentWord, setCurrentWord] = useState('');
  const [systemGuesses, setSystemGuesses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundId, setRoundId] = useState(0);

  const timerRef = useRef(null);
  const guessTimerRef = useRef(null);

  // START GAME
  const handleStartGame = () => {
    // 1. Reset State
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setGameState('playing');
    setSystemGuesses([]);
    setTimeLeft(60);
    setTool('brush');
    setColor('#000000');
    setRoundId(prev => prev + 1); // Triggers canvas clear

    // 2. Start Logic
    startGuessingLoop(word);
  };

  const startGuessingLoop = (word) => {
    if (guessTimerRef.current) clearInterval(guessTimerRef.current);

    let guessesMade = 0;
    const wrongGuesses = WRONG_GUESSES_DB[word] || ['Something?', 'Lines?', 'Shape?'];
    const maxWrong = 4 + Math.floor(Math.random() * 3); // 4-6 wrong guesses before correct

    guessTimerRef.current = setInterval(() => {
      if (guessesMade < maxWrong) {
        // Make a wrong guess
        const text = wrongGuesses[guessesMade % wrongGuesses.length];
        addSystemGuess(text, false);
        guessesMade++;
      } else {
        // Win condition
        clearInterval(guessTimerRef.current);
        addSystemGuess(word, true);
        setGameState('won');
      }
    }, 3000); // Guess every 3 seconds
  };

  const addSystemGuess = (text, isCorrect) => {
    const name = SYSTEM_NAMES[Math.floor(Math.random() * SYSTEM_NAMES.length)];
    setSystemGuesses(prev => [...prev, { id: Date.now(), name, text, isCorrect }]);
    // Auto-scroll logic ideally would be here
  };

  // COUNTDOWN TIMER
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (guessTimerRef.current) clearInterval(guessTimerRef.current);
    };
  }, [gameState]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">

      {/* 1. Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">DG</div>
          <span className="font-bold text-lg tracking-tight">DrawGuest</span>
        </div>
        <div className="flex items-center gap-4">
          {gameState === 'playing' ? (
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-100">
              <span className="text-xs uppercase font-bold text-indigo-500">Target</span>
              <span className="font-bold text-indigo-900">{currentWord}</span>
            </div>
          ) : (
            <span className="text-slate-400 text-sm">Not Playing</span>
          )}
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">You vs System</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex min-h-0 relative">

        {/* LEFT: Tools */}
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 z-10">
          <div className="flex flex-col gap-2 w-full px-2">
            <button
              onClick={() => setTool('brush')}
              className={`p-3 rounded-lg transition-colors ${tool === 'brush' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Brush"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-3 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Eraser"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="w-10 h-px bg-slate-200"></div>

          <div className="flex flex-col gap-3 px-2">
            {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('brush'); }}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c && tool === 'brush' ? 'border-indigo-600 scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-slate-400">SIZE</span>
            <input
              type="range" min="2" max="40"
              value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))}
              className="h-24 -ml-1 appearance-none bg-slate-200 rounded-full w-2"
              style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
            />
          </div>
        </aside>


        {/* CENTER: Canvas */}
        <main className="flex-1 bg-slate-100 p-8 flex items-center justify-center relative overflow-hidden">
          <div className="bg-white shadow-xl rounded-xl w-full h-full border border-slate-200 relative overflow-hidden cursor-crosshair">
            <CanvasBoard key={roundId} color={color} lineWidth={lineWidth} tool={tool} />
          </div>

          {/* MODAL OVERLAY: Lobby / Game Over */}
          {(gameState !== 'playing') && (
            <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-bounce-in">
                {gameState === 'lobby' && (
                  <>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Ready to Draw?</h2>
                    <p className="text-slate-500 mb-8">The AI will try to guess your drawing!</p>
                  </>
                )}
                {gameState === 'won' && (
                  <>
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-2">You Won!</h2>
                    <p className="text-slate-600 mb-8">The system correctly guessed <b>{currentWord}</b>.</p>
                  </>
                )}
                {gameState === 'lost' && (
                  <>
                    <div className="text-6xl mb-4">⌛</div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">Time's Up!</h2>
                    <p className="text-slate-600 mb-8">The word was <b>{currentWord}</b>.</p>
                  </>
                )}

                <button
                  onClick={handleStartGame}
                  className="bg-indigo-600 text-white w-full py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  {gameState === 'lobby' ? 'Start Game' : 'Play Again'}
                </button>
              </div>
            </div>
          )}
        </main>


        {/* RIGHT: Status & Chat */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-10">

          {/* Timer Panel */}
          <div className="p-6 border-b border-slate-100 flex flex-col items-center bg-slate-50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Left</div>
            <div className={`text-5xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-800'}`}>
              {timeLeft}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
            {systemGuesses.length === 0 && (
              <div className="text-center text-slate-300 text-sm mt-10">
                Game logs will appear here...
              </div>
            )}
            {systemGuesses.map(guess => (
              <div kye={guess.id} className={`p-3 rounded-lg border text-sm ${guess.isCorrect ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-600 text-xs">{guess.name}</span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <div className={`font-medium ${guess.isCorrect ? 'text-green-700 font-bold text-lg' : 'text-slate-800'}`}>
                  {guess.text}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
