import React from "react";
import { Container, Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Categories from "./components/Categories";
import FeaturedProjects from "./components/FeaturedProjects";
import WhyGreenRoots from "./components/WhyGreenRoots";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ChooseJourney from "./pages/ChooseJourney";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box component="main">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Container maxWidth="lg">
                  <HowItWorks />
                  <Categories />
                  <FeaturedProjects />
                  <WhyGreenRoots />
                </Container>
                <CTA />
              </>
            }
          />
          <Route path="/choose" element={<ChooseJourney />} />
          <Route
            path="*"
            element={
              <>
                <Hero />
                <Container maxWidth="lg">
                  <HowItWorks />
                  <Categories />
                  <FeaturedProjects />
                  <WhyGreenRoots />
                </Container>
                <CTA />
              </>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </BrowserRouter>
  );
}