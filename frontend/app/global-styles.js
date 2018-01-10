import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  header {
    position: sticky !important;
    top: 0;
    z-index: 1050;
  }

  #app {
    background-color: #FFF;
  }

  main.container {
    margin-right: 0;
    margin-left: 0;
  }

  // Switch
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
  }

  .switch input {display:none;}

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 17px;
    width: 17px;
    left: 3px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #12ad65;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #12ad65;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 45px;
  }

  footer {
    padding-top: 10px;
  }

  .app-container {
    height: 100vh;
    width: 100vw;
  }

  .instance-details {
  }
  .instance-item {
    border-left: 5px solid transparent;
    color: #000;
    padding-top: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .instance-item:hover {
    background-color: rgba(255, 255, 255, .4);
  }
  .instance-item.disabled {
    border-left-color: #007bff;
    color: #007bff;
    background-color: #FFF;
  }
  .instance-state {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50px;
    background-color: grey;
    margin-right: 8px;
    vertical-align: -1px;
  }
  .instance-state.online {
    background-color: #4bd496;
  }
  .instance-state.offline {
    background-color: #fe6e43;
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    padding: 0;
    top: 3.5rem;
    z-index: 1000;
    -webkit-box-ordinal-group: 1;
    order: 0;
    background-color: #f6f7fb;
    border-right: 1px solid rgba(0,0,0,0.05);
  }

  .sidebar .instances {
    overflow-y: auto;
  }

  .sidebar .controls {
    position: sticky;
    bottom: 0;
    padding: 15px;
    border-top: 1px solid rgba(0,0,0,.05);
  }

  @media (min-width: 768px) {
    .sidebar {
      height: calc(100vh - 3.5rem);
    }
    .sidebar .instances {
      height: calc(100vh - 8rem);
    }
  }

  /* Spinner */
  .spinner {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    position: relative;
    margin: 0 auto;
    display: inline-block;
  }
  .spinner:before,
  .spinner:after {
    content: "";
    position: absolute;
    top: 4px;
    left: 8px;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 3px solid transparent;
    border-top-color: #3498db;
  }

  .spinner:before {
    z-index: 100;
    animation: spin 1s infinite;
  }

  .spinner:after {
    border: 3px solid #dedede;
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

`;
