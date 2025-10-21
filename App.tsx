
import React, { useState, useCallback } from 'react';
import { analyzeFeedback } from './services/geminiService';
import ReportDisplay from './components/ReportDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const placeholderText = "Example: 'I love the taste of Idabro’s Peanut Oil, but the bottle leaked during delivery.'\n'The rich, nutty flavor is incredible, best peanut oil I've ever used!'\n'My order arrived late and the box was damaged. Disappointed with the shipping.'";

  const handleAnalyzeClick = useCallback(async () => {
    if (!feedbackText.trim()) {
      setError("Please paste some feedback before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisReport(null);

    try {
      const report = await analyzeFeedback(feedbackText);
      setAnalysisReport(report);
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing the feedback. Please check your connection and API key, then try again.");
    } finally {
      setIsLoading(false);
    }
  }, [feedbackText]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-800 mb-2">
            💬 Idabro’s Customer Feedback Analyzer
          </h1>
          <p className="text-lg text-stone-600">
            Paste customer reviews about Idabro’s Peanut Oil below to instantly get an AI-powered feedback analysis and improvement report.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 ring-1 ring-stone-200">
          <label htmlFor="feedback-input" className="block text-lg font-semibold text-stone-700 mb-2">
            Paste Customer Feedback Here
          </label>
          <textarea
            id="feedback-input"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={placeholderText}
            className="w-full h-48 p-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200 resize-y text-base"
            disabled={isLoading}
          />
          <div className="mt-4 text-right">
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading || !feedbackText.trim()}
              className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Feedback'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Loader />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {analysisReport && (
          <div className="mt-8">
            <ReportDisplay report={analysisReport} />
          </div>
        )}
      </main>

       <footer className="text-center mt-12 text-stone-500 text-sm">
          <p>Powered by Gemini API | Designed for Idabro's Peanut Oil</p>
        </footer>
    </div>
  );
};

export default App;
