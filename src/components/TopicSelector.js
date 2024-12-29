import React, { useState, useEffect, useRef} from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import html2pdf from 'html2pdf.js';
import TypewriterRendererExample from './TypeWriterExample';
import TypewriterRenderer from './TypeWriterRender';
import TypewriterRendererResponse from './TypeWriterResponse';
const currentUrl = window.location.href;
console.log(currentUrl); // Example: "https://example.com/page"
const ipAddress = currentUrl.split(':')[1].split('/')[2];
console.log(ipAddress);


















function TopicSelector() {
    const [subjects, setSubjects] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTextbook, setSelectedTextbook] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState('');

    const [chapterSummary, setChapterSummary] = useState('');
    const [topicSummary, setTopicSummary] = useState('');
    const [questionSolution, setQuestionSolution] = useState('');
    const [userQuestion, setUserQuestion] = useState('');
    const [response, setResponse] = useState('Hello! How may I help you today?');
    const [responseEquations, setResponseEquations] = useState('');
    const [responseExample, setResponseExample] = useState('');


    const [showChapterSummary, setShowChapterSummary] = useState(false);
    const [showTopicSummary, setShowTopicSummary] = useState(false);
    const [showQuestionSolution, setShowQuestionSolution] = useState(false);


    const [showPDFModal, setShowPDFModal] = useState(false); // State for controlling the modal visibility

    console.log('Fetching from URL:', '/api/subjects');

    window.handleEquationQuestion = async (equation, action) => {
        try {
            setResponse('');
            setResponseEquations('');
            setResponseExample('');
            const res = await fetch('http://localhost:200/api/query-equation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    equation,
                    action, // "what" or "how"
                }),
            });

            const data = await res.json();
            setResponseEquations(data.responseEquations);
/*             console.log(data.responseEquations);  // Do something with the response
 */        } catch (error) {
            console.error('Error:', error);
        }

    };

    console.log(responseEquations)


    window.handleExampleQuestion = async (questionpart) => {
        try {
            setResponse('');
            setResponseEquations('');
            setResponseExample('');
            const res = await fetch('http://localhost:200/api/query-example', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    example: questionpart,
                    questionSolution: questionSolution,
                }),
            });

            const data = await res.json();
            setResponseExample(data.responseExample);
/*             console.log(data.responseEquations);  // Do something with the response
 */        } catch (error) {
            console.error('Error:', error);
        }

    };


    useEffect(() => {
        // Fetch subjects using the fetch API
        fetch('http://' + ipAddress + ':200/api/subjects')
            .then((response) => response.json())
            .then((data) => setSubjects(data))
            .catch((error) => console.error('Error fetching subjects:', error));
    }, []);

    const handleSubjectChange = (subjectId) => {

        setSelectedSubject(subjectId);
        setTextbooks([]);
        setChapters([]);
        setTopics([]);
        setQuestions([]);
        // Fetch textbooks based on subjectId
        fetch('http://' + ipAddress + `:200/api/textbooks/${subjectId}`)
            .then((response) => response.json())
            .then((data) => setTextbooks(data))
            .catch((error) => console.error('Error fetching textbooks:', error));
    };

    const handleTextbookChange = (textbookId) => {
        setSelectedTextbook(textbookId);
        setChapters([]);
        setTopics([]);
        setQuestions([]);
        // Fetch chapters based on textbookId
        fetch('http://' + ipAddress + `:200/api/chapters/${textbookId}`)
            .then((response) => response.json())
            .then((data) => setChapters(data))
            .catch((error) => console.error('Error fetching chapters:', error));
    };

    const handleChapterChange = (chapterId) => {
        setSelectedChapter(chapterId);
        // Fetch chapter summary
        fetch('http://' + ipAddress + `:200/api/chapter-summary/${chapterId}`)
            .then((response) => response.json())
            .then((data) => setChapterSummary(data.summary))
            .catch((error) => console.error('Error fetching chapter summary:', error));

        // Fetch topics based on chapterId
        fetch('http://' + ipAddress + `:200/api/topics/${chapterId}`)
            .then((response) => response.json())
            .then((data) => setTopics(data))
            .catch((error) => console.error('Error fetching topics:', error));
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopic(topicId);
        // Fetch topic summary
        fetch('http://' + ipAddress + `:200/api/topic-summary/${topicId}`)
            .then((response) => response.json())
            .then((data) => setTopicSummary(data.summary))
            .catch((error) => console.error('Error fetching topic summary:', error));

        // Fetch questions based on topicId
        fetch('http://' + ipAddress + `:200/api/questions/${topicId}`)
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error('Error fetching questions:', error));
    };




    const handleQuestionChange = (questionId) => {
        setSelectedQuestion(questionId);
        // Fetch question and solution
        fetch('http://' + ipAddress + `:200/api/question/${questionId}`)
            .then((response) => response.json())
            .then((data) => setQuestionSolution(data.solution))
            .catch((error) => console.error('Error fetching question solution:', error));
    };

    console.log('Latex Code on render:', questionSolution);
    /*     console.log('html on render:', renderContentWithLatex(latexCode)); */


    let latexCodeSent = ''; // Declare latexCodeSent outside the conditions

    if (showChapterSummary) {
        latexCodeSent = chapterSummary;
    } else if (showTopicSummary) {
        latexCodeSent = topicSummary;
    } else if (showQuestionSolution) {
        latexCodeSent = questionSolution;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse('');
        setResponseEquations('');
        try {
            const res = await fetch('http://' + ipAddress + ':200/api/chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: userQuestion,
                    latexCode: latexCodeSent,
                })
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const chapterPdfContentRef = useRef();
    const generateChapterPDF = () => {
        const element = chapterPdfContentRef.current; // Get the rendered HTML content
        const options = {
            filename: 'chaptersummary.pdf',
            margin: [20, 20], // Adjust margin
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            html2canvas: {
                backgroundColor: 'white', // Ensure the background is white
                ignoreElements: (el) => el.tagName === 'BUTTON', // Ignore buttons and other unwanted elements
                letterRendering: true, // Improve font rendering
            },
            pagebreak: { mode: ['avoid-all', 'css'] }, // Better control over page breaks
        };

        // Generate the PDF from the HTML content
        html2pdf().from(element).set(options).save();
        
        // Show the modal after PDF generation
        setShowPDFModal(true);
    };
/*     const generateTopicPDF = () => {
        const doc = new jsPDF();
        doc.text(topicSummary, 10, 10);  // Customize the content location (10, 10)
        doc.save('topic.pdf');   // Download the PDF with the given name
        setShowPDFModal(true); // Show the modal after generating the PDF
    };

    const generateQuestionPDF = () => {
        const doc = new jsPDF();
        doc.text(questionSolution, 10, 10);  // Customize the content location (10, 10)
        doc.save('question_solution.pdf');   // Download the PDF with the given name
        setShowPDFModal(true); // Show the modal after generating the PDF
    }; */


    console.log('response from openai', response);
    return (

        <div style={styles.container}>
            <div style={styles.left}>
                <div>
                    <h1 style={{
                        color: 'white',            // Use camelCase for CSS properties
                        fontSize: '32px',         // font-size becomes fontSize
                        textAlign: 'center',      // text-align becomes textAlign
                        fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                        fontWeight: 'lighter',        // Bold text
                        fontStyle: 'normal',       // Italic text
                    }}>
                        Select a Chapter you are interested in
                    </h1>




                    {/* Subject Select */}
                    <select className="custom-select-modern" value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>

                    {/* Textbook Select */}
                    <select className="custom-select-modern" value={selectedTextbook} onChange={(e) => handleTextbookChange(e.target.value)} disabled={!selectedSubject}>
                        <option value="">Select Textbook</option>
                        {textbooks.map((textbook) => (
                            <option key={textbook.id} value={textbook.id}>
                                {textbook.name}
                            </option>
                        ))}
                    </select>
                    <div>
                        {/* Chapter Select */}
                        <select className="custom-select-modern" value={selectedChapter} onChange={(e) => handleChapterChange(e.target.value)} disabled={!selectedTextbook}>
                            <option value="">Select Chapter</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.name}
                                </option>
                            ))}
                        </select>

                        {/* Show Chapter Summary Button */}
                        <button className="custom-button-modern"
                            onClick={() => {
                                setShowChapterSummary(true)
                                setShowTopicSummary(false);
                                setShowQuestionSolution(false);
                            }}

                            disabled={!selectedChapter}
                        >
                            Show Chapter Summary
                        </button>
                    </div>
                    <div>
                        {/* Topic Select */}
                        <select className="custom-select-modern" value={selectedTopic} onChange={(e) => handleTopicChange(e.target.value)} disabled={!selectedChapter}>
                            <option value="">Select Topic</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>


                        {/* Show Topic Summary Button */}
                        <button className="custom-button-modern"
                            onClick={() => {
                                setShowChapterSummary(false)
                                setShowTopicSummary(true);
                                setShowQuestionSolution(false);
                            }}
                            disabled={!selectedTopic}
                        >
                            Show Topic Summary
                        </button>
                    </div>
                    {/* Question Select */}
                    <select className="custom-select-modern" value={selectedQuestion} onChange={(e) => handleQuestionChange(e.target.value)} disabled={!selectedTopic}>
                        <option value="">Select Question</option>
                        {questions.map((question) => (
                            <option key={question.id} value={question.id}>
                                {question.question}
                            </option>
                        ))}
                    </select>

                    {/* Show Question and Solution Button */}
                    <button className="custom-button-modern"
                        onClick={() => {
                            setShowChapterSummary(false)
                            setShowTopicSummary(false);
                            setShowQuestionSolution(true);
                        }}
                        disabled={!selectedQuestion}
                    >
                        Show Question and Solution
                    </button>

                    {/* Display Chapter Summary */}
                    {showChapterSummary && chapterSummary && (

                        <div>
                            <button
                                className="custom-button-modern"
                                onClick={generateChapterPDF}
                                disabled={!showChapterSummary}
                            >
                                Download as PDF
                            </button>
                            <h1 style={{
                                color: 'white',            // Use camelCase for CSS properties
                                fontSize: '32px',         // font-size becomes fontSize
                                textAlign: 'center',      // text-align becomes textAlign
                                fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                                fontWeight: 'lighter',        // Bold text
                                fontStyle: 'normal',       // Italic text
                            }}>
                                Chapter Summary
                            </h1> 
                            <div ref={chapterPdfContentRef}>
                            <TypewriterRenderer content={chapterSummary} />
                            </div>
                            {showPDFModal && (
                                <div className="pdf-modal-overlay">
                                    <div className="pdf-modal-content">
                                        <h2>PDF Generated!</h2>
                                        <p>Your PDF is ready for download.</p>
                                        <button onClick={() => setShowPDFModal(false)}>Close</button>
                                    </div>
                                </div>
                            )}

                            {/* Optional: Add a blur effect to the background when the modal is shown */}
                            {showPDFModal && <div className="blur-background"></div>}
                        </div>
                    )}

                    {/* Display Topic Summary */}
                    {showTopicSummary && topicSummary && (
                        <div>
                            <h1 style={{
                                color: 'white',            // Use camelCase for CSS properties
                                fontSize: '32px',         // font-size becomes fontSize
                                textAlign: 'center',      // text-align becomes textAlign
                                fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                                fontWeight: 'lighter',        // Bold text
                                fontStyle: 'normal',       // Italic text
                            }}>
                                Topic Summary
                            </h1> <TypewriterRendererResponse content={topicSummary} />
                        </div>
                    )}

                    {/* Display Question Solution */}
                    {showQuestionSolution && questionSolution && (
                        <div>
                            <h1 style={{
                                color: 'white',            // Use camelCase for CSS properties
                                fontSize: '32px',         // font-size becomes fontSize
                                textAlign: 'center',      // text-align becomes textAlign
                                fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                                fontWeight: 'lighter',        // Bold text
                                fontStyle: 'normal',       // Italic text
                            }}>
                                Question and Solution
                            </h1> <TypewriterRendererExample content={questionSolution} />
                        </div>
                    )}
                    <div></div>

                </div>

            </div>
            <div style={styles.right}>
                <h1 style={{
                    color: 'white',            // Use camelCase for CSS properties
                    fontSize: '32px',         // font-size becomes fontSize
                    textAlign: 'center',      // text-align becomes textAlign
                    fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                    fontWeight: 'lighter',        // Bold text
                    fontStyle: 'normal',       // Italic text
                }}>
                    Ask your question about the content
                </h1>
                <div className="input-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div>
                            {/*                         <label htmlFor="question">Your Question:</label>
 */}                        <textarea className="custom-textarea"
                                id="question"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                rows="4"
                                cols="50"
                            />

                            <button className="submit-button" type="submit">&#9658;</button>
                        </div>
                    </form>

                </div>
                {!response && !responseEquations && !responseExample && (
                    <div
                        id="loading-animation"
                        className="loading-animation"
                        style={{ display: response ? 'none' : 'inline-block' }} // Dynamically control visibility
                    >
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                )}
                {response && (
                    <div>
                        <h1 style={{
                            color: 'white',            // Use camelCase for CSS properties
                            fontSize: '32px',         // font-size becomes fontSize
                            textAlign: 'center',      // text-align becomes textAlign
                            fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                            fontWeight: 'lighter',        // Bold text
                            fontStyle: 'normal',       // Italic text
                        }}>
                            Response from Ai Solver
                        </h1>
                        <div>
                            <TypewriterRenderer content={response} />
                        </div>
                    </div>

                )}

                {responseEquations && (
                    <div>
                        <h1 style={{
                            color: 'white',            // Use camelCase for CSS properties
                            fontSize: '32px',         // font-size becomes fontSize
                            textAlign: 'center',      // text-align becomes textAlign
                            fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                            fontWeight: 'lighter',        // Bold text
                            fontStyle: 'normal',       // Italic text
                        }}>
                            Response from Ai Solver
                        </h1>
                        <div>
                            <TypewriterRendererResponse content={responseEquations} />
                        </div>
                    </div>

                )}

                {responseExample && (
                    <div>
                        <h1 style={{
                            color: 'white',            // Use camelCase for CSS properties
                            fontSize: '32px',         // font-size becomes fontSize
                            textAlign: 'center',      // text-align becomes textAlign
                            fontFamily: 'Segoe UI, sans-serif',  // font-family becomes fontFamily
                            fontWeight: 'lighter',        // Bold text
                            fontStyle: 'normal',       // Italic text
                        }}>
                            Response from Ai Solver
                        </h1>
                        <div>
                            <TypewriterRendererResponse content={responseExample} />
                        </div>
                    </div>

                )}
            </div>

        </div>
    );

}

const styles = {
    container: {
        display: 'flex',              // Enable Flexbox
        height: '100vh',              // Full viewport height
        justifyContent: 'space-between', // Space between the two sections
        padding: '0px',              // Padding for the container
        borderRadius: '20px',         // Rounded corners
        overflow: 'hidden',
        border: '20px solid rgb(139, 0, 0)',
        width: '99vw',

    },
    left: {
        flex: 1,  
        width: '50%',                 // Left section width
        backgroundColor: '#FFFFFF',   // Light gray background for the left section
        backgroundColor: '#FFFFFF',   // Light gray background for the left section
        padding: '0vw',
        borderRadius: '0px',         // Rounded corners
        overflow: 'auto',
        border: '3px solid rgb(211, 211, 211)',
        margin: '0px',
        border: '3px solid rgb(211, 211, 211)',
        margin: '0px',
    },
    right: {
        flex: 1,  
        width: '50%',                 // Right section width
        backgroundColor: '#FFFFFF',   // Light gray background for the right section
        backgroundColor: '#FFFFFF',   // Light gray background for the right section
        padding: '0vw',
        borderRadius: '0px',         // Rounded corners
        textAlign: 'left',            // Left align text in the typewriter
        overflow: 'auto',
        border: '3px solid rgb(211, 211, 211)',
        margin: '0px',
        border: '3px solid rgb(211, 211, 211)',
        margin: '0px',
    },
};

export default TopicSelector;
