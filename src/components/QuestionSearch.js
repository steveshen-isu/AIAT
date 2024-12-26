import React, { useState, useMemo, useEffect } from "react";

function FilterableQuestionTable() {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [questions] = useState([
    {
      id: 1,
      questionTitle: "optimize performance issues",
      questionContent:
        "How to optimize performance issues in large-scale data processing?",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: 2022,
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
    {
      id: 2,
      questionTitle: "the best practices for inter-service communication",
      questionContent:
        "What are the best practices for inter-service communication in microservices?",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: "2023",
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
    {
      id: 3,
      questionTitle: "Data consistency issues",
      questionContent:
        "Data consistency issues encountered during Redis cluster deployment",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: "2024",
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
    {
      id: 4,
      questionTitle: "scheduling strategies",
      questionContent:
        "Resource scheduling strategies in Kubernetes container orchestration",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: "2022",
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
    {
      id: 5,
      questionTitle: "ensure transaction consistency",
      questionContent:
        "How to ensure transaction consistency in distributed systems?",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: "2024",
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
    {
      id: 6,
      questionTitle: "image lazy loading",
      questionContent:
        "Implementation of image lazy loading in frontend performance optimization",
      examBoard: "CAIE",
      syllabusCode: "9709",
      subject: "MATH",
      yearOfExam: "2021",
      session: "May/June",
      level: "P1",
      solutionContent:
        "The coefficient of \\(x^3\\) in \\((3 + 2ax)^5\\) is given by:\n\\[\\binom{5}{3} \\cdot 3^2 \\cdot (2a)^3 = 10 \\cdot 9 \\cdot 8a^3 = 720a^3.\\]\n\nThe coefficient of \\(x^2\\) in \\((2 + ax)^6\\) is given by:\n\\[\\binom{6}{2} \\cdot 2^4 \\cdot (a)^2 = 15 \\cdot 16 \\cdot a^2 = 240a^2.\\]\n\nEquating \\(6 \\cdot \\text{Coefficient of } x^2\\) to \\(\\text{Coefficient of } x^3\\):\n\\[720a^3 = 6 \\cdot 240a^2.\\]\n\nSimplifying:\n\\[720a^3 = 1440a^2,\\]\n\\[a = 2.\\]",
    },
  ]);

  const statesFunctions = {
    searchText,
    setSearchText,
    selectedFilter,
    setSelectedFilter,
    questions,
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 py-6 min-h-[1024px]">
        <SearchBar {...statesFunctions} />
        <div className="flex gap-8 mt-20">
          <QuestionTable {...statesFunctions} />
          <FilterTable {...statesFunctions} />
        </div>
      </div>
    </div>
  );
}

function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg shadow-md p-4">
        <i className="fas fa-search text-gray-400 text-lg mr-3"></i>
        <input
          type="text"
          placeholder="Enter your question description..."
          className="flex-1 text-base border-none outline-none"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 ml-4 !rounded-button whitespace-nowrap text-gray-500">
          <i className="fas fa-image mr-2"></i>
          Upload Image
        </button>
      </div>
      <button
        onClick={() => setSearchText(searchText)}
        className="absolute left-1/2 -translate-x-1/2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium !rounded-button whitespace-nowrap"
      >
        Search Questions
      </button>
    </div>
  );
}

function QuestionTable({
  searchText,
  setSearchText,
  selectedFilter,
  setSelectedFilter,
  questions,
}) {
  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    if (searchText) {
      filtered = filtered.filter((q) =>
        q.questionContent.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedFilter) {
      let tFiltered = [...filtered];
      Object.entries(selectedFilter).forEach(([key, value]) => {
        filtered = tFiltered.filter((q) => q[key] === value);
      });
    }
    return filtered;
  }, [questions, searchText, selectedFilter]);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <span className="text-gray-500">
          {filteredQuestions.length} questions found
        </span>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionRow question={question} key={question.id} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="px-4 py-2 mx-1 bg-white border border-gray-300 !rounded-button whitespace-nowrap text-black">
          Previous
        </button>
        <button className="px-4 py-2 mx-1 bg-blue-600 text-white !rounded-button whitespace-nowrap text-black">
          1
        </button>
        <button className="px-4 py-2 mx-1 bg-white border border-gray-300 !rounded-button whitespace-nowrap text-black">
          2
        </button>
        <button className="px-4 py-2 mx-1 bg-white border border-gray-300 !rounded-button whitespace-nowrap text-black">
          3
        </button>
        <button className="px-4 py-2 mx-1 bg-white border border-gray-300 !rounded-button whitespace-nowrap text-black">
          Next
        </button>
      </div>
    </div>
  );
}

function QuestionRow({ question }) {
  return (
    <div
      key={question.id}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 text-left">
            {question.questionTitle}
          </h3>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="mr-4">
              <i className="fas fa-book mr-1"></i>
              {question.subject}
            </span>
            <span className="mr-4">
              <i className="fas fa-calendar mr-1"></i>
              {question.yearOfExam}
            </span>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 !rounded-button whitespace-nowrap">
          View Details
        </button>
      </div>
    </div>
  );
}

function FilterTable({ selectedFilter, setSelectedFilter, questions }) {
  const [categories, setCategories] = useState({});
  const categoryKeys = [
    "examBoard",
    "syllabusCode",
    "subject",
    "yearOfExam",
    "session",
    "level",
  ];
  useEffect(() => {
    if (questions.length > 0) {
      const tCategories = {};
      categoryKeys.forEach((title) => {
        const isExists = questions.every((item) => title in item);
        if (isExists) {
          const valuesSet = new Set();
          const values = questions.map((item) => item[title]);
          values.forEach((value) => valuesSet.add(value));
          tCategories[title] = Array.from(valuesSet) || [];
        } else {
          console.log(`${title} missed in some objects.`);
        }
      });
      setCategories(tCategories);
    }
  }, []);

  return (
    <div className="w-80">
      {categoryKeys.map((category) => (
        <div className="bg-white rounded-lg shadow-sm p-6" key={category}>
          <FilterCategoryRow category={category} key={category} />
          <div className="border-t mt-6 pt-6">
            {categories[category]?.map((value, index) => (
              <FilterRow
                key={index}
                category={category}
                content={value}
                setSelectedFilter={setSelectedFilter}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterCategoryRow({ category }) {
  return (
    <h3 className="text-lg font-medium mb-4" key={category}>
      {category}
    </h3>
  );
}

function FilterRow({ category, content, selectedFilter, setSelectedFilter }) {
  const filter = {};
  filter[category] = content;
  return (
    <button
      key={content}
      onClick={() =>
        setSelectedFilter(selectedFilter === filter ? null : filter)
      }
      className={`w-full text-left px-4 py-2 !rounded-button whitespace-nowrap text-black ${
        selectedFilter === content
          ? "bg-blue-50 text-blue-600"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {content}
    </button>
  );
}

export default function QuestionSearch() {
  return <FilterableQuestionTable />;
}
