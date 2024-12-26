import React, { useState } from 'react';
import { eigs } from 'mathjs'; 
import nerdamer from 'nerdamer';
import 'nerdamer/all';
import TypewriterResponsePlain from '../TypeWriterResponsePlain';

function matrixToNerdamerString(matrix) {
    const cleanedMatrix = matrix
        .filter(row => row.length > 0) 
        .map(row => row.map(element => element.toString().trim())); 

    return `matrix(${cleanedMatrix.map(row => `[${row.join(',')}]`).join(',')})`;
}

function matrixToDisplay(matrixRowTex) {
    const newMatrixTex = `\\[\n${matrixRowTex.replace(/\\/g, '\\\\').replace(/\\\\begin/g, '\\begin').replace(/\\\\end/g, '\\end').replace(/\\\\frac/g, '\\frac').replace(/cr/g, '').replace(/vmatrix/g, 'pmatrix')}\\]`;
    return newMatrixTex;
}

function matrixProduct(matrixA, matrixB) {
    const nerdamerMatrixA = matrixToNerdamerString(matrixA);
    const nerdamerMatrixB = matrixToNerdamerString(matrixB);
    nerdamer.setVar('A', nerdamerMatrixA);
    nerdamer.setVar('B', nerdamerMatrixB);
    return matrixToDisplay(nerdamer('A*B').toTeX());
}

function matrixInverse(matrix) {
    const nerdamerMatrix = matrixToNerdamerString(matrix);
    nerdamer.setVar('M', nerdamerMatrix);
    return matrixToDisplay(nerdamer('invert(M)').toTeX());
}

function fillMatrix(rows, cols, fillValue) {
    return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

function calculateEigenvaluesAndEigenvectors(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows !== cols) {
        throw new Error('Matrix must be square to calculate eigenvalues and eigenvectors.');
    }

    const eigenData = eigs(matrix);

    const eigenvaluesTeX = `Eigenvalues: \\[${eigenData.eigenvectors
        .map(eigen => eigen.value.toFixed(2))
        .join(', ')}\\]`;

    const eigenvectorsTeX = `Eigenvectors: \\[${eigenData.eigenvectors
        .map(eigen =>
            `\\begin{pmatrix}${eigen.vector
                .map(v => v.toFixed(2))
                .join('\\\\')}\\end{pmatrix}`
        )
        .join(', ')}\\]`;

    return {
        eigenvalues: eigenvaluesTeX,
        eigenvectors: eigenvectorsTeX,
    };
}

const MatrixOperationComponent = () => {
    const [matrixA, setMatrixA] = useState('');
    const [matrixB, setMatrixB] = useState('');
    const [result, setResult] = useState('');

    const handleMatrixProduct = () => {
        try {
            const parsedMatrixA = matrixA.split('\n').map(row => row.split(',').map(Number));
            const parsedMatrixB = matrixB.split('\n').map(row => row.split(',').map(Number));
            const product = matrixProduct(parsedMatrixA, parsedMatrixB);
            setResult(`Result: ${product}`);
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    const handleMatrixInverse = () => {
        try {
            const parsedMatrixA = matrixA.split('\n').map(row => row.split(',').map(Number));
            const inverse = matrixInverse(parsedMatrixA);
            setResult(`Inverse of Matrix A: ${inverse}`);
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    const handleEigenCalculation = () => {
        try {
            const parsedMatrixA = matrixA.split('\n').map(row => row.split(',').map(Number));
            const { eigenvalues, eigenvectors } = calculateEigenvaluesAndEigenvectors(parsedMatrixA);
            setResult(`${eigenvalues}\n${eigenvectors}`);
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    const fillMatrices = (fillValue) => {
        setMatrixA(fillMatrix(2, 2, fillValue).map(row => row.join(',')).join('\n'));
        setMatrixB(fillMatrix(2, 2, fillValue).map(row => row.join(',')).join('\n'));
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-center">Matrix Operations</h1>
            <div className="space-y-2">
                <label className="block text-lg">Matrix A</label>
                <textarea
                    value={matrixA}
                    onChange={(e) => setMatrixA(e.target.value)}
                    placeholder='example:
                    1,2
                    3,4'
                    className="w-full p-2 border rounded"
                    rows="3"
                ></textarea>
            </div>
            <div className="space-y-2">
                <label className="block text-lg">Matrix B</label>
                <textarea
                    value={matrixB}
                    onChange={(e) => setMatrixB(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                ></textarea>
            </div>
            <div className="space-y-4">
                <button
                    onClick={handleMatrixProduct}
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    Matrix Product
                </button>
                <button
                    onClick={handleMatrixInverse}
                    className="w-full bg-green-500 text-white py-2 rounded"
                >
                    Inverse of Matrix A
                </button>
                <button
                    onClick={handleEigenCalculation}
                    className="w-full bg-purple-500 text-white py-2 rounded"
                >
                    Eigenvalues and Eigenvectors of A
                </button>
                <button
                    onClick={() => fillMatrices(0)}
                    className="w-full bg-gray-500 text-white py-2 rounded"
                >
                    Fill Matrices with Zeros
                </button>
                <button
                    onClick={() => fillMatrices(1)}
                    className="w-full bg-gray-700 text-white py-2 rounded"
                >
                    Fill Matrices with Ones
                </button>
            </div>
            <div className="text-center p-2 border rounded bg-gray-100 text-lg font-mono">
                <TypewriterResponsePlain content={result} />
            </div>
        </div>
    );
};

export default MatrixOperationComponent;
