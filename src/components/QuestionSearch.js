import React, { useState, useMemo, useEffect, useRef } from 'react';
import QuestionDetail from './QuestionDetail';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { franc } from 'franc-min';

function FilterableQuestionTable({
  onQuestionSelected,
  searchText,
  setSearchText,
  results,
  setResults,
  currentQuestions,
  setCurrentQuestions,
  selectedFilter,
  setSelectedFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  selectedButton,
  setSelectedButton,
}) {
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 64; // 16 * 4 = 64px
      const searchSectionHeight = 200; // Approximate height for search section
      const questionCardHeight = 160; // Approximate height for each question card
      const availableHeight =
        viewportHeight - headerHeight - searchSectionHeight;
      return Math.max(3, Math.floor(availableHeight / questionCardHeight));
    };
    setItemsPerPage(calculateItemsPerPage());
    window.addEventListener('resize', () =>
      setItemsPerPage(calculateItemsPerPage()),
    );
  }, []);

  const statesFunctions = {
    searchText,
    setSearchText,
    selectedFilter,
    setSelectedFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    onQuestionSelected,
    results,
    setResults,
    currentQuestions,
    setCurrentQuestions,
    selectedButton,
    setSelectedButton,
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

const recognizeImage = async (base64Image) => {
  try {
    // Run OCR with English (eng)
    const {
      data: { text: englishText },
    } = await Tesseract.recognize(base64Image, 'eng', {
      logger: (m) => console.log(m),
    });
    console.log('OCR Result (English):', englishText);

    // Run OCR with Chinese (chi_sim)
    const {
      data: { text: chineseText },
    } = await Tesseract.recognize(base64Image, 'chi_sim', {
      logger: (m) => console.log(m),
    });
    console.log('OCR Result (Chinese):', chineseText);

    // Use franc to detect language
    const englishLanguage = franc(englishText);
    const chineseLanguage = franc(chineseText);

    console.log('Language detected for English:', englishLanguage);
    console.log('Language detected for Chinese:', chineseLanguage);

    // Compare and select the best OCR result based on language detection
    let selectedText = englishText;
    let selectedLanguage = 'eng'; // Default to English

    if (chineseLanguage === 'cmn') {
      selectedText = chineseText;
      selectedLanguage = 'chi_sim'; // Use Chinese text
    }

    console.log('Selected Language:', selectedLanguage);
    console.log('Selected Text:', selectedText);

    return selectedText;
  } catch (error) {
    console.error('Error during OCR recognition:', error);
    return null;
  }
};

function UploadImage({ setSearchText }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.onload = async function () {
          console.log(img);
          const extractedText = await recognizeImage(img);
          setSearchText(extractedText.trim());
          console.log(extractedText);
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 ml-4 !rounded-button whitespace-nowrap text-gray-500"
        onClick={() => fileInputRef.current.click()}
      >
        <i className="fas fa-image mr-2"></i>
        Upload Image
      </button>
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
        <UploadImage setSearchText={setSearchText} />
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
  selectedFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onQuestionSelected,
  results,
  setResults,
  currentQuestions,
  setCurrentQuestions,
}) {
  const fetchQuestionData = async (searchText, setResults) => {
    try {
      if (searchText) {
        const response = await axios.post(
          '/api/queryQuestionBank',
          {
            searchText,
          },
        );
        setResults(response.data);
      }
    } catch (error) {
      console.error('Request failed: ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestionData(searchText, setResults);
    };
    fetchData();
  }, [searchText]);

  const currentQuestionsMemo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    let filtered = results.slice(startIndex, startIndex + itemsPerPage);
    if (selectedFilter) {
      let tFiltered = [...filtered];
      Object.entries(selectedFilter).forEach(([key, value]) => {
        filtered = tFiltered.filter((q) => q[key] === value);
      });
    }
    return filtered;
  }, [results, currentPage, itemsPerPage, selectedFilter]);

  useEffect(() => {
    setCurrentQuestions(currentQuestionsMemo);
  }, [currentQuestionsMemo]);

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <span className="text-gray-500">{results.length} questions found</span>
      </div>

      <div className="space-y-4">
        {currentQuestions.map((question) => (
          <QuestionRow
            question={question}
            key={question.id}
            onQuestionSelected={onQuestionSelected}
          />
        ))}
      </div>
      <PaginationButtons
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

function PaginationButtons({ currentPage, totalPages, handlePageChange }) {
  const buttons = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`px-4 py-2 mx-1 !rounded-button whitespace-nowrap ${
          currentPage === i
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {i}
      </button>,
    );
  }
  return buttons;
}

function QuestionRow({ question, onQuestionSelected }) {
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
        <button
          className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 !rounded-button whitespace-nowrap"
          onClick={() => onQuestionSelected(question)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function FilterTable({
  selectedFilter,
  setSelectedFilter,
  results,
  selectedButton,
  setSelectedButton,
}) {
  const [categories, setCategories] = useState({});
  const categoryKeys = [
    'examBoard',
    'syllabusCode',
    'subject',
    'yearOfExam',
    'session',
    'level',
  ];
  useEffect(() => {
    if (results.length > 0) {
      const tCategories = {};
      categoryKeys.forEach((title) => {
        const values = [];
        results.forEach((item) => {
          if (title in item) {
            values.push(item[title]);
          }
        });
        if (values.length > 0) {
          const valuesSet = new Set(values);
          tCategories[title] = Array.from(valuesSet);
        } else {
          console.log(`${title} missed in all objects or has no valid values.`);
        }
      });
      setCategories(tCategories);
    }
  }, [results]);

  let rowCounter = 0;

  const handleClick = (rowId, filter) => {
    setSelectedButton(null);
    setSelectedButton(rowId);
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <div className="w-80">
      {categoryKeys.map((category) => (
        <div className="bg-white rounded-lg shadow-sm p-6" key={category}>
          <FilterCategoryRow category={category} key={category} />
          <div>
            {categories[category]?.map((value, index) => (
              <FilterRow
                key={index}
                category={category}
                content={value}
                rowId={rowCounter++}
                selectedButton={selectedButton}
                handleClick={handleClick}
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
      {[category[0].toUpperCase(), ...category.slice(1)].join('')}
    </h3>
  );
}

function FilterRow({ category, content, rowId, selectedButton, handleClick }) {
  const filter = {};
  filter[category] = content;

  const isButtonSelected = (rowId) => {
    return selectedButton === rowId;
  };

  return (
    <button
      onClick={() => handleClick(rowId, filter)}
      className={`w-full text-left px-4 py-2 !rounded-button whitespace-nowrap text-black ${
        isButtonSelected(rowId)
          ? 'bg-blue-50 text-blue-600'
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      {content}
    </button>
  );
}

export default function QuestionSearch() {
  const [showDetail, setShowDetail] = useState(false);
  const [showFilterableQuestionTable, setShowFilterableQuestionTable] =
    useState(true);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleQuestionSelected = (question) => {
    setCurrentQuestion(question);
    setShowDetail(true);
    setShowFilterableQuestionTable(false);
  };
  const handleGoBack = () => {
    setShowDetail(false);
    setShowFilterableQuestionTable(true);
  };

  return (
    <>
      {showFilterableQuestionTable && (
        <FilterableQuestionTable
          onQuestionSelected={handleQuestionSelected}
          searchText={searchText}
          setSearchText={setSearchText}
          results={results}
          setResults={setResults}
          currentQuestions={currentQuestions}
          setCurrentQuestions={setCurrentQuestions}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      )}
      {showDetail && (
        <QuestionDetail onGoBack={handleGoBack} question={currentQuestion} />
      )}
    </>
  );
}
