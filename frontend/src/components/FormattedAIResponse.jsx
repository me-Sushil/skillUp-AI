// FormattedAIResponse.jsx
import React from 'react';

const FormattedAIResponse = ({ text }) => {
  // Parse the AI response to extract sections
  const parseResponse = (response) => {
    const sections = {
      explanation: '',
      example: '',
      summary: ''
    };

    // Split by section headers
    const explanationMatch = response.match(/EXPLANATION:([\s\S]*?)(?=EXAMPLE:|SUMMARY:|$)/i);
    const exampleMatch = response.match(/EXAMPLE:([\s\S]*?)(?=SUMMARY:|$)/i);
    const summaryMatch = response.match(/SUMMARY:([\s\S]*?)$/i);

    if (explanationMatch) sections.explanation = explanationMatch[1].trim();
    if (exampleMatch) sections.example = exampleMatch[1].trim();
    if (summaryMatch) sections.summary = summaryMatch[1].trim();

    return sections;
  };

  const sections = parseResponse(text);

  const formatText = (text) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return null;
      
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        return (
          <li key={index} className="ml-4 mb-2 text-slate-200">
            {trimmedLine.substring(1).trim()}
          </li>
        );
      }
      
      // Check if line ends with colon (likely a subheading)
      if (trimmedLine.endsWith(':')) {
        return (
          <p key={index} className="font-semibold text-violet-300 mt-3 mb-1">
            {trimmedLine}
          </p>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-2 text-slate-200 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  // Check if response has structured sections
  const hasStructuredResponse = sections.explanation || sections.example || sections.summary;

  if (!hasStructuredResponse) {
    // If no structured format, display as plain formatted text
    return (
      <div className="space-y-2">
        {formatText(text)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* EXPLANATION Section */}
      {sections.explanation && (
        <div className="bg-slate-700/30 rounded-lg p-4 border border-cyan-400/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-cyan-400">Explanation</h4>
          </div>
          <div className="space-y-2 pl-3">
            {formatText(sections.explanation)}
          </div>
        </div>
      )}

      {/* EXAMPLE Section */}
      {sections.example && (
        <div className="bg-slate-700/30 rounded-lg p-4 border border-violet-400/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-violet-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-violet-400">Example</h4>
          </div>
          <div className="bg-slate-900/50 rounded-md p-3 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {sections.example}
            </pre>
          </div>
        </div>
      )}

      {/* SUMMARY Section */}
      {sections.summary && (
        <div className="bg-slate-700/30 rounded-lg p-4 border border-fuchsia-400/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-fuchsia-400">Summary</h4>
          </div>
          <div className="space-y-2 pl-3">
            {formatText(sections.summary)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattedAIResponse;