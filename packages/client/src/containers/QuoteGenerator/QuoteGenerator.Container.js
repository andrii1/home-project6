/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './QuoteGenerator.Style.css';
import { apiURL } from '../../apiURL';
import useInputValidation from '../../utils/hooks/useInputValidation';
import { Button } from '../../components/Button/Button.component';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';
import { Sparkles, Copy } from 'lucide-react';
import Toast from '../../components/Toast/Toast.Component';
import { Loading } from '../../components/Loading/Loading.Component';

export const QuoteGenerator = () => {
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [value, setValue] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    'Write an optimistic quote about resilience in the style of Maya Angelou...',
  );
  const [prompt, promptError, validatePrompt] = useInputValidation('promptGpt');
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const createResponse = async (promptParam) => {
    let fullPrompt = 'Generate motivational quote.';
    if (promptParam) {
      fullPrompt += ` Use these guidelines: ${promptParam}`;
    }
    try {
      setLoading(true);
      const response = await fetch(`${apiURL()}/openai/chats`, {
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

      setQuote(data.response); // or `setReply(data.quote)` if API returns `{ quote: "..." }`
      setLoading(false);
      if (value) {
        setImageLoading(true);
        const imagePrompt = `An artistic, high-quality motivational poster image inspired by the quote: "${data.response}`;
        const imageRes = await fetch(`${apiURL()}/openai/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt }),
        });

        if (!imageRes.ok) throw new Error(`Image error: ${imageRes.status}`);
        const imageData = await imageRes.json();
        console.log('imageData', imageData);

        setImageUrl(imageData.imageUrl);
        setImageLoading(false);
      }
    } catch (err) {
      setQuote({ error: err.message });
    }
  };

  const createImage = async () => {
    try {
      setImageLoading(true);
      const imagePrompt = `An artistic, high-quality motivational poster image inspired by the quote: "${quote}`;
      const imageRes = await fetch(`${apiURL()}/openai/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!imageRes.ok) throw new Error(`Image error: ${imageRes.status}`);
      const imageData = await imageRes.json();
      setImageUrl(imageData.imageUrl);
      setImageLoading(false);
    } catch (err) {
      setQuote({ error: err.message });
    }
  };

  const createResponsePlaceholder = async () => {
    const fullPrompt =
      'Generate short  one sentence suggestion for creating motivational quotes, based on tone, topic, or author style (e.g., "Write an optimistic quote about resilience in the style of Maya Angelou").';
    try {
      const response = await fetch(`${apiURL()}/openai/chats`, {
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

  const handleCheckbox = () => {
    setValue(!value);
  };

  const handleRegenerate = () => {
    createImage();
  };

  const copyToClipboard = (item) => {
    navigator.clipboard.writeText(item);
    setOpenToast(true);
    setAnimation('open-animation');

    setTimeout(() => {
      setAnimation('close-animation');
    }, 2000);
    setTimeout(() => {
      setOpenToast(false);
    }, 2500);
  };

  console.log('loading', imageLoading);

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
              <label>
                <input
                  type="checkbox"
                  value={value}
                  onChange={handleCheckbox}
                />
                Image
              </label>
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
        {loading ? (
          <Loading />
        ) : (
          quote && (
            <section className="result-container">
              <h3>{quote}</h3>
              <button
                type="button"
                className="button-copy"
                onClick={() => copyToClipboard(quote)}
              >
                <Copy />
              </button>

              {imageLoading ? (
                <Loading />
              ) : (
                value &&
                imageUrl && (
                  <>
                    <img
                      className="img-ai"
                      src={imageUrl}
                      alt="AI-generated quote"
                    />
                    <Button
                      className="btn-regenerate"
                      primary
                      onClick={handleRegenerate}
                      label="Regenerate image"
                    />
                  </>
                )
              )}
              <Toast open={openToast} overlayClass={`toast ${animation}`}>
                <span>Copied to clipboard!</span>
              </Toast>
            </section>
          )
        )}
      </main>
    </>
  );
};
