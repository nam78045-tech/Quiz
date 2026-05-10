import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { ChevronLeft, Save, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EditQuestion() {
  const { subjectId, questionId } = useParams<{ subjectId: string; questionId: string }>();
  const navigate = useNavigate();
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (questionId && subjectId) {
      loadQuestion();
    }
  }, [questionId, subjectId]);

  const loadQuestion = async () => {
    const questions = await quizService.getQuestions(subjectId!);
    const q = questions.find(item => item.id === questionId);
    if (q) {
      setQuestionText(q.questionText);
      setOptions({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD });
      setCorrectAnswer(q.correctAnswer);
      setLoading(false);
    } else {
      setError('Question not found');
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionId || !questionText) return;

    setIsSubmitting(true);
    try {
      await quizService.updateQuestion(questionId, {
        questionText,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer
      });
      navigate(`/subject/${subjectId}`);
    } catch (err) {
      setError('Failed to update question');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await quizService.deleteQuestion(questionId!);
      navigate(`/subject/${subjectId}`);
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Link to={`/subject/${subjectId}`} className="flex items-center gap-2 text-sm font-black uppercase text-gray-400 hover:text-black transition-colors mb-4 group">
            <div className="bg-white border-2 border-black p-1 rounded group-hover:bg-[#FFE66D]">
              <ChevronLeft size={16} strokeWidth={3} />
            </div>
            Back to Subject
          </Link>
          <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter">Edit Content</h1>
        </div>
        <button 
          onClick={handleDelete}
          className="bg-white border-4 border-black p-4 rounded-2xl hover:bg-[#FF6B6B] hover:text-white transition-all neo-brutal-shadow"
        >
          <Trash2 size={24} strokeWidth={3} />
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white border-4 border-black p-10 rounded-[40px] neo-brutal-shadow-lg space-y-8">
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
          className="w-full bg-[#FFE66D] text-black py-4 rounded-2xl border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-lg neo-brutal-shadow disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <Save size={24} strokeWidth={3} />
          {isSubmitting ? 'Syncing...' : 'Update Record'}
        </button>
      </form>
    </div>
  );
}
