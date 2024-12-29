import React from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import TypewriterResponsePlain from "./TypeWriterResponsePlain";

const QuestionHeader = ({ title, date }) => {
  return (
    <div className="border-b border-gray-100 pb-6 mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h1>
      <div className="flex items-center text-sm text-gray-500 space-x-6">
        <span className="flex items-center">{date}</span>
      </div>
    </div>
  );
};

const QuestionDescription = ({ description }) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Problem Description
      </h2>
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        <TypewriterResponsePlain content={description || ''} />
      </div>
    </div>
  );
};

const Solution = ({ solution, onGoBack }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Solution</h2>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 mb-6 prose max-w-none">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-gray-700 leading-relaxed">
            <TypewriterResponsePlain content={solution || ''} />
          </div>
          <BackButton onGoBack={onGoBack} />
        </div>
      </div>
    </div>
  );
};

function BackButton({ onGoBack }) {
  return (
    <div className="flex justify-start">
      <button
        onClick={onGoBack}
        className="flex items-center px-6 py-3 text-sm text-gray-600 bg-gray-100 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors duration-200 ease-in-out!rounded-button whitespace-nowrap shadow-sm"
      >
        <i className="fa-solid fa-arrow-left mr-2 text-gray-500" />
        Back to Question Search
      </button>
    </div>
  );
}

function QuestionDetail({ onGoBack, question }) {
  return (
    <div className="min-h-[1024px] w-[1440px] mx-auto bg-gray-50 text-left">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-10">
          <QuestionHeader
            title={question.questionTitle}
            date={question.yearOfExam}
          />
          <QuestionDescription description={question.questionContent} />
          <Solution solution={question.solutionContent} onGoBack={onGoBack} />
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
