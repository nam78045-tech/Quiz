import { useState, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { ChevronLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AddQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const parseText = () => {
    if (!rawText.trim()) return;

    // Enhanced regex to catch A), A:, A., [A] followed by space or line break
    const splitRegex = /(?:\n|^)(?=[A-D][).:\-\]])/i;
    const parts = rawText.split(splitRegex).map(p => p.trim()).filter(Boolean);

    if (parts.length >= 5) {
      setQuestionText(parts[0]);
      setOptions({
        A: parts[1].replace(/^[A][).:\-\]]\s*/i, ''),
        B: parts[2].replace(/^[B][).:\-\]]\s*/i, ''),
        C: parts[3].replace(/^[C][).:\-\]]\s*/i, ''),
        D: parts[4].replace(/^[D][).:\-\]]\s*/i, '')
      });
      setError('');
    } else {
      // Fallback: try different split if parts are missing
      const altSplit = /\s+(?=[A-D][).:\-\]])/i;
      const altParts = rawText.split(altSplit).map(p => p.trim()).filter(Boolean);
      
      if (altParts.length >= 5) {
        setQuestionText(altParts[0]);
        setOptions({
          A: altParts[1].replace(/^[A][).:\-\]]\s*/i, ''),
          B: altParts[2].replace(/^[B][).:\-\]]\s*/i, ''),
          C: altParts[3].replace(/^[C][).:\-\]]\s*/i, ''),
          D: altParts[4].replace(/^[D][).:\-\]]\s*/i, '')
        });
        setError('');
      } else {
        setError('Could not clearly identify 4 options. Please check formatting (e.g. A) Option)');
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !questionText || !options.A || !options.B || !options.C || !options.D) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await quizService.addQuestion({
        subjectId: id,
        questionText,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer
      });
      navigate(`/subject/${id}`);
    } catch (err) {
      setError('Failed to save question');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="space-y-2">
        <Link to={`/subject/${id}`} className="flex items-center gap-2 text-sm font-black uppercase text-gray-500 hover:text-black transition-colors mb-4 group">
          <div className="bg-white border-2 border-black p-1 rounded group-hover:bg-[#4ECDC4] transition-all">
            <ChevronLeft size={16} strokeWidth={3} />
          </div>
          Back to Subject
        </Link>
        <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter">Add Knowledge</h1>
        <p className="text-lg font-bold text-gray-500">Manual entry or high-speed regex parsing.</p>
      </div>

      <div className="grid gap-10">
        {/* Quick Paste Segment */}
        <section className="bg-[#4ECDC4] border-4 border-black p-8 rounded-[40px] neo-brutal-shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tighter text-black flex items-center gap-2">
              <Sparkles size={20} fill="currentColor" /> Regex Parser
            </h2>
            <button 
              onClick={parseText}
              className="bg-[#FFE66D] border-4 border-black px-6 py-2 rounded-xl font-black uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
            >
              Parse Raw Text
            </button>
          </div>
          <textarea 
            placeholder="Paste raw trắc nghiệm questions here...&#10;Q: Capital of France?&#10;A) Paris&#10;B) Lyon..."
            rows={6}
            className="w-full p-4 bg-white border-4 border-black rounded-2xl focus:outline-none font-mono text-sm leading-relaxed"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-black/5 rounded-2xl border-4 border-black border-dashed">
            <p className="text-sm font-black uppercase text-black/60 shrink-0">Mark Correct Answer:</p>
            <div className="flex gap-2 w-full sm:w-auto">
              {(['A', 'B', 'C', 'D'] as const).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCorrectAnswer(key)}
                  className={cn(
                    "flex-1 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border-4 border-black font-black transition-all neo-brutal-shadow-teal",
                    correctAnswer === key ? "bg-[#FFE66D] translate-x-0.5 translate-y-0.5 shadow-none" : "bg-white hover:bg-gray-50"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
            <button 
              type="submit"
              form="manual-form"
              className="w-full sm:w-auto px-6 py-3 bg-[#FF6B6B] border-4 border-black rounded-xl font-black uppercase text-xs text-white neo-brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ml-auto"
            >
              Quick Save
            </button>
          </div>
        </section>

        {/* Manual Form */}
        <form id="manual-form" onSubmit={handleSave} className="bg-white border-4 border-black p-10 rounded-[40px] neo-brutal-shadow-lg space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-[#FF6B6B] text-white border-4 border-black rounded-xl font-black text-sm">
              <AlertCircle size={20} strokeWidth={3} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-black uppercase tracking-widest text-[#1A1A1A]">Entry Content</label>
            <textarea 
              required
              rows={4}
              placeholder="Type your question prompt here..."
              className="w-full px-5 py-3 border-4 border-black rounded-2xl focus:outline-none font-bold"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="grid gap-6">
            {(['A', 'B', 'C', 'D'] as const).map(key => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Variant {key}</label>
                  <label 
                    className={cn(
                      "flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border-2 border-transparent transition-all",
                      correctAnswer === key ? "bg-[#4ECDC4] border-black" : "hover:bg-gray-100"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase text-black">Correct?</span>
                    <input 
                      type="radio" 
                      name="correctAnswer" 
                      checked={correctAnswer === key}
                      onChange={() => setCorrectAnswer(key)}
                      className="w-4 h-4 text-black border-2 border-black focus:ring-0"
                    />
                  </label>
                </div>
                <input 
                  required
                  type="text" 
                  placeholder={`Option ${key} text...`}
                  className={cn(
                    "w-full px-5 py-3 border-4 border-black rounded-2xl focus:outline-none font-bold transition-all",
                    correctAnswer === key ? "bg-[#4ECDC4]/10 neo-brutal-shadow-teal scale-[1.01]" : "bg-white"
                  )}
                  value={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#FF6B6B] text-white py-4 rounded-2xl border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-lg neo-brutal-shadow-teal disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Save size={24} strokeWidth={3} />
            {isSubmitting ? 'Syncing...' : 'Save into Bank'}
          </button>
        </form>
      </div>
    </div>
  );
}
