import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { store } from './_helpers';
import { App } from './App';
import './index.css'

const theme = createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        main: "#000000"
      },
      secondary: {
        main: "#525963",
      }
    }
  });

render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);