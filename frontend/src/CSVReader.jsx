import { useEffect } from 'react';
import Papa from 'papaparse';

const CSVReader = ({ setBooks }) => {
  useEffect(() => {
    fetch('/books.csv') 
      .then((response) => response.text()) 
      .then((csvData) => {
        Papa.parse(csvData, {
          complete: (result) => {
            setBooks(result.data); 
          },
          header: true,
        });
      })
      .catch((error) => console.error('Error loading CSV:', error)); 
  }, [setBooks]); 
  
  return null;  
};

export default CSVReader;
