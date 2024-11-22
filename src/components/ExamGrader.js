import React, { useState } from 'react';
import Typewriter from './Typewriter';
const currentUrl = window.location.href;

const ipAddress = currentUrl.split(':')[1].split('/')[2];

function ExamGrader() {
    const [questionImage, setQuestionImage] = useState('');
    const [markSchemeImage, setMarkSchemeImage] = useState('');
    const [studentSolutionImage, setStudentSolutionImage] = useState('');
    const [score, setScore] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionImageURL, setQuestionImageURL] = useState('');
    const [markSchemeImageURL, setMarkSchemeImageURL] = useState('');
    const [studentSolutionImageURL, setStudentSolutionImageURL] = useState('');

    const handlePaste = (event, setImage, setImageURL) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile(); // Get raw file
                setImage(file); // Store the raw File object directly
                const blobUrl = URL.createObjectURL(file);
                setImageURL(blobUrl);
                break;
            }
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        setLoading(true);
        // Assuming questionImage, markSchemeImage, and studentSolutionImage are Blob/File objects
        formData.append('questionImage', questionImage);
        formData.append('markSchemeImage', markSchemeImage);
        formData.append('studentSolutionImage', studentSolutionImage);

        try {
            const response = await fetch('http://' + ipAddress + ':200/api/grade', {
                method: 'POST',
                body: formData, // Send raw image data
            });

            const data = await response.json();
            setScore(data.score);
            setReason(data.reason)
            console.log('reaason:', score);
            console.log('score:', reason);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeQuestionImage = () => {
        setQuestionImage(null);
    };
    const removeMarkSchemeImage = () => {
        setMarkSchemeImage(null);
    };
    const removeStudentSolutionImage = () => {
        setStudentSolutionImage(null);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
          {/* Question Image */}
          {!questionImage && (
            <textarea
              placeholder="Paste Question Image Here"
              onPaste={(e) => handlePaste(e, setQuestionImage, setQuestionImageURL)}
              style={{ width: '30%', marginRight: '10px' }}
            />
          )}
          {questionImage && (
            <div>
              <h1>
                <Typewriter text="pasted question image:" speed={20} />
              </h1>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '10px',
                  padding: '40px',
                }}
              >
                <img
                  src={questionImageURL}
                  alt="Pasted content"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
                <button onClick={removeQuestionImage} style={{ marginTop: '10px' }}>
                  Remove Pasted Image
                </button>
              </div>
            </div>
          )}
      
          {/* Mark Scheme Image */}
          {!markSchemeImage && (
            <textarea
              placeholder="Paste Mark Scheme Image Here"
              onPaste={(e) => handlePaste(e, setMarkSchemeImage, setMarkSchemeImageURL)}
              style={{ width: '30%', marginRight: '10px' }}
            />
          )}
          {markSchemeImage && (
            <div>
              <h1>
                <Typewriter text="pasted mark scheme image:" speed={20} />
              </h1>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '10px',
                  padding: '40px',
                }}
              >
                <img
                  src={markSchemeImageURL}
                  alt="Pasted content"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
                <button onClick={removeMarkSchemeImage} style={{ marginTop: '10px' }}>
                  Remove Pasted Image
                </button>
              </div>
            </div>
          )}
      
          {/* Student Solution Image */}
          {!studentSolutionImage && (
            <textarea
              placeholder="Paste Student Solution Image Here"
              onPaste={(e) => handlePaste(e, setStudentSolutionImage, setStudentSolutionImageURL)}
              style={{ width: '30%', marginRight: '10px' }}
            />
          )}
          {studentSolutionImage && (
            <div>
              <h1>
                <Typewriter text="pasted student solution image:" speed={20} />
              </h1>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '10px',
                  padding: '40px',
                }}
              >
                <img
                  src={studentSolutionImageURL}
                  alt="Pasted content"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
                <button onClick={removeStudentSolutionImage} style={{ marginTop: '10px' }}>
                  Remove Pasted Image
                </button>
              </div>
            </div>
          )}
        </div>
      
        {/* Submit Button in Next Row */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Grading...' : 'Submit'}
          </button>
        </div>
      
        {/* Result Display */}
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
        <h1>
        <Typewriter text={`Score:\n ${score}  \n Reason:\n${reason}`} speed={20} />              </h1>
        </div>
      </div>
    );
    
}

export default ExamGrader;
