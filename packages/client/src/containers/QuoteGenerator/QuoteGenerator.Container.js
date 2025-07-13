import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './QuoteGenerator.Style.css';
import { apiURL } from '../../apiURL';
import useInputValidation from '../../utils/hooks/useInputValidation';
import { Button } from '../../components/Button/Button.component';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';
import { Sparkles } from 'lucide-react';

export const QuoteGenerator = () => {
  const [reply, setReply] = useState('');
  const [placeholder, setPlaceholder] = useState(
    '"Write an optimistic quote about resilience in the style of Maya Angelou...',
  );
  const [prompt, promptError, validatePrompt] = useInputValidation('promptGpt');
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);

  const createResponse = async (promptParam) => {
    let fullPrompt = 'Generate motivational quote.';
    if (promptParam) {
      fullPrompt += ` Use these guidelines: ${promptParam}`;
    }
    try {
      const response = await fetch(`${apiURL()}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
        }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json(); // assuming your API returns JSON

      setReply(data.response); // or `setReply(data.quote)` if API returns `{ quote: "..." }`
    } catch (err) {
      setReply({ error: err.message });
    }
  };

  const createResponsePlaceholder = async () => {
    const fullPrompt =
      'Generate short  one sentence suggestion for creating motivational quotes, based on tone, topic, or author style (e.g., "Write an optimistic quote about resilience in the style of Maya Angelou").';
    try {
      const response = await fetch(`${apiURL()}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
        }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json(); // assuming your API returns JSON

      setPlaceholder(data.response); // or `setReply(data.quote)` if API returns `{ quote: "..." }`
    } catch (err) {
      setPlaceholder({ error: err.message });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createResponse(prompt);
  };

  const handlePlaceholder = () => {
    createResponsePlaceholder();
  };

  return (
    <>
      <Helmet>
        <title>AI quote generator - motivately</title>
      </Helmet>
      <main className="standard-container">
        <header>
          <h1>AI quote generator</h1>
        </header>

        <section className="form-box submit-box center">
          <form>
            <TextFormTextarea
              value={prompt}
              placeholder={placeholder}
              onChange={validatePrompt}
              error={promptError}
            />
            <div className="submit-group">
              <Sparkles onClick={handlePlaceholder} />
              <Button primary onClick={handleSubmit} label="Generate quote" />
            </div>
            {/* {validForm && (
              <Modal
                title="Your prompt has been submitted!"
                open={openConfirmationModal}
                toggle={
                  (() => setOpenConfirmationModal(false),
                  () => window.location.reload(true))
                }
              />
            )} */}
            {invalidForm && <p className="error-message">Form is not valid</p>}
          </form>
        </section>
        <section className="result-container">
          <h3>{reply && reply}</h3>
        </section>
      </main>
    </>
  );
};
