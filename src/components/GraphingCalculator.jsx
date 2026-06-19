import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ZoomIn, ZoomOut } from "lucide-react";

export default function GraphingCalculator() {
  const canvasRef = useRef(null);
  const [equations, setEquations] = useState(["x^2", "2*x+1"]);
  const [inputVal, setInputVal] = useState("");
  const [scale, setScale] = useState(40);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const colors = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#fb923c"];

  const safeEval = (expr, x) => {
    try {
      const sanitized = expr
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/abs/g, "Math.abs")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/pi/g, "Math.PI")
        .replace(/e(?![a-zA-Z])/g, "Math.E");
      // eslint-disable-next-line no-new-func
      return new Function("x", `return ${sanitized}`)(x);
    } catch {
      return NaN;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2 + offset.x;
    const cy = H / 2 + offset.y;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    const gridStep = scale;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let x = cx % gridStep; x < W; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = cy % gridStep; y < H; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    for (let i = Math.floor(-cx / scale); i <= Math.floor((W - cx) / scale); i++) {
      if (i === 0) continue;
      const px = cx + i * scale;
      ctx.fillText(i, px, cy + 15);
    }
    ctx.textAlign = "right";
    for (let i = Math.floor(-cy / scale); i <= Math.floor((H - cy) / scale); i++) {
      if (i === 0) continue;
      const py = cy - i * scale;
      ctx.fillText(i, cx - 5, py + 4);
    }

    // Plot equations
    equations.forEach((eq, idx) => {
      if (!eq.trim()) return;
      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= W; px += 1.5) {
        const x = (px - cx) / scale;
        const y = safeEval(eq, x);
        const py = cy - y * scale;
        if (!isFinite(py) || Math.abs(py) > H * 5) { started = false; continue; }
        if (!started) { ctx.moveTo(px, py); started = true; }
        else { ctx.lineTo(px, py); }
      }
      ctx.stroke();
    });
  };

  useEffect(() => { draw(); }, [equations, scale, offset]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-semibold mb-3">Graphing Calculator</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {equations.map((eq, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
              <input
                value={eq}
                onChange={(e) => {
                  const arr = [...equations];
                  arr[i] = e.target.value;
                  setEquations(arr);
                }}
                placeholder="e.g. x^2, sin(x), 2*x+1"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={() => setEquations(equations.filter((_, j) => j !== i))}
                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputVal.trim()) {
                setEquations([...equations, inputVal.trim()]);
                setInputVal("");
              }
            }}
            placeholder="Add equation and press Enter"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => { if (inputVal.trim()) { setEquations([...equations, inputVal.trim()]); setInputVal(""); } }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => setScale((s) => Math.min(s + 10, 120))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setScale((s) => Math.max(s - 10, 10))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ZoomOut size={16} />
          </button>
          <button onClick={() => setOffset({ x: 0, y: 0 })} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
            Reset View
          </button>
          <span className="text-slate-500 text-xs ml-auto">Drag to pan • Scroll to zoom</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={380}
        className="w-full cursor-grab active:cursor-grabbing touch-none"
        style={{ display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();
          setScale((s) => Math.max(10, Math.min(120, s - e.deltaY * 0.1)));
        }}
      />
    </div>
  );
}