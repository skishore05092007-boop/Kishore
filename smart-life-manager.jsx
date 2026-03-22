import { useState, useEffect, useRef, useMemo } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg: #0F0F13;
    --card: #1A1A24;
    --border: #2A2A38;
    --primary: #6C63FF;
    --primary-light: #8B85FF;
    --green: #22C55E;
    --yellow: #F59E0B;
    --red: #EF4444;
    --text: #F1F1F5;
    --muted: #8888AA;
    --radius: 16px;
  }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); }
  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
  .header { padding: 16px 20px; background: var(--card); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 50; }
  .logo-box { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: white; }
  .header h1 { font-size: 15px; font-weight: 700; }
  .header p { font-size: 11px; color: var(--muted); }
  .main { flex: 1; overflow-y: auto; padding: 20px 16px 100px; }
  .page-title { font-size: 22px; font-weight: 800; margin-bottom: 20px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 16px; }
  .card h2 { font-size: 14px; font-weight: 700; margin-bottom: 14px; color: var(--text); }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .stat-val { font-size: 22px; font-weight: 800; }
  .stat-label { font-size: 11px; color: var(--muted); margin-top: 4px; }
  input { width: 100%; background: #12121A; border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; font-size: 13px; color: var(--text); font-family: inherit; outline: none; transition: border 0.2s; }
  input:focus { border-color: var(--primary); }
  input::placeholder { color: var(--muted); }
  .btn { background: var(--primary); color: white; border: none; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity 0.2s; white-space: nowrap; }
  .btn:hover { opacity: 0.88; }
  .btn-sm { padding: 7px 12px; font-size: 12px; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-red { background: var(--red); }
  .btn-green { background: var(--green); }
  .flex { display: flex; gap: 8px; align-items: center; }
  .flex-col { display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: center; justify-content: space-between; }
  .progress-wrap { background: #12121A; border-radius: 99px; height: 8px; overflow: hidden; margin-top: 6px; }
  .progress-bar { height: 8px; border-radius: 99px; transition: width 0.4s; }
  .tag { font-size: 11px; padding: 3px 10px; border-radius: 99px; font-weight: 600; display: inline-block; }
  .tag-purple { background: rgba(108,99,255,0.18); color: var(--primary-light); }
  .tag-green { background: rgba(34,197,94,0.15); color: var(--green); }
  .tag-yellow { background: rgba(245,158,11,0.15); color: var(--yellow); }
  .tag-red { background: rgba(239,68,68,0.15); color: var(--red); }
  .expense-row { background: #12121A; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; }
  .habit-row { background: #12121A; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .checkbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
  .checkbox.checked { background: var(--green); border-color: var(--green); }
  .strikethrough { text-decoration: line-through; color: var(--muted); }
  .chat-wrap { height: 220px; overflow-y: auto; background: #12121A; border-radius: 12px; padding: 12px; margin-bottom: 10px; }
  .msg { margin-bottom: 10px; }
  .msg-bot { text-align: left; }
  .msg-user { text-align: right; }
  .msg-bubble { display: inline-block; padding: 8px 12px; border-radius: 12px; font-size: 13px; max-width: 80%; }
  .msg-bot .msg-bubble { background: #1E1E2E; color: var(--text); }
  .msg-user .msg-bubble { background: var(--primary); color: white; }
  .streak-big { font-size: 64px; font-weight: 800; text-align: center; color: var(--primary); line-height: 1; }
  .streak-label { text-align: center; color: var(--muted); font-size: 13px; margin-top: 6px; }
  .milestone { background: #12121A; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .divider { height: 1px; background: var(--border); margin: 14px 0; }
  .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: var(--card); border-top: 1px solid var(--border); display: flex; padding: 8px 0 14px; z-index: 100; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 0; }
  .nav-icon { font-size: 20px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--muted); }
  .nav-item.active .nav-label { color: var(--primary-light); }
  .result-box { background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3); border-radius: 12px; padding: 14px; margin-top: 10px; text-align: center; }
  .result-val { font-size: 24px; font-weight: 800; color: var(--primary-light); }
  .result-label { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .currency-row { background: #12121A; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
  .toast { position: fixed; top: 70px; left: 50%; transform: translateX(-50%); background: var(--green); color: white; padding: 10px 24px; border-radius: 30px; font-size: 13px; font-weight: 700; z-index: 999; animation: fadeIn 0.3s, fadeOut 0.3s 1.7s forwards; }
  @keyframes fadeIn { from { opacity:0; transform: translate(-50%, -10px); } to { opacity:1; transform: translate(-50%, 0); } }
  @keyframes fadeOut { to { opacity:0; } }
  .empty { text-align: center; padding: 24px; color: var(--muted); font-size: 13px; }
`;

const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v) => { const nv = typeof v === "function" ? v(val) : v; setVal(nv); localStorage.setItem(key, JSON.stringify(nv)); };
  return [val, set];
};

const today = () => new Date().toISOString().slice(0, 10);

const AI_RESPONSES = {
  save: "Save at least 20% of your income. Try the 50/30/20 rule! 💰",
  budget: "Use the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings. 📊",
  invest: "Start SIP with as little as ₹500/month. Small steps = big results! 📈",
  sip: "SIP lets you invest a fixed amount monthly. ₹500/month at 12% for 10 years = ₹1.16L! 🚀",
  habit: "Build one habit at a time. Consistency beats intensity. 🔥",
  salary: "Allocate: 60% spend, 30% save, 10% invest. 💼",
  debt: "Pay high-interest debt first (avalanche method). 💳",
  goal: "Break big goals into small milestones. Track weekly! 🎯",
};
const getAIResponse = msg => {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(AI_RESPONSES)) if (lower.includes(key)) return AI_RESPONSES[key];
  return "Focus on consistent tracking and smart planning to achieve your financial goals. 🎯";
};

// ── DASHBOARD ──
function Dashboard({ expenses, goals, streak, budgetIncome }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExp = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, e) => s + e.amount, 0);
  const totalGoal = goals.reduce((s, g) => s + g.goal, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const goalPct = totalGoal > 0 ? Math.min(100, Math.round((totalSaved / totalGoal) * 100)) : 0;

  return (
    <div>
      <div className="page-title">Good day! 👋</div>
      <div className="grid2">
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--primary-light)" }}>🔥 {streak.count}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">₹{monthlyExp.toLocaleString("en-IN")}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: "var(--green)" }}>{goalPct}%</div>
          <div className="stat-label">Goal Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">₹{budgetIncome.toLocaleString("en-IN")}</div>
          <div className="stat-label">Monthly Income</div>
        </div>
      </div>

      <div className="card">
        <h2>💼 Budget Overview</h2>
        {budgetIncome > 0 ? (
          [["Needs (50%)", budgetIncome * 0.5, "var(--primary-light)", 50],
           ["Wants (30%)", budgetIncome * 0.3, "var(--yellow)", 30],
           ["Savings (20%)", budgetIncome * 0.2, "var(--green)", 20]].map(([label, val, color, pct]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div className="row" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>₹{Number(val).toLocaleString("en-IN")}</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-bar" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))
        ) : <div className="empty">Set your income in Finance tab to see budget</div>}
      </div>

      {goals.length > 0 && (
        <div className="card">
          <h2>🎯 Goals Summary</h2>
          {goals.slice(0, 3).map(g => {
            const pct = Math.min(100, Math.round((g.saved / g.goal) * 100));
            return (
              <div key={g.id} style={{ marginBottom: 12 }}>
                <div className="row" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{g.name}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{pct}%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${pct}%`, background: "var(--green)" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FINANCE ──
function Finance({ expenses, setExpenses, budgetData, setBudgetData }) {
  const [desc, setDesc] = useState(""); const [amount, setAmount] = useState(""); const [incomeInput, setIncomeInput] = useState("");
  const [salaryInput, setSalaryInput] = useState(""); const [salaryResult, setSalaryResult] = useState(null);

  const addExpense = () => {
    if (!desc.trim() || !amount || Number(amount) <= 0) return;
    setExpenses(prev => [{ id: Date.now().toString(), description: desc, amount: Number(amount), date: today() }, ...prev]);
    setDesc(""); setAmount("");
  };

  const salary = Number(salaryInput);

  return (
    <div>
      <div className="page-title">Finance 💰</div>

      <div className="card">
        <h2>💸 Expense Tracker · Total: ₹{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString("en-IN")}</h2>
        <div className="flex" style={{ marginBottom: 12 }}>
          <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && addExpense()} />
          <input placeholder="₹" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: 90 }} />
          <button className="btn btn-sm" onClick={addExpense}>+</button>
        </div>
        {expenses.length === 0 && <div className="empty">No expenses yet</div>}
        {expenses.slice(0, 8).map(exp => (
          <div key={exp.id} className="expense-row">
            <div className="row">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{exp.description}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{exp.date}</div>
              </div>
              <div className="flex">
                <span style={{ fontWeight: 700, color: "var(--red)" }}>₹{exp.amount.toLocaleString("en-IN")}</span>
                <button className="btn btn-sm btn-red" onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>📊 Budget Planner (50/30/20)</h2>
        <div className="flex" style={{ marginBottom: 12 }}>
          <input placeholder="Monthly income (₹)" type="number" value={incomeInput} onChange={e => setIncomeInput(e.target.value)} />
          <button className="btn btn-sm" onClick={() => setBudgetData({ income: Number(incomeInput) })}>Calculate</button>
        </div>
        {budgetData.income > 0 && [["Needs", 50, budgetData.income * 0.5, "var(--primary-light)"],
          ["Wants", 30, budgetData.income * 0.3, "var(--yellow)"],
          ["Savings", 20, budgetData.income * 0.2, "var(--green)"]].map(([label, pct, val, color]) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div className="row" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 13 }}>{label} ({pct}%)</span>
              <span style={{ fontWeight: 700, color }}>₹{Number(val).toLocaleString("en-IN")}</span>
            </div>
            <div className="progress-wrap"><div className="progress-bar" style={{ width: `${pct}%`, background: color }} /></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>🧠 Salary Planner (60/30/10)</h2>
        <div className="flex" style={{ marginBottom: 12 }}>
          <input placeholder="Your salary (₹)" type="number" value={salaryInput} onChange={e => setSalaryInput(e.target.value)} />
          <button className="btn btn-sm" onClick={() => setSalaryResult(salary)}>Plan</button>
        </div>
        {salaryResult > 0 && [["Spend", 60, salaryResult * 0.6, "var(--yellow)"],
          ["Save", 30, salaryResult * 0.3, "var(--green)"],
          ["Invest", 10, salaryResult * 0.1, "var(--primary-light)"]].map(([label, pct, val, color]) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div className="row" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 13 }}>{label} ({pct}%)</span>
              <span style={{ fontWeight: 700, color }}>₹{Number(val).toLocaleString("en-IN")}</span>
            </div>
            <div className="progress-wrap"><div className="progress-bar" style={{ width: `${pct}%`, background: color }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GOALS ──
function Goals({ goals, setGoals, habits, setHabits }) {
  const [goalName, setGoalName] = useState(""); const [goalAmt, setGoalAmt] = useState(""); const [savedAmt, setSavedAmt] = useState("");
  const [habitName, setHabitName] = useState("");

  useEffect(() => {
    const t = today();
    setHabits(prev => prev.map(h => h.date !== t ? { ...h, checked: false, date: t } : h));
  }, []);

  const addGoal = () => {
    if (!goalName.trim() || !goalAmt) return;
    setGoals(prev => [...prev, { id: Date.now().toString(), name: goalName, goal: Number(goalAmt), saved: Number(savedAmt) || 0 }]);
    setGoalName(""); setGoalAmt(""); setSavedAmt("");
  };

  const addHabit = () => {
    if (!habitName.trim()) return;
    setHabits(prev => [...prev, { id: Date.now().toString(), name: habitName, checked: false, date: today() }]);
    setHabitName("");
  };

  return (
    <div>
      <div className="page-title">Goals 🎯</div>

      <div className="card">
        <h2>💰 Savings Goals</h2>
        <div className="flex-col" style={{ marginBottom: 12 }}>
          <input placeholder="Goal name (e.g. Buy Phone)" value={goalName} onChange={e => setGoalName(e.target.value)} />
          <div className="flex">
            <input placeholder="Target ₹" type="number" value={goalAmt} onChange={e => setGoalAmt(e.target.value)} />
            <input placeholder="Saved ₹" type="number" value={savedAmt} onChange={e => setSavedAmt(e.target.value)} />
            <button className="btn btn-sm" onClick={addGoal}>+</button>
          </div>
        </div>
        {goals.length === 0 && <div className="empty">No goals yet. Add your first goal!</div>}
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.saved / goal.goal) * 100));
          return (
            <div key={goal.id} style={{ marginBottom: 14 }}>
              <div className="row" style={{ marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{goal.name}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>₹{goal.saved.toLocaleString("en-IN")} / ₹{goal.goal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex">
                  <span style={{ fontWeight: 700, color: "var(--green)", fontSize: 13 }}>{pct}%</span>
                  <button className="btn btn-sm btn-red" onClick={() => setGoals(prev => prev.filter(g => g.id !== goal.id))}>✕</button>
                </div>
              </div>
              <div className="progress-wrap"><div className="progress-bar" style={{ width: `${pct}%`, background: "var(--green)" }} /></div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2>📅 Habit Tracker · {habits.filter(h => h.checked).length}/{habits.length} done today</h2>
        <div className="flex" style={{ marginBottom: 12 }}>
          <input placeholder="New habit (e.g. Exercise 30 min)" value={habitName} onChange={e => setHabitName(e.target.value)} onKeyDown={e => e.key === "Enter" && addHabit()} />
          <button className="btn btn-sm" onClick={addHabit}>+</button>
        </div>
        {habits.length === 0 && <div className="empty">Add habits to track daily!</div>}
        {habits.map(habit => (
          <div key={habit.id} className="habit-row">
            <div className={`checkbox${habit.checked ? " checked" : ""}`} onClick={() => setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, checked: !h.checked } : h))}>
              {habit.checked && <span style={{ color: "white", fontSize: 12 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 13 }} className={habit.checked ? "strikethrough" : ""}>{habit.name}</span>
            <button className="btn btn-sm btn-red" onClick={() => setHabits(prev => prev.filter(h => h.id !== habit.id))}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TOOLS ──
function Tools() {
  const [sipP, setSipP] = useState("5000"); const [sipY, setSipY] = useState("10"); const [sipR, setSipR] = useState("12"); const [sipResult, setSipResult] = useState(null);
  const [inrAmount, setInrAmount] = useState("1000");
  const [messages, setMessages] = useState([{ id: "init", role: "bot", text: "Hi! Ask me about saving, budgeting, investing, SIP, habits or salary! 😊" }]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const calcSIP = () => {
    const P = Number(sipP), r = Number(sipR) / 100 / 12, n = Number(sipY) * 12;
    setSipResult(Math.round(P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))));
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim(); setChatInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userMsg }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + "b", role: "bot", text: getAIResponse(userMsg) }]);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const inr = Number(inrAmount) || 0;
  const currencies = [["🇺🇸 USD", inr * 0.012], ["🇪🇺 EUR", inr * 0.011], ["🇬🇧 GBP", inr * 0.0095], ["🇯🇵 JPY", inr * 1.79]];

  return (
    <div>
      <div className="page-title">Tools 🛠️</div>

      <div className="card">
        <h2>📈 SIP Calculator</h2>
        <div className="flex-col" style={{ marginBottom: 10 }}>
          <input placeholder="Monthly amount (₹)" type="number" value={sipP} onChange={e => setSipP(e.target.value)} />
          <div className="flex">
            <input placeholder="Years" type="number" value={sipY} onChange={e => setSipY(e.target.value)} />
            <input placeholder="Rate %" type="number" value={sipR} onChange={e => setSipR(e.target.value)} />
          </div>
          <button className="btn" onClick={calcSIP}>Calculate Future Value</button>
        </div>
        {sipResult && (
          <div className="result-box">
            <div className="result-val">₹{sipResult.toLocaleString("en-IN")}</div>
            <div className="result-label">Future Value after {sipY} years</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Invested: ₹{(Number(sipP) * Number(sipY) * 12).toLocaleString("en-IN")} · 
              Gain: ₹{(sipResult - Number(sipP) * Number(sipY) * 12).toLocaleString("en-IN")}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🌍 Currency Converter (INR)</h2>
        <input placeholder="Amount in ₹" type="number" value={inrAmount} onChange={e => setInrAmount(e.target.value)} style={{ marginBottom: 12 }} />
        {currencies.map(([flag, val]) => (
          <div key={flag} className="currency-row">
            <span style={{ fontSize: 13 }}>{flag}</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{val.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>🤖 AI Assistant</h2>
        <div className="chat-wrap">
          {messages.map(m => (
            <div key={m.id} className={`msg msg-${m.role}`}>
              <span className="msg-bubble">{m.text}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex">
          <input placeholder="Ask about saving, SIP, habits..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
          <button className="btn btn-sm" onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ── STREAK ──
function Streak({ streak, setStreak }) {
  const checkedToday = streak.lastDate === today();
  const milestones = [7, 14, 30, 60, 100];

  const checkIn = () => {
    if (checkedToday) return;
    setStreak({ count: streak.count + 1, lastDate: today() });
  };

  const motivational = [
    "Every day counts. Keep going! 💪",
    "Consistency is the key to success! 🔑",
    "You're building an unstoppable habit! 🚀",
    "Small steps every day = big results! 🎯",
    "Your future self will thank you! ⭐",
  ];
  const msg = motivational[streak.count % motivational.length];

  return (
    <div>
      <div className="page-title">Streak 🔥</div>
      <div className="card" style={{ textAlign: "center", padding: "32px 18px" }}>
        <div className="streak-big">{streak.count}</div>
        <div className="streak-label">Day Streak</div>
        <div style={{ fontSize: 13, color: "var(--muted)", margin: "12px 0 20px" }}>{msg}</div>
        <button className="btn" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={checkIn} disabled={checkedToday}>
          {checkedToday ? "✅ Checked in today!" : "🔥 Check In Today"}
        </button>
        {checkedToday && <div style={{ fontSize: 12, color: "var(--green)", marginTop: 10 }}>Come back tomorrow to continue your streak!</div>}
      </div>

      <div className="card">
        <h2>🏆 Milestones</h2>
        {milestones.map(m => (
          <div key={m} className="milestone">
            <span style={{ fontSize: 20 }}>{streak.count >= m ? "🏅" : "⬜"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m} Day Streak</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{streak.count >= m ? "Achieved! 🎉" : `${m - streak.count} days to go`}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>📊 Stats</h2>
        <div className="grid2">
          <div className="stat-card"><div className="stat-val" style={{ color: "var(--primary-light)" }}>{streak.count}</div><div className="stat-label">Current Streak</div></div>
          <div className="stat-card"><div className="stat-val" style={{ color: "var(--green)" }}>{streak.count}</div><div className="stat-label">Best Streak</div></div>
        </div>
        <button className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: 8 }} onClick={() => { if (window.confirm("Reset streak?")) setStreak({ count: 0, lastDate: "" }); }}>Reset Streak</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──
export default function SmartLifeManager() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenses, setExpenses] = useLocalStorage("slm_expenses", []);
  const [goals, setGoals] = useLocalStorage("slm_goals", []);
  const [habits, setHabits] = useLocalStorage("slm_habits", []);
  const [streak, setStreak] = useLocalStorage("slm_streak", { count: 0, lastDate: "" });
  const [budgetData, setBudgetData] = useLocalStorage("slm_budget", { income: 0 });
  const [toast, setToast] = useState("");

  const TABS = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "finance", icon: "💰", label: "Finance" },
    { id: "goals", icon: "🎯", label: "Goals" },
    { id: "tools", icon: "🛠️", label: "Tools" },
    { id: "streak", icon: "🔥", label: "Streak" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="logo-box">SL</div>
          <div>
            <h1>Smart Life Manager</h1>
            <p>Pro Version · by Kishore</p>
          </div>
        </div>

        <div className="main">
          {activeTab === "dashboard" && <Dashboard expenses={expenses} goals={goals} streak={streak} budgetIncome={budgetData.income} />}
          {activeTab === "finance" && <Finance expenses={expenses} setExpenses={setExpenses} budgetData={budgetData} setBudgetData={setBudgetData} />}
          {activeTab === "goals" && <Goals goals={goals} setGoals={setGoals} habits={habits} setHabits={setHabits} />}
          {activeTab === "tools" && <Tools />}
          {activeTab === "streak" && <Streak streak={streak} setStreak={setStreak} />}
        </div>

        <nav className="nav">
          {TABS.map(t => (
            <div key={t.id} className={`nav-item${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span className="nav-icon">{t.icon}</span>
              <span className="nav-label">{t.label}</span>
            </div>
          ))}
        </nav>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
