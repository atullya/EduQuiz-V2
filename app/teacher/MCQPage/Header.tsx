"use client";

import { Brain, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            MCQ Generator
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <p className="text-gray-600">
          Transform your content into engaging multiple-choice questions
        </p>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>
    </div>
  );
};

export default Header;
