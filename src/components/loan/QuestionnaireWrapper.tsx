import React from 'react';
import { QuestionnaireProvider } from './QuestionnaireContext';
import { ProgressHeader } from './ProgressHeader';
import { QuestionnaireFlow } from './QuestionnaireFlow';

export const QuestionnaireWrapper = () => {
  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-background">
        <ProgressHeader />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <QuestionnaireFlow />
        </main>
      </div>
    </QuestionnaireProvider>
  );
}; 