import React, { useState, useEffect } from "react";
import { NewsCards } from "./components/index";
import alanBtn from "@alan-ai/alan-sdk-web";
import useStyles from "./styles";
import wordsToNumbers from "words-to-numbers";
import image from "./images/logo.png";
import { Typography, Paper } from "@material-ui/core";
import DarkModeToggle from "react-dark-mode-toggle";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const alanKey =
  "e8f98f6c7f8abaccd67d04c2eeba2b862e956eca572e1d8b807a3e2338fdd0dc/stage";
const App = () => {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();
  const [isDarkMode, setIsDarkMode] = useState(() => true);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];
          if (parsedNumber > 20) {
            alanBtn().playText("Please try that again...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          } else {
            alanBtn().playText("Please try that again...");
          }
        }
      },
    });
  }, []);
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : null}>
      <Paper>
        <div className={classes.darkButton}>
          <DarkModeToggle
            onChange={setIsDarkMode}
            checked={isDarkMode}
            size={60}
            className={classes.darkButton}
          />
        </div>
        <br />
        <br />
        <div className={classes.logoContainer}>
          <img src={image} className={classes.logo} alt="logo" />
        </div>
        <div>
          {newsArticles.length ? (
            <div className={classes.infoContainer}>
              <div className={classes.card}>
                <Typography variant="h5" component="h2">
                  Try saying: <br />
                  <br />
                  Open article
                  <br /> number [4]
                </Typography>
              </div>
              <div className={classes.card}>
                <Typography variant="h5" component="h2">
                  Try saying: <br />
                  <br />
                  Go back
                </Typography>
              </div>
            </div>
          ) : null}
        </div>
        <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by{" "}
            <a
              className={classes.link}
              href="https://www.linkedin.com/in/h4mm4d/"
            >
              Hammad Ansari
            </a>
          </Typography>
        </div>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
