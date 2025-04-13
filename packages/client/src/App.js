import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Categories } from './containers/Categories/Categories.Container';
import { Quotes } from './containers/Quotes/Quotes.Container';
import { LandingPage } from './containers/LandingPage/LandingPage.Container';
import TestPage from './containers/TestPage/TestPage.Container';
import { Prompts } from './containers/Prompts/Prompts.Container';
import { QuoteView } from './containers/QuoteView/QuoteView.container';
import { Signup } from './containers/Signup/Signup.Container';
import Login from './containers/Login/Login.Container';
import Reset from './containers/Reset/Reset.Container';
import { Dashboard } from './containers/Dashboard/Dashboard.Container';
import { Bookmarks } from './containers/Bookmarks/Bookmarks.Container';
import { Faq } from './containers/Faq/Faq.Container';
import { Submit } from './containers/Submit/Submit.Container';
import { StripeSuccess } from './containers/StripeSuccess/StripeSuccess.Container';
import { StripeCancel } from './containers/StripeCancel/StripeCancel.Container';
import { PageNotFound } from './containers/PageNotFound/PageNotFound.Container';
import { Navigation } from './components/Navigation/Navigation.component';
import { Footer } from './components/Footer/Footer.component';
import { UserProvider } from './userContext';
import { AllAuthors } from './containers/AllAuthors/AllAuthors.Container';
import { Blog } from './containers/Blog/Blog.Container';

function App() {
  return (
    <div className="app">
      <Router>
        <UserProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Quotes />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/test" element={<Prompts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/blog" element={<Blog />} />
            <Route exact path="/quotes/:id" element={<QuoteView />} />
            <Route
              exact
              path="/quotes/author/:authorIdParam"
              element={<Quotes />}
            />
            <Route
              exact
              path="/quotes/search/:searchParam"
              element={<Quotes />}
            />
            {/* <Route
              exact
              path="/apps/category/:categoryIdParam"
              element={<Apps />}
            /> */}
            <Route path="/authors" element={<AllAuthors />} />
            <Route exact path="/faq" element={<Faq />} />
            <Route exact path="/quotes/new" element={<Submit />} />
            <Route exact path="/success" element={<StripeSuccess />} />
            <Route exact path="/cancel" element={<StripeCancel />} />
            <Route exact path="/bookmarks" element={<Bookmarks />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
