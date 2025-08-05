import { useState } from 'react';
import { QuestionnaireProvider } from '@/components/loan/QuestionnaireContext';
import { QuestionnaireFlow } from '@/components/loan/QuestionnaireFlow';
import { ProgressHeader } from '@/components/loan/ProgressHeader';

const LoanQuestionnaire = () => {
  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-background">
        <ProgressHeader />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <QuestionnaireFlow />
        </main>
      </div>
    </QuestionnaireProvider>
  );
};

export default LoanQuestionnaire;