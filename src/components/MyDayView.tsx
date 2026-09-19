import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Volume2, Pill, Heart, PhoneCall, Sparkles } from 'lucide-react';
import { BackButton } from './BackButton';
import { INITIAL_MY_DAY_TASKS } from '../data/mockData';
import { DailyTaskItem } from '../types';

interface MyDayViewProps {
  onBack: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  isSpeaking: boolean;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  onBack,
  onSpeak,
  onStopSpeak,
  isSpeaking,
}) => {
  const [tasks, setTasks] = useState<DailyTaskItem[]>(INITIAL_MY_DAY_TASKS);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: DailyTaskItem = {
      id: `task-${Date.now()}`,
      time: newTime.trim() || 'Today',
      title: newTitle.trim(),
      category: 'routine',
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
    setNewTime('');
    setIsAdding(false);
  };

  const handleReadSchedule = () => {
    if (isSpeaking) {
      onStopSpeak();
      return;
    }

    const pending = tasks.filter((t) => !t.completed);
    const summary = `Here is your schedule for today. You have ${pending.length} pending items. ` +
      tasks
        .map(
          (t) =>
            `${t.time}: ${t.title}. Status: ${t.completed ? 'Already completed' : 'Pending'}.`
        )
        .join(' ');

    onSpeak(summary);
  };

  const getCategoryIcon = (category: DailyTaskItem['category']) => {
    switch (category) {
      case 'medicine':
        return <Pill className="w-5 h-5 text-rose-600" />;
      case 'call':
        return <PhoneCall className="w-5 h-5 text-purple-600" />;
      case 'alert':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      default:
        return <Heart className="w-5 h-5 text-emerald-600" />;
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <BackButton onClick={onBack} label="Back to Home" />

        <div className="flex items-center gap-2 text-purple-800 font-bold text-sm sm:text-base">
          <Calendar className="w-5 h-5 text-purple-700" />
          <span>My Day</span>
        </div>
      </div>

      {/* Screen Title & Progress Banner */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                📅
              </span>
              <span>Today's Important Tasks</span>
            </h2>
            <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed mt-1">
              Your gentle daily organizer for medicines, healthy walks, and family connections.
            </p>
          </div>

          {/* Voice Read Aloud */}
          <button
            type="button"
            onClick={handleReadSchedule}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-base sm:text-lg shadow-sm transition-all active:scale-[0.98] shrink-0 cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>{isSpeaking ? 'Stop Voice' : 'Read My Day Aloud'}</span>
          </button>
        </div>

        {/* Completion Progress pill */}
        <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-purple-950 text-base sm:text-lg">
            <CheckCircle2 className="w-6 h-6 text-purple-700" />
            <span>
              {completedCount} of {tasks.length} tasks completed
            </span>
          </div>
          <span className="text-sm font-semibold text-purple-800">
            {completedCount === tasks.length ? '🌟 All done! Wonderful job!' : 'Going at your own comfortable pace'}
          </span>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-3 sm:space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task.id)}
            className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 select-none ${
              task.completed
                ? 'bg-stone-100/80 border-stone-300 opacity-80'
                : 'bg-white border-stone-200 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <button
              type="button"
              aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
              className="mt-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-full"
            >
              {task.completed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-8 h-8 text-stone-400 hover:text-purple-600" />
              )}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  {task.time}
                </span>

                <span className="p-1 rounded-md bg-stone-50">
                  {getCategoryIcon(task.category)}
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                  task.completed ? 'text-stone-500 line-through' : 'text-stone-900'
                }`}
              >
                {task.title}
              </h3>

              {task.notes && (
                <p
                  className={`text-base sm:text-lg font-medium ${
                    task.completed ? 'text-stone-400' : 'text-stone-600'
                  }`}
                >
                  {task.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form or Button */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-purple-400 bg-stone-50 hover:bg-purple-50/50 text-stone-700 hover:text-purple-900 font-bold text-lg flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add a Reminder for Today</span>
        </button>
      ) : (
        <form
          onSubmit={handleAddTask}
          className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md space-y-4"
        >
          <h3 className="text-xl font-extrabold text-stone-900">
            Add a New Reminder
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="new-task-title" className="block text-sm font-bold text-stone-700 mb-1">
                Reminder Title
              </label>
              <input
                id="new-task-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Evening Vitamin Tablet, Water plants"
                className="w-full p-3.5 rounded-xl border border-stone-300 text-stone-900 text-base outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label htmlFor="new-task-time" className="block text-sm font-bold text-stone-700 mb-1">
                Time (e.g. 06:30 PM)
              </label>
              <input
                id="new-task-time"
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 06:00 PM"
                className="w-full p-3.5 rounded-xl border border-stone-300 text-stone-900 text-base outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 text-base cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-base shadow-xs transition cursor-pointer"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
