
import React from 'react';

interface ReportDisplayProps {
  report: string;
}

const renderSectionContent = (content: string, isTable: boolean) => {
  if (isTable) {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <p>{content}</p>; // Not a valid table

    const headerCells = rows[0].split('|').map(cell => cell.trim()).filter(Boolean);
    const bodyRows = rows.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-300">
          <thead className="bg-stone-50">
            <tr>
              {headerCells.map((header, index) => (
                <th key={index} scope="col" className="px-4 py-3 text-left text-sm font-semibold text-stone-900">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="whitespace-normal px-4 py-4 text-sm text-stone-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Handle lists and paragraphs
  return (
    <ul className="list-disc list-inside space-y-2 text-stone-700">
      {content.trim().split('\n').map((line, index) => {
        const cleanedLine = line.replace(/^- /, '').trim();
        if (cleanedLine) {
          return <li key={index}>{cleanedLine}</li>;
        }
        return null;
      })}
    </ul>
  );
};


const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  // Split report into sections based on the emoji headers
  const sections = report.split(/(?=📊|✅|⚠️|🏷️|📈|💡|🧾)/g).filter(s => s.trim());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 ring-1 ring-stone-200 space-y-8">
      {sections.map((section, index) => {
        const lines = section.trim().split('\n');
        const title = lines[0] || '';
        const content = lines.slice(1).join('\n');
        const isTable = title.includes('🏷️');

        return (
          <div key={index}>
            <h2 className="text-2xl font-bold text-amber-800 mb-4">{title}</h2>
            <div className="prose prose-stone max-w-none">
              {renderSectionContent(content, isTable)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportDisplay;
