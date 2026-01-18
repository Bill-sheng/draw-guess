import { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing
  const [tool, setTool] = useState('brush'); // brush, eraser
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Game started!', type: 'system' }
  ]);
  const [guess, setGuess] = useState('');

  const colors = [
    '#000000', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: guess, type: 'user' }]);
    setGuess('');
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center transform -rotate-12 shadow-lg">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Draw & Guess</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="px-3 py-1 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 ring-2 ring-[var(--color-surface)] ring-offset-2 ring-offset-[var(--color-primary)]"></div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {gameState === 'lobby' ? (
          <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-surface)] via-[var(--color-bg)] to-[var(--color-bg)]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-8 bg-[var(--color-surface)] rounded-xl shadow-2xl border border-[var(--color-border)] w-full max-w-md text-center">
                <h2 className="text-3xl font-bold mb-2">Ready to Play?</h2>
                <p className="text-[var(--color-text-muted)] mb-8">Join the room to start drawing and guessing with friends!</p>

                <div className="space-y-4">
                  <button
                    className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-indigo-500/20"
                    onClick={() => setGameState('playing')}
                  >
                    Join Game
                  </button>
                  <button className="btn w-full py-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    Create Private Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* Sidebar / Players */}
            <div className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col gap-6">
              <div>
                <h3 className="font-semibold mb-4 text-[var(--color-text-muted)] uppercase text-xs tracking-wider flex items-center gap-2">
                  Players <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text)] text-[10px]">4</span>
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-primary)]/30 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate text-sm">You</span>
                        <span className="text-xs font-bold text-[var(--color-primary)]">1200</span>
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">Drawing now...</div>
                    </div>
                  </div>

                  {[2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded opacity-70 hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-sm">Player {i}</span>
                          <span className="text-xs font-bold text-[var(--color-text-muted)]">{800 - i * 100}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative bg-[var(--color-bg)] flex flex-col">
              {/* Floating Header */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                <div className="bg-[var(--color-surface)] px-6 py-2 rounded-full shadow-xl border border-[var(--color-border)] flex items-center gap-6 backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-mono text-xl font-bold tabular-nums">00:45</span>
                  </div>
                  <div className="w-px h-6 bg-[var(--color-border)]"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-wide">Word</span>
                    <span className="text-[var(--color-text)] font-bold tracking-[0.3em] text-lg">APPLE</span>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 m-4 mb-20 bg-white rounded-2xl shadow-inner relative overflow-hidden cursor-crosshair border-4 border-slate-200">
                <CanvasBoard color={color} lineWidth={lineWidth} tool={tool} />
              </div>

              {/* Bottom Toolbar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] p-2 rounded-2xl shadow-xl border border-[var(--color-border)] flex items-center gap-4 backdrop-blur-sm bg-opacity-90">
                <div className="flex bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border)]">
                  <button
                    className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-[var(--color-surface-hover)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                    onClick={() => { setTool('brush'); setLineWidth(5); }}
                    title="Brush"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-[var(--color-surface-hover)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                    onClick={() => { setTool('eraser'); setLineWidth(20); }}
                    title="Eraser"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="w-px h-8 bg-[var(--color-border)]"></div>

                <div className="flex gap-2 px-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool !== 'eraser' ? 'border-[var(--color-text)] scale-110 shadow-md' : 'border-[var(--color-border)]'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => { setColor(c); setTool('brush'); }}
                    ></button>
                  ))}
                </div>

                <div className="w-px h-8 bg-[var(--color-border)]"></div>

                <div className="flex bg-[var(--color-bg)] rounded-xl p-1 border border-[var(--color-border)] text-xs font-medium">
                  {[2, 5, 10, 20].map(s => (
                    <button
                      key={s}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${lineWidth === s && tool !== 'eraser' ? 'bg-[var(--color-surface-hover)] text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}
                      onClick={() => { setLineWidth(s); setTool('brush'); }}
                    >
                      <div className="bg-[var(--color-text)] rounded-full" style={{ width: s / 2 + 2, height: s / 2 + 2 }}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-80 border-l border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
              <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm z-10">
                <h3 className="font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Game Chat</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`text-sm ${msg.sender === 'System' ? 'text-center text-[var(--color-text-muted)] my-2 text-xs uppercase tracking-widest' : ''}`}>
                    {msg.sender !== 'System' && (
                      <span className={`font-bold mr-2 ${msg.sender === 'You' ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'}`}>
                        {msg.sender}:
                      </span>
                    )}
                    <span className={msg.sender === 'System' ? '' : 'text-[var(--color-text)]'}>{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type your guess here..."
                    className="input w-full pr-10"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
