import React, { useState } from 'react';
import TypewriterResponsePlain from '../TypeWriterResponsePlain';
import formulasData from './formulas.json'; 

const FormulasComponent = () => {
  const [selectedTitle, setSelectedTitle] = useState();

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const selectedFormulas = formulasData.formulas.find(
    (section) => section.title === selectedTitle
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Math Formulas</h1>
      <div className="mb-4">
        <label htmlFor="formula-select" className="block text-lg font-medium mb-2">
          Select Formula Category:
        </label>
        <select
          id="formula-select"
          className="p-2 border rounded w-full"
          value={selectedTitle}
          onChange={handleTitleChange}
        >
          {formulasData.formulas.map((section, index) => (
            <option key={index} value={section.title}>
              {section.title}
            </option>
          ))}
        </select>
      </div>

      {selectedFormulas && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{selectedFormulas.title}</h2>
          <ul className="list-disc pl-6">
            {selectedFormulas.formulas.map((formula, i) => (
              <li key={i} className="mb-1">
                <TypewriterResponsePlain content={formula} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormulasComponent;
